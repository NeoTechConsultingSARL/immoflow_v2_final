<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Contrat #{{ $contract->id }}</title>
    <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333; line-height: 1.5; font-size: 14px; }
        .header { border-bottom: 2px solid #000; padding-bottom: 20px; margin-bottom: 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; color: #1a1a1a; }
        .header p { margin: 5px 0 0; color: #666; font-size: 16px; }
        .section { margin-bottom: 30px; }
        .section-title { font-size: 18px; font-weight: bold; border-bottom: 1px solid #ccc; padding-bottom: 5px; margin-bottom: 15px; color: #2c3e50; }
        .table { width: 100%; border-collapse: collapse; }
        .table th, .table td { padding: 10px; text-align: left; border-bottom: 1px solid #eee; }
        .table th { width: 35%; color: #666; font-weight: normal; }
        .table td { font-weight: bold; }
        .footer { position: fixed; bottom: 0; width: 100%; text-align: center; font-size: 12px; color: #999; border-top: 1px solid #eee; padding-top: 10px; }
        .text-right { text-align: right; }
    </style>
</head>
<body>
    @php
        $property = $contract->property;
        $bloc = $property->bloc;
        $tranche = $bloc ? $bloc->tranche : null;
        $project = $tranche ? $tranche->project : null;
        $company = $project ? $project->company : null;
    @endphp

    <div class="header">
        <h1>{{ $company ? $company->name : 'ImmoFlow' }}</h1>
        <p>Projet: {{ $project ? $project->name : 'N/A' }}</p>
    </div>

    <div class="section">
        <div class="section-title">Contrat Officiel #{{ $contract->id }}</div>
        <table class="table">
            <tr>
                <th>Date du contrat:</th>
                <td>{{ $contract->date ? \Carbon\Carbon::parse($contract->date)->format('d/m/Y') : 'Non définie' }}</td>
            </tr>
            <tr>
                <th>Statut:</th>
                <td>{{ strtoupper($contract->status) }}</td>
            </tr>
        </table>
    </div>

    <div class="section">
        <div class="section-title">Informations du Client</div>
        <table class="table">
            <tr>
                <th>Nom complet:</th>
                <td>{{ $contract->client->full_name }}</td>
            </tr>
            <tr>
                <th>N° d'identification (CNI):</th>
                <td>{{ $contract->client->identity_number ?? 'N/A' }}</td>
            </tr>
            <tr>
                <th>Email:</th>
                <td>{{ $contract->client->email ?? 'N/A' }}</td>
            </tr>
            <tr>
                <th>Téléphone:</th>
                <td>{{ $contract->client->phone ?? 'N/A' }}</td>
            </tr>
        </table>
    </div>

    <div class="section">
        <div class="section-title">Objet du Contrat (Détails du bien)</div>
        <table class="table">
            <tr>
                <th>Tranche:</th>
                <td>{{ $tranche ? $tranche->name : 'N/A' }}</td>
            </tr>
            <tr>
                <th>Bloc / Immeuble:</th>
                <td>{{ $bloc ? $bloc->name : 'N/A' }}</td>
            </tr>
            <tr>
                <th>Propriété:</th>
                <td>{{ $property->name }} (Surface: {{ $property->area ?? 'N/A' }} m²)</td>
            </tr>
        </table>
    </div>

    <div class="section">
        <div class="section-title">Conditions Financières</div>
        <table class="table">
            <tr>
                <th>Prix convenu:</th>
                <td>{{ number_format($contract->price, 2, ',', ' ') }} €</td>
            </tr>
            <tr>
                <th>Prix original du bien:</th>
                <td>{{ number_format($property->price, 2, ',', ' ') }} €</td>
            </tr>
        </table>
    </div>

    <div class="footer">
        Généré le {{ now()->format('d/m/Y à H:i') }} - Contrat #{{ $contract->id }}
    </div>
</body>
</html>
