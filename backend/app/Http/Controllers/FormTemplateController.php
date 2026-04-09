<?php

namespace App\Http\Controllers;

use App\Models\FormTemplate;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FormTemplateController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(FormTemplate::orderBy('id', 'desc')->get());
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        $template = FormTemplate::create($validated);

        return response()->json($template, 201);
    }

    public function show(FormTemplate $formTemplate): JsonResponse
    {
        $formTemplate->load('fieldDefinitions');

        return response()->json($formTemplate);
    }

    public function update(Request $request, FormTemplate $formTemplate): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        $formTemplate->update($validated);

        return response()->json($formTemplate);
    }

    public function destroy(FormTemplate $formTemplate): JsonResponse
    {
        $formTemplate->delete();

        return response()->json(null, 204);
    }
}
