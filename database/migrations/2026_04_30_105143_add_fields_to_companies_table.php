<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('companies', function (Blueprint $table) {
            $table->text('description')->nullable();
            $table->string('email', 255)->nullable();
            $table->text('address')->nullable();
            $table->string('phone', 45)->nullable();
            $table->string('website', 255)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('companies', function (Blueprint $table) {
            $table->dropColumn(['description', 'email', 'address', 'phone', 'website']);
        });
    }
};
