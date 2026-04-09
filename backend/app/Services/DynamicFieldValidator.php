<?php

namespace App\Services;

use Illuminate\Support\Collection;

class DynamicFieldValidator
{
    public function buildRules(Collection $fieldDefinitions): array
    {
        $rules = [];

        foreach ($fieldDefinitions as $field) {
            $fieldRules = [];

            $fieldRules[] = $field->is_required ? 'required' : 'nullable';

            match ($field->field_type) {
                'text' => $fieldRules[] = 'string',
                'number' => $fieldRules[] = 'numeric',
                'date' => $fieldRules[] = 'date',
                'boolean' => $fieldRules[] = 'boolean',
                'select' => $fieldRules[] = 'in:' . collect(is_string($field->options) ? json_decode($field->options, true) : $field->options)->pluck('value')->implode(','),
                default => null,
            };

            $validationRules = is_string($field->validation_rules) ? json_decode($field->validation_rules, true) : $field->validation_rules;
            if (is_array($validationRules)) {
                foreach ($validationRules as $rule => $value) {
                    match ($rule) {
                        'min' => $fieldRules[] = "min:{$value}",
                        'max' => $fieldRules[] = "max:{$value}",
                        'regex' => $fieldRules[] = "regex:{$value}",
                        default => null,
                    };
                }
            }

            $rules["data.{$field->field_name}"] = $fieldRules;
        }

        return $rules;
    }
}
