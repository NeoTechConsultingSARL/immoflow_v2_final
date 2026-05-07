<?php

namespace App\Http\Controllers;

use App\Http\Requests\ClientRequest;
use App\Models\Client;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ClientController extends Controller
{
    /**
     * Display a listing of clients.
     */
    public function index(): Response
    {
        $clients = Client::orderBy('full_name', 'asc')->get();

        return Inertia::render('Clients', [
            'clients' => $clients,
        ]);
    }

    /**
     * Store a newly created client.
     */
    public function store(ClientRequest $request): RedirectResponse
    {
        Client::create($request->validated());

        return redirect()
            ->route('clients')
            ->with('success', 'Client created successfully.');
    }

    /**
     * Update the specified client.
     */
    public function update(ClientRequest $request, Client $client): RedirectResponse
    {
        $client->update($request->validated());

        return redirect()
            ->route('clients')
            ->with('success', 'Client updated successfully.');
    }
}
