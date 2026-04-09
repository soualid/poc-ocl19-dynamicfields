<?php

use App\Http\Controllers\EntityController;
use App\Http\Controllers\FieldDefinitionController;
use App\Http\Controllers\FormTemplateController;
use Illuminate\Support\Facades\Route;

Route::apiResource('form-templates', FormTemplateController::class);

Route::apiResource('form-templates.field-definitions', FieldDefinitionController::class)->shallow();

Route::put('form-templates/{form_template}/field-definitions/bulk', [FieldDefinitionController::class, 'bulkUpdate']);

Route::apiResource('form-templates.entities', EntityController::class)->shallow();
