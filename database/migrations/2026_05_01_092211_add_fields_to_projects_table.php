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
        Schema::table('projects', function (Blueprint $table) {
            $table->text('description')->nullable()->after('name');
            $table->string('address')->nullable()->after('description');
            $table->string('budget')->nullable()->after('address');
            $table->string('start_date')->nullable()->after('budget');
            $table->integer('units')->default(0)->after('start_date');

            // Update status enum
            $table->string('status')->default('Planning')->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->dropColumn(['description', 'address', 'budget', 'start_date', 'units']);
            $table->enum('status', ['active', 'inactive'])->default('active')->change();
        });
    }
};
