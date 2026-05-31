<?php

namespace Tests\Feature;

use App\Models\Bloc;
use App\Models\Client;
use App\Models\Company;
use App\Models\Contract;
use App\Models\Project;
use App\Models\Property;
use App\Models\PropertyType;
use App\Models\Tranche;
use App\Models\User;
use App\Services\ContractPdfService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ContractPdfTest extends TestCase
{
    use RefreshDatabase;

    protected User $admin;

    /**
     * Set up the test environment.
     */
    protected function setUp(): void
    {
        parent::setUp();

        $this->admin = User::factory()->create(['role' => 'admin']);
    }

    /**
     * Test that the contract PDF rendered view displays dynamic company data when available.
     */
    public function test_contract_pdf_renders_dynamic_company_data(): void
    {
        $company = Company::factory()->create([
            'name' => 'Acme Corporation',
            'address' => '123 Acme St, City',
            'rc' => 'RC-998877',
            'if' => 'IF-112233',
            'patent' => 'PAT-445566',
            'fax' => '+123456780',
            'phone' => '+123456789',
        ]);

        $project = Project::factory()->create(['company_id' => $company->id]);
        $tranche = Tranche::factory()->create(['project_id' => $project->id]);
        $bloc = Bloc::factory()->create(['tranche_id' => $tranche->id]);

        $propertyType = PropertyType::factory()->create();

        $property = Property::create([
            'name' => 'Unit 101',
            'bloc_id' => $bloc->id,
            'property_type_id' => $propertyType->id,
            'price' => 500000,
            'status' => 'available',
        ]);

        $client = Client::create([
            'full_name' => 'John Doe',
            'email' => 'john.doe@example.com',
            'phone' => '+123456789',
            'identity_number' => 'CIN-12345',
            'address' => '456 Test Lane',
        ]);

        $contract = Contract::create([
            'client_id' => $client->id,
            'property_id' => $property->id,
            'status' => 'active',
            'price' => 500000,
            'date' => now(),
        ]);

        $pdfService = new ContractPdfService;
        $clauses = $pdfService->getClauses($contract);

        $viewHtml = view('contracts.pdf', compact('contract', 'clauses'))->render();

        $this->assertStringContainsString('Acme Corporation', $viewHtml);
        $this->assertStringContainsString('123 Acme St, City', $viewHtml);
        $this->assertStringContainsString('RC-998877', $viewHtml);
        $this->assertStringContainsString('IF-112233', $viewHtml);
        $this->assertStringContainsString('PAT-445566', $viewHtml);
        $this->assertStringContainsString('+123456780', $viewHtml);
        $this->assertStringContainsString('+123456789', $viewHtml);
    }

    /**
     * Test that the contract PDF rendered view falls back to defaults when company data is missing or empty.
     */
    public function test_contract_pdf_falls_back_to_defaults_when_company_fields_are_null(): void
    {
        $company = Company::factory()->create([
            'rc' => null,
            'if' => null,
            'patent' => null,
            'phone' => null,
            'fax' => null,
        ]);

        $project = Project::factory()->create(['company_id' => $company->id]);
        $tranche = Tranche::factory()->create(['project_id' => $project->id]);
        $bloc = Bloc::factory()->create(['tranche_id' => $tranche->id]);

        $propertyType = PropertyType::factory()->create();

        $property = Property::create([
            'name' => 'Unit 102',
            'bloc_id' => $bloc->id,
            'property_type_id' => $propertyType->id,
            'price' => 400000,
            'status' => 'available',
        ]);

        $client = Client::create([
            'full_name' => 'Jane Doe',
            'email' => 'jane.doe@example.com',
            'phone' => '+987654321',
            'identity_number' => 'CIN-54321',
            'address' => '789 Other Lane',
        ]);

        $contract = Contract::create([
            'client_id' => $client->id,
            'property_id' => $property->id,
            'status' => 'active',
            'price' => 400000,
            'date' => now(),
        ]);

        $pdfService = new ContractPdfService;
        $clauses = $pdfService->getClauses($contract);

        $viewHtml = view('contracts.pdf', compact('contract', 'clauses'))->render();

        $this->assertStringContainsString('RC RRRRRRR', $viewHtml);
        $this->assertStringContainsString('IF YYYYYYYY', $viewHtml);
        $this->assertStringContainsString('Patente XXXXXXXX', $viewHtml);
        $this->assertStringContainsString('Tél : 05 36 88 77 33 / 06 44 444 444', $viewHtml);
    }

    /**
     * Test that the contract PDF rendered view shapes and connects Arabic characters correctly.
     */
    public function test_contract_pdf_renders_arabic_correctly(): void
    {
        $company = Company::factory()->create([
            'name' => 'شركة العقار',
            'address' => 'شارع السلام وجدة',
        ]);

        $project = Project::factory()->create(['company_id' => $company->id]);
        $tranche = Tranche::factory()->create(['project_id' => $project->id]);
        $bloc = Bloc::factory()->create(['tranche_id' => $tranche->id]);

        $propertyType = PropertyType::factory()->create();

        $property = Property::create([
            'name' => 'Unit 103',
            'bloc_id' => $bloc->id,
            'property_type_id' => $propertyType->id,
            'price' => 300000,
            'status' => 'available',
        ]);

        $client = Client::create([
            'full_name' => 'محمد علي',
            'email' => 'ali@example.com',
            'phone' => '+212600000000',
            'identity_number' => 'AB12345',
            'address' => 'الشارع الرئيسي الناظور',
        ]);

        $contract = Contract::create([
            'client_id' => $client->id,
            'property_id' => $property->id,
            'status' => 'active',
            'price' => 300000,
            'date' => now(),
        ]);

        $pdfService = new ContractPdfService;
        $clauses = $pdfService->getClauses($contract, 'ar');
        $lang = 'ar';

        $viewHtml = view('contracts.pdf', compact('contract', 'clauses', 'lang'))->render();

        // Title "عقد حجز محل تجاري" must be shaped as "ﺪﻘﻋ ﺰﺠﺣ ﻞﺤﻣ ﻱﺭﺎﺠﺗ"
        $this->assertStringContainsString('ﺪﻘﻋ ﺰﺠﺣ ﻞﺤﻣ ﻱﺭﺎﺠﺗ', $viewHtml);

        // "الطرف الأول" shaped as "ﻑﺮﻄﻟﺍ ﻝﻭﻷﺍ"
        $this->assertStringContainsString('ﻑﺮﻄﻟﺍ ﻝﻭﻷﺍ', $viewHtml);

        // "الطرف الثاني" shaped as "ﻑﺮﻄﻟﺍ ﻲﻧﺎﺜﻟﺍ"
        $this->assertStringContainsString('ﻑﺮﻄﻟﺍ ﻲﻧﺎﺜﻟﺍ', $viewHtml);
    }
}
