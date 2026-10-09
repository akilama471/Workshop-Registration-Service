<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RegistrationHistory extends Model
{
    /** @use HasFactory<\Database\Factories\RegistrationHistoryFactory> */
    use HasFactory;

    protected $fillable = [
        'registration_id',
        'action',
        'user_id',
    ];

    public function registration()
    {
        return $this->belongsTo(Registration::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
