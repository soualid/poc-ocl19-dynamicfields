<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('entities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('form_template_id')->constrained('form_templates');
            $table->text('data');
            $table->timestamps();
        });

        DB::statement('ALTER TABLE entities ADD CONSTRAINT chk_entity_data_json CHECK (data IS JSON)');
    }

    public function down(): void
    {
        Schema::dropIfExists('entities');
    }
};
