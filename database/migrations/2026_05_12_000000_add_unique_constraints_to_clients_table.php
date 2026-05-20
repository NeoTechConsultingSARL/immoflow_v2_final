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
            // Add unique constraints to nullable fields
            $table->unique('email');
            $table->unique('identity_number');

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
            $table->dropUnique(['email']);
            $table->dropUnique(['identity_number']);

            // Revert to non-nullable without unique (original state)
            $table->string('email')->unique()->change();
            $table->string('identity_number')->unique()->change();

            // Revert type back to original enum
            $table->enum('type', ['Lead', 'Prospect', 'Owner'])->default('Lead')->change();
        });
    }
};
