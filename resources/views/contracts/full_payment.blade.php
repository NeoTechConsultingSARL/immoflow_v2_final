<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Attestation de paiement intégral</title>
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
            font-size: 20px; 
            margin-bottom: 50px; 
            margin-top: 40px;
            letter-spacing: 1px;
        }
        
        .content {
            margin-top: 40px;
            margin-bottom: 40px;
            font-size: 14px;
            text-align: justify;
        }

        .signatures {
            width: 100%;
            margin-top: 80px;
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
        $price = $contract->price ? number_format($contract->price, 2, ',', ' ') : '0,00';
    @endphp

    <div style="margin-top: 40px;">
        <span class="bold">{{ strtoupper($companyName) }}</span><br>
        {{ $companyAddress }}
    </div>

    <div class="text-center title bold underline" style="margin-top: 60px;">
        ATTESTATION DE PAIEMENT INTÉGRAL
    </div>

    <div class="content">
        <p>Nous soussignés, la société <span class="bold">{{ $companyName }}</span>, certifions par la présente attester que :</p>
        
        <p style="margin-top: 25px; margin-left: 20px;">
            Mlle/Mme/Mr <span class="bold">{{ strtoupper($clientName) }}</span>, 
            portant la CIN N° <span class="bold">{{ $clientCIN }}</span>, 
            titulaire du contrat de réservation N° <span class="bold">{{ $contract->contract_number ?: 'CT-'.$contract->id }}</span>,
        </p>

        <p style="margin-top: 25px;">
            A réglé la totalité du prix convenu pour l'acquisition de son unité immobilière identifiée comme suit :
        </p>

        <p style="margin-top: 15px; margin-left: 20px; font-style: italic;">
            Propriété : {{ $property ? $property->name : 'N/A' }}<br>
            Projet : {{ $project ? $project->name : 'N/A' }} — {{ $bloc ? $bloc->name : 'N/A' }}<br>
            Montant total acquitté : <span class="bold">{{ $price }} €</span>
        </p>

        <p style="margin-top: 25px;">
            Par conséquent, la société <span class="bold">{{ $companyName }}</span> lui donne quitus entier, définitif et sans réserve pour le paiement intégral de ladite acquisition.
        </p>

        <p style="margin-top: 25px;">
            Cette attestation est délivrée à l'intéressé(e) pour servir et valoir ce que de droit.
        </p>
    </div>

    <div style="margin-top: 60px;" class="bold">
        Fait à Nador, le {{ now()->format('d/m/Y') }}
    </div>

    <table class="signatures">
        <tr>
            <td class="bold">La Direction</td>
            <td class="bold text-right">L'Acquéreur</td>
        </tr>
    </table>

    <div class="footer">
        {{ $companyName }} - {{ $companyAddress }} - RC {{ $company && $company->rc ? $company->rc : 'RRRRRRR' }}/ IF {{ $company && $company->if ? $company->if : 'YYYYYYYY' }}/ Patente {{ $company && $company->patent ? $company->patent : 'XXXXXXXX' }}<br>
        Tél : {{ $company && $company->phone ? $company->phone : '05 36 88 77 33 / 06 44 444 444' }} - Fax : {{ $company && $company->fax ? $company->fax : '' }}
    </div>
</body>
</html>
