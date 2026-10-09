<?php

namespace App\Actions;

use App\Models\Workshop;

class CreateWorkshopAction
{
    public function execute(array $data): Workshop
    {
        return Workshop::create($data);
    }
}
