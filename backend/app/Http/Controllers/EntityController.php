<?php

namespace App\Http\Controllers;

use App\Models\Entity;
use App\Models\FormTemplate;
use App\Services\DynamicFieldValidator;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class EntityController extends Controller
{
    public function __construct(
        private DynamicFieldValidator $validator
    ) {}

    public function index(FormTemplate $formTemplate): JsonResponse
    {
        $entities = $formTemplate->entities()->orderBy('id', 'desc')->get();

        return response()->json([
            'entities' => $entities,
            'field_definitions' => $formTemplate->fieldDefinitions,
        ]);
    }

    public function store(Request $request, FormTemplate $formTemplate): JsonResponse
    {
        $fieldDefinitions = $formTemplate->fieldDefinitions;
        $rules = $this->validator->buildRules($fieldDefinitions);

        $validated = $request->validate($rules);

        $entity = $formTemplate->entities()->create([
            'data' => $validated['data'] ?? [],
        ]);

        return response()->json($entity, 201);
    }

    public function show(Entity $entity): JsonResponse
    {
        $entity->load('formTemplate.fieldDefinitions');

        return response()->json($entity);
    }

    public function update(Request $request, Entity $entity): JsonResponse
    {
        $formTemplate = $entity->formTemplate;
        $fieldDefinitions = $formTemplate->fieldDefinitions;
        $rules = $this->validator->buildRules($fieldDefinitions);

        $validated = $request->validate($rules);

        $entity->update([
            'data' => $validated['data'] ?? [],
        ]);

        return response()->json($entity);
    }

    public function destroy(Entity $entity): JsonResponse
    {
        $entity->delete();

        return response()->json(null, 204);
    }
}
