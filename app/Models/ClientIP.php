<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class ClientIP extends Model
{
    use HasFactory;

    protected $table = 'client_ips';

    protected $fillable = [
        'ip',
        'hostname',
        'client_id'
    ];

    public function client(): HasOne
    {
        return $this->hasOne(Client::class);
    }
    
} 