<?php

namespace App\Models;

use Yajra\Oci8\Eloquent\OracleEloquent;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FieldDefinition extends OracleEloquent
{
    protected $table = 'field_definitions';

    protected $fillable = [
        'form_template_id',
        'field_name',
        'field_label',
        'field_type',
        'validation_rules',
        'options',
        'sort_order',
        'is_required',
    ];

    protected function casts(): array
    {
        return [
            'validation_rules' => 'array',
            'options' => 'array',
            'is_required' => 'boolean',
            'sort_order' => 'integer',
        ];
    }

    public function formTemplate(): BelongsTo
    {
        return $this->belongsTo(FormTemplate::class);
    }
}
