<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Package extends Model
{
    use HasFactory;

    protected $fillable = [
        'package_id',
        'package_name',
        'version',
        'description',
        'support_contact',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($package) {
            if (empty($package->package_id)) {
                $package->package_id = Str::random(10);
            }
        });
    }

    public function machines(): BelongsToMany
    {
        return $this->belongsToMany(Machine::class, 'machine_package')
                    ->withTimestamps();
    }

    public function meta(): HasMany
    {
        return $this->hasMany(PackageMeta::class, 'package_id', 'package_id');
    }

    public function getMeta(string $key): ?string
    {
        return $this->meta()->where('key', $key)->value('value');
    }

    public function setMeta(string $key, string $value): void
    {
        $this->meta()->updateOrCreate(
            ['key' => $key],
            ['value' => $value]
        );
    }
} 