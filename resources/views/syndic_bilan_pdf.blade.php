<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Bilan Syndique</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 12px;
            color: #333;
        }
        .header {
            text-align: center;
            margin-bottom: 20px;
        }
        .header h3 {
            margin: 0;
            padding: 0;
            font-size: 16px;
        }
        .header p {
            margin: 5px 0 0 0;
            font-weight: bold;
        }
        .table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        .table th, .table td {
            border: 1px solid #000;
            padding: 5px;
            text-align: left;
        }
        .table th {
            background-color: #a8a8a8;
            font-weight: bold;
        }
        .table-summary {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        .table-summary td {
            border: 1px solid #000;
            padding: 5px;
            font-weight: bold;
        }
        .table-summary td.label {
            background-color: #a8a8a8;
            width: 70%;
        }
        .table-summary td.value {
            text-align: right;
        }
        .section-title {
            text-align: center;
            font-weight: bold;
            text-decoration: underline;
            margin-bottom: 10px;
        }
        .total-row td.label {
            background-color: #a8a8a8;
            font-weight: bold;
        }
        .total-row td.value {
            text-align: right;
            font-weight: bold;
        }
        .right {
            text-align: right !important;
        }
    </style>
</head>
<body>

    <div class="header">
        <h3>Bilan Syndique Projet {{ $bloc->tranche->project->name }} "{{ $bloc->name }}"</h3>
        <p>Imprimé le {{ \Carbon\Carbon::now()->format('d-m-Y | H:i') }}</p>
    </div>

    <table class="table-summary">
        <tr>
            <td class="label">Solde (Paiements Clients - Charges)</td>
            <td class="value">{{ number_format($solde, 2, ',', ' ') }} DH</td>
        </tr>
    </table>

    <div class="section-title">Paiements Clients</div>
    <table class="table">
        <thead>
            <tr>
                <th>Client</th>
                <th>Date Paiement</th>
                <th>Status</th>
                <th>Montant</th>
            </tr>
        </thead>
        <tbody>
            @foreach($syndics as $syndic)
            <tr>
                <td>{{ $syndic->client->full_name ?? '-' }}</td>
                <td>{{ \Carbon\Carbon::parse($syndic->date)->format('Y-m-d') }}</td>
                <td>{{ $syndic->status }}</td>
                <td class="right">{{ number_format($syndic->montant, 2, ',', ' ') }}</td>
            </tr>
            @endforeach
            <tr class="total-row">
                <td colspan="3" class="label">Total Paiements Clients</td>
                <td class="value">{{ number_format($totalPayments, 2, ',', ' ') }}</td>
            </tr>
        </tbody>
    </table>

    <div class="section-title">Charges Syndique</div>
    <table class="table">
        <thead>
            <tr>
                <th>Type</th>
                <th>Date Opération</th>
                <th>Désignation</th>
                <th>Montant</th>
            </tr>
        </thead>
        <tbody>
            @foreach($charges as $charge)
            <tr>
                <td>{{ $charge->syndicChargeType->nom ?? '-' }}</td>
                <td>{{ \Carbon\Carbon::parse($charge->date_operation)->format('Y-m-d') }}</td>
                <td>{{ $charge->designation }}</td>
                <td class="right">{{ number_format($charge->montant, 2, ',', ' ') }}</td>
            </tr>
            @endforeach
            <tr class="total-row">
                <td colspan="3" class="label">Total Charges Syndique</td>
                <td class="value">{{ number_format($totalCharges, 2, ',', ' ') }}</td>
            </tr>
        </tbody>
    </table>

</body>
</html>
