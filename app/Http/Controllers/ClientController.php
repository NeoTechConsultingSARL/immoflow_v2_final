<?php

namespace App\Http\Controllers;

<<<<<<< Updated upstream
use App\Http\Requests\ClientRequest;
use App\Models\Client;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
=======
use App\Models\Client;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Validation\Rule;
>>>>>>> Stashed changes

class ClientController extends Controller
{
    /**
<<<<<<< Updated upstream
     * Display a listing of clients.
     */
    public function index(): Response
    {
        $clients = Client::orderBy('full_name', 'asc')->get();

        return Inertia::render('Clients', [
            'clients' => $clients,
=======
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Client::query();

        // Search functionality
        if ($request->has('search')) {
            $search = $request->get('search');
            $query->where(function ($q) use ($search) {
                $q->where('full_name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%")
                  ->orWhere('identity_number', 'like', "%{$search}%");
            });
        }

        // Filter by type
        if ($request->has('type') && $request->get('type')) {
            $query->where('type', $request->get('type'));
        }

        $clients = $query->latest()->paginate(10);

        return Inertia::render('Clients/Index', [
            'clients' => $clients,
            'filters' => $request->only(['search', 'type']),
>>>>>>> Stashed changes
        ]);
    }

    /**
<<<<<<< Updated upstream
     * Store a newly created client.
     */
    public function store(ClientRequest $request): RedirectResponse
    {
        Client::create($request->validated());

        return redirect()
            ->route('clients')
=======
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Clients/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'full_name' => 'required|string|max:255',
            'email' => 'nullable|email|max:255|unique:clients,email',
            'phone' => 'nullable|string|max:20',
            'identity_number' => 'nullable|string|max:50|unique:clients,identity_number',
            'address' => 'nullable|string|max:500',
            'type' => 'required|in:individual,company,lead,prospect,owner',
        ]);

        Client::create($validated);

        return redirect()->route('clients.index')
>>>>>>> Stashed changes
            ->with('success', 'Client created successfully.');
    }

    /**
<<<<<<< Updated upstream
     * Update the specified client.
     */
    public function update(ClientRequest $request, Client $client): RedirectResponse
    {
        $client->update($request->validated());

        return redirect()
            ->route('clients')
            ->with('success', 'Client updated successfully.');
    }
=======
     * Display the specified resource.
     */
    public function show(Client $client)
    {
        $client->load(['contracts' => function ($query) {
            $query->with(['property.bloc.tranche.project.company'])
                  ->latest();
        }]);

        return Inertia::render('Clients/Show', [
            'client' => $client,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Client $client)
    {
        return Inertia::render('Clients/Edit', [
            'client' => $client,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Client $client)
    {
        $validated = $request->validate([
            'full_name' => 'required|string|max:255',
            'email' => [
                'nullable',
                'email',
                'max:255',
                Rule::unique('clients')->ignore($client->id),
            ],
            'phone' => 'nullable|string|max:20',
            'identity_number' => [
                'nullable',
                'string',
                'max:50',
                Rule::unique('clients')->ignore($client->id),
            ],
            'address' => 'nullable|string|max:500',
            'type' => 'required|in:individual,company,lead,prospect,owner',
        ]);

        $client->update($validated);

        return redirect()->route('clients.index')
            ->with('success', 'Client updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     * NOTE: Destroy method is intentionally not implemented as per requirements
     */
    // public function destroy(Client $client)
    // {
    //     // No delete functionality allowed
    // }
>>>>>>> Stashed changes
}
