<?php

namespace App\Http\Controllers;

use App\Models\Bloc;
use App\Models\DocumentCategory;
use App\Models\ProjectDocument;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Str;

class ProjectDocumentController extends Controller
{
    /**
     * Display a listing of the resource for the given bloc.
     */
    public function index(Bloc $bloc): Response
    {
        $bloc->load('tranche.project');

        $documents = ProjectDocument::where('bloc_id', $bloc->id)
            ->with(['category', 'creator'])
            ->latest()
            ->get();

        $categories = DocumentCategory::orderBy('name')->get();

        return Inertia::render('Documents/Index', [
            'bloc' => $bloc,
            'documents' => $documents,
            'categories' => $categories,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, Bloc $bloc): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'document_category_id' => 'required|exists:document_categories,id',
            'file' => 'required|file|mimes:pdf,docx,xlsx,jpg,png|max:10240', // 10MB
        ]);

        try {
            DB::beginTransaction();

            $file = $request->file('file');
            $extension = $file->getClientOriginalExtension();
            $fileName = Str::uuid() . '.' . $extension;
            
            $path = $file->storeAs('', $fileName, 'project_documents');

            if (!$path) {
                throw new \Exception('Failed to store file.');
            }

            ProjectDocument::create([
                'name' => $validated['name'],
                'file_path' => $path,
                'file_size' => $file->getSize(),
                'extension' => $extension,
                'document_category_id' => $validated['document_category_id'],
                'bloc_id' => $bloc->id,
                'created_by' => $request->user()?->id,
                'updated_by' => $request->user()?->id,
            ]);

            DB::commit();

            return Redirect::back()->with('success', 'Document ajouté avec succès.');
        } catch (\Exception $e) {
            DB::rollBack();
            return Redirect::back()->with('error', 'Erreur lors de l\'enregistrement du document.');
        }
    }

    /**
     * Download the specified document.
     */
    public function download(ProjectDocument $document)
    {
        if (!Storage::disk('project_documents')->exists($document->file_path)) {
            abort(404, 'File not found on disk.');
        }

        return Storage::disk('project_documents')->download(
            $document->file_path, 
            $document->name . '.' . $document->extension
        );
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ProjectDocument $document): RedirectResponse
    {
        $document->delete();

        return Redirect::back()->with('success', 'Document supprimé avec succès.');
    }
}
