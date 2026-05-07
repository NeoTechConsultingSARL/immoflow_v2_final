<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePropertyRequest;
use App\Http\Requests\UpdatePropertyRequest;
use App\Models\Bloc;
use App\Models\Property;
use App\Models\PropertyType;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PropertyController extends Controller
{
    /**
     * Display a listing of properties.
     */
    public function index(Request $request): Response
    {
        $blocId = $request->query('bloc');
        $projectName = $request->query('project');
        $trancheName = $request->query('tranche');
        $blocName = $request->query('blocName');
        $typeKey = $request->query('type');

        $query = Property::with(['bloc.tranche.project', 'propertyType'])
            ->orderBy('created_at', 'desc');

        if ($blocId) {
            $query->where('bloc_id', $blocId);
        }

        if ($typeKey) {
            $query->whereHas('propertyType', function ($q) use ($typeKey) {
                $q->where('name', $typeKey);
            });
        }

        $properties = $query->get()
            ->map(function ($property) {
                $blocName = $property->bloc ? $property->bloc->name : 'N/A';
                $trancheName = $property->bloc && $property->bloc->tranche ? $property->bloc->tranche->name : 'N/A';
                $projectName = $property->bloc && $property->bloc->tranche && $property->bloc->tranche->project ? $property->bloc->tranche->project->name : 'N/A';
                $propertyTypeName = $property->propertyType ? $property->propertyType->name : 'N/A';

                return [
                    'id' => (string) $property->id,
                    'name' => $property->name,
                    'blocId' => (string) $property->bloc_id,
                    'blocName' => $blocName,
                    'trancheName' => $trancheName,
                    'projectName' => $projectName,
                    'propertyTypeId' => (string) $property->property_type_id,
                    'propertyTypeName' => $propertyTypeName,
                    'propertyTypeIcon' => $property->propertyType ? $property->propertyType->icon : 'Building',
                    'price' => (float) $property->price,
                    'status' => $property->status,
                ];
            });

        $blocs = Bloc::with(['tranche.project'])->orderBy('name', 'asc')->get()->map(function ($bloc) {
            return [
                'id' => (string) $bloc->id,
                'name' => $bloc->name,
                'trancheName' => $bloc->tranche->name ?? 'N/A',
                'projectName' => $bloc->tranche->project->name ?? 'N/A',
            ];
        });

        $propertyTypes = PropertyType::orderBy('name', 'asc')->get()->map(function ($type) {
            return [
                'id' => (string) $type->id,
                'name' => $type->name,
                'icon' => $type->icon,
            ];
        });

        return Inertia::render('Properties', [
            'properties' => $properties,
            'blocs' => $blocs,
            'propertyTypes' => $propertyTypes,
            'filters' => [
                'bloc' => $blocId,
                'project' => $projectName,
                'tranche' => $trancheName,
                'blocName' => $blocName,
                'type' => $typeKey,
            ],
        ]);
    }

    /**
     * Store a newly created property.
     */
    public function store(StorePropertyRequest $request): RedirectResponse
    {
        Property::create($request->validated());

        return back()
            ->with('success', 'Property created successfully.');
    }

    /**
     * Update the specified property.
     */
    public function update(UpdatePropertyRequest $request, Property $property): RedirectResponse
    {
        $property->update($request->validated());

        return back()
            ->with('success', 'Property updated successfully.');
    }

    /**
     * Remove the specified property.
     */
    public function destroy(Property $property): RedirectResponse
    {
        $property->delete();

        return redirect()
            ->route('properties')
            ->with('success', 'Property deleted successfully.');
    }
}
