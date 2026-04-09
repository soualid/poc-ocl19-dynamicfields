<?php

namespace App\Models;

use Yajra\Oci8\Eloquent\OracleEloquent;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Entity extends OracleEloquent
{
    protected $table = 'entities';

    protected $fillable = ['form_template_id', 'data'];

    protected function casts(): array
    {
        return [
            'data' => 'array',
        ];
    }

    public function formTemplate(): BelongsTo
    {
        return $this->belongsTo(FormTemplate::class);
    }
}
