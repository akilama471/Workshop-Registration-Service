<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Workshop;

class CompletePastWorkshops extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'workshops:complete-past';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Mark scheduled workshops that have passed as completed';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $updated = Workshop::where('status', 'scheduled')
            ->where('starts_at', '<', now())
            ->update(['status' => 'completed']);
            
        $this->info("Updated {$updated} workshops to completed.");
    }
}
