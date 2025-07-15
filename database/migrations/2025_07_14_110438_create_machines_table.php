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
        Schema::create('machines', function (Blueprint $table) {
            $table->id();
            $table->string('machine_id')->unique()->default(Str::random(10));
            $table->string('hostname')->nullable();
            $table->longText('fingerprint');
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->foreignId('client_id')->constrained('clients')->onDelete('cascade');
            $table->foreignId('license_id')->constrained('licenses')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('machines');
    }
};
