<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('faces', function (Blueprint $table) {
            $table->id();
            $table->string('hash')->unique();              // hash unik tiap foto
            $table->string('file');                        // nama file gambar di storage
            $table->string('device_id')->nullable();       // ID ESP32
            $table->unsignedBigInteger('user_id')->nullable(); // bisa null (untuk demo invalid)
            $table->enum('status', ['pending','valid','invalid'])->default('pending');
            $table->float('confidence')->nullable();       // skor kepercayaan dari worker
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('faces');
    }
};
