<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

use Spatie\Permission\Models\Role;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class RolesAndPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        $adminRole = Role::firstOrCreate(['name' => 'Admin']);
        $managerRole = Role::firstOrCreate(['name' => 'Manager']);
        $staffRole = Role::firstOrCreate(['name' => 'Staff']);

        $admin = User::firstOrCreate([
            'email' => 'admin@example.com',
        ], [
            'name' => 'Super Admin',
            'password' => Hash::make('password'),
        ]);
        $admin->assignRole($adminRole);

        // Seed sample workshops
        \App\Models\Workshop::firstOrCreate(['code' => 'WK-001'], [
            'title' => 'Intro to Pottery',
            'instructor' => 'Jane Doe',
            'starts_at' => now()->addDays(2),
            'capacity' => 10,
            'status' => 'scheduled'
        ]);

        \App\Models\Workshop::firstOrCreate(['code' => 'WK-002'], [
            'title' => 'Advanced Coding',
            'instructor' => 'John Smith',
            'starts_at' => now()->addDays(5),
            'capacity' => 5,
            'status' => 'scheduled'
        ]);
    }
}
