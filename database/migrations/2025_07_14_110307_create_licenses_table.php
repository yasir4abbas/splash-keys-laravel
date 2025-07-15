<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('licenses', function (Blueprint $table) {
            $table->id();
            $table->string('license_id')->unique()->default(Str::random(10));
            $table->string('license_key')->unique();
            $table->integer('max_count')->default(99);
            $table->string('license_type');
            $table->string('expiration_date');
            $table->string('cost');
            $table->longText('renewal_terms')->nullable();
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->foreignId('package_id')->constrained('packages')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('licenses');
    }
};
