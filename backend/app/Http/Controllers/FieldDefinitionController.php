<?php

namespace App\Http\Controllers;

use App\Models\FieldDefinition;
use App\Models\FormTemplate;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FieldDefinitionController extends Controller
{
    public function index(FormTemplate $formTemplate): JsonResponse
    {
        return response()->json($formTemplate->fieldDefinitions);
    }

    public function store(Request $request, FormTemplate $formTemplate): JsonResponse
    {
        $validated = $request->validate([
            'field_name' => 'required|string|max:100',
            'field_label' => 'required|string|max:255',
            'field_type' => 'required|in:text,number,date,boolean,select',
            'validation_rules' => 'nullable|array',
            'options' => 'nullable|array',
            'options.*.value' => 'required_with:options|string',
            'options.*.label' => 'required_with:options|string',
            'sort_order' => 'integer',
            'is_required' => 'boolean',
        ]);

        $validated['form_template_id'] = $formTemplate->id;

        if (isset($validated['validation_rules'])) {
            $validated['validation_rules'] = json_encode($validated['validation_rules']);
        }
        if (isset($validated['options'])) {
            $validated['options'] = json_encode($validated['options']);
        }

        $field = FieldDefinition::create($validated);

        return response()->json($field, 201);
    }

    public function show(FieldDefinition $fieldDefinition): JsonResponse
    {
        return response()->json($fieldDefinition);
    }

    public function update(Request $request, FieldDefinition $fieldDefinition): JsonResponse
    {
        $validated = $request->validate([
            'field_name' => 'sometimes|required|string|max:100',
            'field_label' => 'sometimes|required|string|max:255',
            'field_type' => 'sometimes|required|in:text,number,date,boolean,select',
            'validation_rules' => 'nullable|array',
            'options' => 'nullable|array',
            'options.*.value' => 'required_with:options|string',
            'options.*.label' => 'required_with:options|string',
            'sort_order' => 'integer',
            'is_required' => 'boolean',
        ]);

        if (isset($validated['validation_rules'])) {
            $validated['validation_rules'] = json_encode($validated['validation_rules']);
        }
        if (isset($validated['options'])) {
            $validated['options'] = json_encode($validated['options']);
        }

        $fieldDefinition->update($validated);

        return response()->json($fieldDefinition);
    }

    public function destroy(FieldDefinition $fieldDefinition): JsonResponse
    {
        $fieldDefinition->delete();

        return response()->json(null, 204);
    }

    public function bulkUpdate(Request $request, FormTemplate $formTemplate): JsonResponse
    {
        $validated = $request->validate([
            'fields' => 'required|array',
            'fields.*.id' => 'nullable|integer',
            'fields.*.field_name' => 'required|string|max:100',
            'fields.*.field_label' => 'required|string|max:255',
            'fields.*.field_type' => 'required|in:text,number,date,boolean,select',
            'fields.*.validation_rules' => 'nullable|array',
            'fields.*.options' => 'nullable|array',
            'fields.*.sort_order' => 'integer',
            'fields.*.is_required' => 'boolean',
        ]);

        $existingIds = [];

        foreach ($validated['fields'] as $fieldData) {
            $fieldData['form_template_id'] = $formTemplate->id;

            if (isset($fieldData['validation_rules'])) {
                $fieldData['validation_rules'] = json_encode($fieldData['validation_rules']);
            }
            if (isset($fieldData['options'])) {
                $fieldData['options'] = json_encode($fieldData['options']);
            }

            if (!empty($fieldData['id'])) {
                $field = FieldDefinition::where('id', $fieldData['id'])
                    ->where('form_template_id', $formTemplate->id)
                    ->first();

                if ($field) {
                    $field->update($fieldData);
                    $existingIds[] = $field->id;
                }
            } else {
                $field = FieldDefinition::create($fieldData);
                $existingIds[] = $field->id;
            }
        }

        // Delete fields not in the submitted list
        FieldDefinition::where('form_template_id', $formTemplate->id)
            ->whereNotIn('id', $existingIds)
            ->delete();

        return response()->json($formTemplate->fieldDefinitions()->get());
    }
}
