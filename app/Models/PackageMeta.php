<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PackageMeta extends Model
{
    use HasFactory;

    protected $table = 'packages_meta';

    protected $fillable = [
        'package_id',
        'key',
        'value',
    ];

    public function package(): BelongsTo
    {
        return $this->belongsTo(Package::class, 'package_id', 'package_id');
    }
} 