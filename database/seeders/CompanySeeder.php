<?php

namespace Database\Seeders;

use App\Models\Company;
use Illuminate\Database\Seeder;

class CompanySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Company::create([
            'name' => 'Keller Immobilien GmbH',
            'status' => 'active',
            'description' => 'Premium residential and commercial property management across Bavaria.',
            'address' => 'Maximilianstraße 35, Munich 80539',
            'phone' => '+49 89 123 456',
            'email' => 'info@keller-immo.de',
            'website' => 'keller-immo.de',
            'properties' => 48,
            'rc' => 'RC-987654',
            'if' => 'IF-123456',
            'patent' => 'PAT-112233',
            'fax' => '+49 89 123 457',
        ]);

        Company::create([
            'name' => 'BerlinWohnen AG',
            'status' => 'active',
            'description' => 'Specialist in Berlin residential real estate with a focus on modern living.',
            'address' => 'Friedrichstraße 100, Berlin 10117',
            'phone' => '+49 30 987 654',
            'email' => 'contact@berlinwohnen.de',
            'website' => 'berlinwohnen.de',
            'properties' => 32,
            'rc' => 'RC-112233',
            'if' => 'IF-445566',
            'patent' => 'PAT-778899',
            'fax' => '+49 30 987 655',
        ]);

        Company::create([
            'name' => 'Hanseatische Hausverwaltung',
            'status' => 'inactive',
            'description' => 'Full-service property management for the Hamburg metropolitan area.',
            'address' => 'Jungfernstieg 22, Hamburg 20354',
            'phone' => '+49 40 555 123',
            'email' => 'info@hh-hausverwaltung.de',
            'website' => 'hh-hausverwaltung.de',
            'properties' => 27,
            'rc' => 'RC-334455',
            'if' => 'IF-556677',
            'patent' => 'PAT-889900',
            'fax' => '+49 40 555 124',
        ]);

        Company::create([
            'name' => 'Rhein-Main Properties',
            'status' => 'active',
            'description' => 'Commercial and mixed-use property management in the Rhine-Main region.',
            'address' => 'Kaiserstraße 60, Frankfurt 60311',
            'phone' => '+49 69 444 789',
            'email' => 'hello@rheinmain-prop.de',
            'website' => 'rheinmain-prop.de',
            'properties' => 17,
            'rc' => 'RC-556677',
            'if' => 'IF-778899',
            'patent' => 'PAT-001122',
            'fax' => '+49 69 444 790',
        ]);

    }
}
