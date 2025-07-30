<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Str;

class Machine extends Model
{
    use HasFactory;

    protected $fillable = [
        'machine_id',
        'hostname',
        'fingerprint',
        'status',
        'client_id',
        'license_id',
        'platform',
        'os',
        'cpu',
        'ip',
    ];

    protected $casts = [
        'status' => 'string',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($machine) {
            if (empty($machine->machine_id)) {
                $machine->machine_id = Str::random(10);
            }
        });
    }

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    public function license(): BelongsTo
    {
        return $this->belongsTo(License::class);
    }

    public function packages(): BelongsToMany
    {
        return $this->belongsToMany(Package::class, 'machine_package')
                    ->withTimestamps();
    }

} 