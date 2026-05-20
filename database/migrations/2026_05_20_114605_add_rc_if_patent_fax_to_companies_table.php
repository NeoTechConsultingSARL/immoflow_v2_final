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
            $table->string('rc')->nullable()->after('website');
            $table->string('if')->nullable()->after('rc');
            $table->string('patent')->nullable()->after('if');
            $table->string('fax', 45)->nullable()->after('patent');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('companies', function (Blueprint $table) {
            $table->dropColumn(['rc', 'if', 'patent', 'fax']);
        });
    }
};
