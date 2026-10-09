<?php

namespace App\Http\Controllers;

use App\Actions\RegisterAttendeeAction;
use App\Actions\CancelRegistrationAction;
use App\Http\Requests\StoreRegistrationRequest;
use App\Models\Workshop;
use App\Models\Registration;
use Illuminate\Http\Request;

class RegistrationController extends Controller
{
    public function store(StoreRegistrationRequest $request, Workshop $workshop, RegisterAttendeeAction $action)
    {
        try {
            $action->execute($workshop, $request->validated(), $request->user());
            return redirect()->back()->with('success', 'Attendee registered successfully.');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['registration' => $e->getMessage()]);
        }
    }

    public function destroy(Request $request, Workshop $workshop, Registration $registration, CancelRegistrationAction $action)
    {
        if (!$request->user() || !$request->user()->hasAnyRole(['Manager', 'Staff'])) {
            abort(403);
        }

        try {
            $action->execute($registration, $request->user());
            return redirect()->back()->with('success', 'Registration cancelled successfully.');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['registration' => $e->getMessage()]);
        }
    }
}
