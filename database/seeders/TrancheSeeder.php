<?php

namespace Database\Seeders;

use App\Models\Project;
use App\Models\Tranche;
use Illuminate\Database\Seeder;

class TrancheSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Tranche::truncate();

        $projects = Project::all();

        if ($projects->isEmpty()) {
            return;
        }

        foreach ($projects as $project) {
            Tranche::create([
                'name' => 'Tranche A',
                'project_id' => $project->id,
                'status' => 'active',
            ]);

            Tranche::create([
                'name' => 'Tranche B',
                'project_id' => $project->id,
                'status' => 'active',
            ]);
        }
    }
}
