<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('field_definitions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('form_template_id')->constrained('form_templates')->cascadeOnDelete();
            $table->string('field_name', 100);
            $table->string('field_label', 255);
            $table->string('field_type', 50);
            $table->text('validation_rules')->nullable();
            $table->text('options')->nullable();
            $table->integer('sort_order')->default(0);
            $table->boolean('is_required')->default(false);
            $table->timestamps();
        });

        DB::statement('ALTER TABLE field_definitions ADD CONSTRAINT chk_validation_json CHECK (validation_rules IS JSON OR validation_rules IS NULL)');
        DB::statement('ALTER TABLE field_definitions ADD CONSTRAINT chk_options_json CHECK (options IS JSON OR options IS NULL)');
    }

    public function down(): void
    {
        Schema::dropIfExists('field_definitions');
    }
};
