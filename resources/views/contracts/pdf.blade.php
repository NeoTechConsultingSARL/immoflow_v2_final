<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Contrat de réservation d'un Local commercial</title>
    <style>
        body { 
            font-family: 'Helvetica', 'Arial', sans-serif; 
            color: #000; 
            line-height: 1.6; 
            font-size: 13px; 
            margin: 20px 40px;
        }
        .text-center { text-align: center; }
        .text-right { text-align: right; }
        .underline { text-decoration: underline; }
        .bold { font-weight: bold; }
        
        .title { 
            font-size: 18px; 
            margin-bottom: 40px; 
            margin-top: 20px;
        }
        .subtitle {
            font-size: 14px;
            margin: 30px 0;
        }
        
        .partie {
            margin-bottom: 20px;
        }

        .article {
            margin-bottom: 15px;
            text-align: justify;
        }
        
        .signatures {
            width: 100%;
            margin-top: 50px;
            page-break-inside: avoid;
        }
        .signatures td {
            width: 50%;
        }
        
        .footer { 
            position: fixed; 
            bottom: -20px; 
            width: 100%; 
            text-align: center; 
            font-size: 10px; 
            border-top: 1px solid #000; 
            padding-top: 5px; 
        }
    </style>
</head>
<body>
    @php
        $property = $contract->property;
        $bloc = $property ? $property->bloc : null;
        $tranche = $bloc ? $bloc->tranche : null;
        $project = $tranche ? $tranche->project : null;
        $company = $project ? $project->company : null;
        
        $companyName = $company ? $company->name : 'Ste Promoteurs Immo';
        $companyAddress = $company ? $company->address : 'Rue Salam Et 1 Oujda';
        
        $client = $contract->client;
        $clientName = $client ? $client->full_name : 'Client Name';
        $clientCIN = $client ? $client->identity_number : 'CIN N°';
        $clientAddress = $client ? $client->address : 'Address';
    @endphp

    <div class="text-center title bold underline">
        Contrat de réservation d'un Local commercial
    </div>

    <div class="partie">
        <span class="bold">PARTIE 1</span> : Société {{ $companyName }} dont le siège se trouve à {{ $companyAddress }}.
    </div>

    <div class="partie">
        <span class="bold">PARTIE 2</span> : Mlle/Mme/Mr {{ strtoupper($clientName) }}, Marocain, adulte, portant la CIN N° {{ $clientCIN }}, demeurant à {{ $clientAddress }}.
    </div>

    <div class="text-center subtitle bold underline">
        TEXTE DU CONTRAT
    </div>

    @if(isset($clauses))
        @foreach($clauses as $clause)
            <div class="article">
                <span class="bold underline">{{ $clause['title'] }}</span> : {!! $clause['description'] !!}
            </div>
        @endforeach
    @endif

    <div style="margin-top: 50px;" class="bold">
        Nador, le {{ $contract->date ? \Carbon\Carbon::parse($contract->date)->format('d/m/Y') : now()->format('d/m/Y') }}
    </div>

    <table class="signatures">
        <tr>
            <td class="bold">PARTIE 1</td>
            <td class="bold text-right">PARTIE 2</td>
        </tr>
    </table>

    <div class="footer">
        {{ $companyName }} - {{ $companyAddress }} - RC RRRRRRR/ IF YYYYYYYY/ Patente XXXXXXXX<br>
        Tél : 05 36 88 77 33 / 06 44 444 444 - Fax :
    </div>
</body>
</html>
