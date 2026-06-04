<?php

namespace App\Http\Controllers;

use App\Models\DocumentCategory;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Redirect;

class DocumentCategoryController extends Controller
{
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:document_categories,name',
        ]);

        DocumentCategory::create([
            'name' => $validated['name'],
            'created_by' => $request->user()?->id,
        ]);

        return Redirect::back()->with('success', 'Catégorie créée avec succès.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(DocumentCategory $documentCategory): RedirectResponse
    {
        if ($documentCategory->projectDocuments()->exists()) {
            return Redirect::back()->with('error', 'Impossible de supprimer cette catégorie car elle contient des documents.');
        }

        $documentCategory->delete();

        return Redirect::back()->with('success', 'Catégorie supprimée avec succès.');
    }
}
