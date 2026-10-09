<?php

namespace App\Actions;

use App\Models\Workshop;
use App\Models\Registration;
use App\Models\RegistrationHistory;
use Illuminate\Support\Facades\DB;
use Exception;

class RegisterAttendeeAction
{
    public function execute(Workshop $workshop, array $data, $user = null): Registration
    {
        return DB::transaction(function () use ($workshop, $data, $user) {
            $lockedWorkshop = Workshop::where('id', $workshop->id)->lockForUpdate()->first();
            
            $activeCount = $lockedWorkshop->registrations()->where('status', 'active')->count();
            
            if ($activeCount >= $lockedWorkshop->capacity) {
                throw new Exception('This workshop is fully booked.');
            }
            
            $registration = Registration::create([
                'workshop_id' => $lockedWorkshop->id,
                'name' => $data['name'],
                'email' => $data['email'],
                'status' => 'active',
                'created_by' => $user ? $user->id : null,
            ]);
            
            RegistrationHistory::create([
                'registration_id' => $registration->id,
                'action' => 'registered',
                'user_id' => $user ? $user->id : null,
            ]);
            
            return $registration;
        });
    }
}
