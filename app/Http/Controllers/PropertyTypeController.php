<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePropertyTypeRequest;
use App\Http\Requests\UpdatePropertyTypeRequest;
use App\Models\PropertyType;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PropertyTypeController extends Controller
{
    /**
     * Display a listing of property types.
     */
    public function index(Request $request): Response
    {
        $propertyTypes = PropertyType::orderBy('name', 'asc')
            ->get()
            ->map(function ($propertyType) {
                return [
                    'id' => (string) $propertyType->id,
                    'name' => $propertyType->name,
                    'description' => $propertyType->description,
                    'icon' => $propertyType->icon,
                    'propertiesCount' => 0,
                ];
            });

        return Inertia::render('PropertyTypes', [
            'propertyTypes' => $propertyTypes,
        ]);
    }

    /**
     * Store a newly created property type.
     */
    public function store(StorePropertyTypeRequest $request): RedirectResponse
    {
        PropertyType::create($request->validated());

        return redirect()
            ->route('property-types')
            ->with('success', 'Property type created successfully.');
    }

    /**
     * Update the specified property type.
     */
    public function update(UpdatePropertyTypeRequest $request, PropertyType $propertyType): RedirectResponse
    {
        $propertyType->update($request->validated());

        return redirect()
            ->route('property-types')
            ->with('success', 'Property type updated successfully.');
    }

    /**
     * Remove the specified property type.
     */
    public function destroy(PropertyType $propertyType): RedirectResponse
    {
        $propertyType->delete();

        return redirect()
            ->route('property-types')
            ->with('success', 'Property type deleted successfully.');
    }
}
