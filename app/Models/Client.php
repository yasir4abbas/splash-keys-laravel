<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

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

    public function licenses(): HasManyThrough
    {
        return $this->hasManyThrough(License::class, Machine::class, 'client_id', 'id', 'id', 'license_id');
    }
    
} 