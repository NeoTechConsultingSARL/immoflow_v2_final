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
        Schema::create('syndics', function (Blueprint $table): void {
            $table->id();
            $table->date('date');
            $table->decimal('montant', 12, 2);
            $table->enum('status', ['Valide', 'Non Valide'])->default('Non Valide');
            $table->foreignId('client_id')->constrained('clients')->cascadeOnDelete();
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
        Schema::dropIfExists('syndics');
    }
};
