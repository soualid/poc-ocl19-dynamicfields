<?php

namespace App\Models;

use Yajra\Oci8\Eloquent\OracleEloquent;
use Illuminate\Database\Eloquent\Relations\HasMany;

class FormTemplate extends OracleEloquent
{
    protected $table = 'form_templates';

    protected $fillable = ['name', 'description', 'is_active'];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }

    public function fieldDefinitions(): HasMany
    {
        return $this->hasMany(FieldDefinition::class)->orderBy('sort_order');
    }

    public function entities(): HasMany
    {
        return $this->hasMany(Entity::class);
    }
}
