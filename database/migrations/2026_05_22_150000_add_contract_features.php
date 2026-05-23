<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('contracts', function (Blueprint $table) {
            $table->string('contract_number')->unique()->nullable()->after('id');
            $table->decimal('advance', 15, 2)->nullable()->after('price');
            $table->integer('payment_duration')->nullable()->comment('in months');
            $table->integer('payment_frequency')->nullable()->comment('in months');
        });

        Schema::create('contract_modifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('contract_id')->constrained('contracts')->cascadeOnDelete();
            $table->text('notes')->nullable();
            $table->string('image_path')->nullable();
            $table->timestamps();
        });

        Schema::create('payment_schedules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('contract_id')->constrained('contracts')->cascadeOnDelete();
            $table->date('due_date');
            $table->decimal('amount', 15, 2);
            $table->string('observation')->nullable();
            $table->timestamps();
        });

        Schema::create('contract_commissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('contract_id')->constrained('contracts')->cascadeOnDelete();
            $table->string('broker_name');
            $table->decimal('amount', 15, 2);
            $table->text('description')->nullable();
            $table->string('status')->default('pending');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('contract_commissions');
        Schema::dropIfExists('payment_schedules');
        Schema::dropIfExists('contract_modifications');
        
        Schema::table('contracts', function (Blueprint $table) {
            $table->dropColumn(['contract_number', 'advance', 'payment_duration', 'payment_frequency']);
        });
    }
};
