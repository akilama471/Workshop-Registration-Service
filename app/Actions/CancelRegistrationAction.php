<?php

namespace App\Actions;

use App\Models\Registration;
use App\Models\RegistrationHistory;
use Illuminate\Support\Facades\DB;
use Exception;

class CancelRegistrationAction
{
    public function execute(Registration $registration, $user = null): Registration
    {
        return DB::transaction(function () use ($registration, $user) {
            if ($registration->status === 'cancelled') {
                throw new Exception('Registration is already cancelled.');
            }
            
            $registration->update(['status' => 'cancelled']);
            
            RegistrationHistory::create([
                'registration_id' => $registration->id,
                'action' => 'cancelled',
                'user_id' => $user ? $user->id : null,
            ]);
            
            return $registration;
        });
    }
}
