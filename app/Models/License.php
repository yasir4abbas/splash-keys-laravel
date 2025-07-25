<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class License extends Model
{
    use HasFactory;

    protected $fillable = [
        'license_key',
        'license_type',
        'max_count',
        'expiration_date',
        'cost',
        'renewal_terms',
        'status',
        'package_id',
    ];

    protected $casts = [
        'status' => 'string',
        'expiration_date' => 'date:Y-m-d',
        'cost' => 'decimal:2',
        'max_count' => 'integer',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($license) {
            if (empty($license->license_id)) {
                $license->license_id = Str::random(10);
            }
        });
    }

    public function package(): BelongsTo
    {
        return $this->belongsTo(Package::class);
    }

    public function machines(): HasMany
    {
        return $this->hasMany(Machine::class);
    }
} 