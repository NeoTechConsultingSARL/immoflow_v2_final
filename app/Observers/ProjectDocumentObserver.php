<?php

namespace App\Observers;

use App\Models\ProjectDocument;
use Illuminate\Support\Facades\Storage;

class ProjectDocumentObserver
{
    /**
     * Handle the ProjectDocument "deleted" event.
     */
    public function deleted(ProjectDocument $projectDocument): void
    {
        if (Storage::disk('project_documents')->exists($projectDocument->file_path)) {
            Storage::disk('project_documents')->delete($projectDocument->file_path);
        }
    }
}
