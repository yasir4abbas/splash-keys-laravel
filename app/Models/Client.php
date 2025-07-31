<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Client extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'email',
        'start_date',
    ];

    protected $casts = [
        'start_date' => 'date',
        'access_level' => 'string',
    ];

    public function machines(): HasMany
    {
        return $this->hasMany(Machine::class);
    }

    public function clientIPs(): HasMany
    {
        return $this->hasMany(ClientIP::class);
    }
    
} 