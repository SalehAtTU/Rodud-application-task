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
    Schema::create('shipments', function (Blueprint $table) {
        $table->id();
        $table->foreignId('user_id')->constrained()->onDelete('cascade');
        
        // pickup + dropoff
        $table->string('pickup_address');
        $table->decimal('pickup_latitude', 10, 7);
        $table->decimal('pickup_longitude', 10, 7);
        $table->string('dropoff_address');
        $table->decimal('dropoff_latitude', 10, 7);
        $table->decimal('dropoff_longitude', 10, 7);

        // cargo
        $table->string('cargo_type');
        $table->string('weight');
        $table->string('truck_type');

        // scheduling (you can adjust to dates or timestamps)
        $table->dateTime('pickup_date');
        $table->dateTime('dropoff_date');

        // status
        $table->string('status')->default('pending');

        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shipments');
    }
};
