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
        Schema::create('syndic_charges', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('syndic_charge_type_id')->constrained('syndic_charge_types')->cascadeOnDelete();
            $table->date('date_operation');
            $table->decimal('montant', 12, 2);
            $table->string('designation')->nullable();
            $table->string('societe')->nullable();
            $table->foreignId('bloc_id')->constrained('blocs')->cascadeOnDelete();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('syndic_charges');
    }
};
