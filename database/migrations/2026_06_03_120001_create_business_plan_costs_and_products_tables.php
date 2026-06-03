<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('business_plan_costs', function (Blueprint $table) {
            $table->id();
            $table->string('cost_type', 255);
            $table->decimal('land_size', 12, 2)->nullable();
            $table->decimal('unit_price', 12, 2)->nullable();
            $table->decimal('amount', 12, 2);
            $table->text('description')->nullable();
            $table->foreignId('bloc_id')->constrained('blocs')->cascadeOnDelete();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });

        Schema::create('business_plan_products', function (Blueprint $table) {
            $table->id();
            $table->string('product_type', 255);
            $table->decimal('land_size', 12, 2)->nullable();
            $table->decimal('unit_price', 12, 2)->nullable();
            $table->decimal('amount', 12, 2);
            $table->text('description')->nullable();
            $table->foreignId('bloc_id')->constrained('blocs')->cascadeOnDelete();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('business_plan_products');
        Schema::dropIfExists('business_plan_costs');
    }
};
