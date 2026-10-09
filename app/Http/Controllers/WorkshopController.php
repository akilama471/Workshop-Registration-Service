<?php

namespace App\Http\Controllers;

use App\Actions\CreateWorkshopAction;
use App\Actions\UpdateWorkshopAction;
use App\Http\Requests\StoreWorkshopRequest;
use App\Http\Requests\UpdateWorkshopRequest;
use App\Models\Workshop;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WorkshopController extends Controller
{
    public function index(Request $request)
    {
        $query = Workshop::query()->withCount(['registrations as active_registrations_count' => function ($q) {
            $q->where('status', 'active');
        }]);

        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }

        // Add more filters as needed
        
        $workshops = $query->orderBy('starts_at', 'asc')->get();
        
        return Inertia::render('Workshops/Index', [
            'workshops' => $workshops,
            'filters' => $request->only(['status']),
        ]);
    }

    public function show(Workshop $workshop)
    {
        if (request()->user()->hasAnyRole(['Manager', 'Staff'])) {
            $workshop->load(['registrations.creator', 'registrations.history.user']);
        }
        
        $workshop->loadCount(['registrations as active_registrations_count' => function ($q) {
            $q->where('status', 'active');
        }]);

        return Inertia::render('Workshops/Show', [
            'workshop' => $workshop,
        ]);
    }

    public function store(StoreWorkshopRequest $request, CreateWorkshopAction $action)
    {
        $action->execute($request->validated());
        return redirect()->route('workshops.index')->with('success', 'Workshop created successfully.');
    }

    public function update(UpdateWorkshopRequest $request, Workshop $workshop, UpdateWorkshopAction $action)
    {
        $action->execute($workshop, $request->validated());
        return redirect()->back()->with('success', 'Workshop updated successfully.');
    }
}
