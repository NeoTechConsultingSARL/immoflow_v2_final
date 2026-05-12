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
        Schema::table('clients', function (Blueprint $table) {
            // Add unique constraints to email and identity_number
            $table->string('email')->nullable()->unique()->change();
            $table->string('identity_number')->nullable()->unique()->change();
            
            // Change type to enum with specific values
            $table->enum('type', ['individual', 'company', 'lead', 'prospect', 'owner'])->default('individual')->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('clients', function (Blueprint $table) {
            // Remove unique constraints
            $table->string('email')->nullable()->change();
            $table->string('identity_number')->nullable()->change();
            
            // Revert type back to string
            $table->string('type')->default('individual')->change();
        });
    }
};
