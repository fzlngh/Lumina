<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
public function up()
{
    Schema::create('face_logs', function (Blueprint $table) {
        $table->id();
        $table->string('hash')->unique();
        $table->string('device_id')->nullable();
        $table->timestamp('timestamp')->nullable();
        $table->string('result')->nullable(); // match/no_match/pending
        $table->float('confidence')->nullable();
        $table->timestamps();
    });
}


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('face_logs');
    }
};
