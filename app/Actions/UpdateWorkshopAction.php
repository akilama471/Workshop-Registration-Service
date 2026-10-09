<?php

namespace App\Actions;

use App\Models\Workshop;

class UpdateWorkshopAction
{
    public function execute(Workshop $workshop, array $data): Workshop
    {
        $workshop->update($data);
        return $workshop;
    }
}
