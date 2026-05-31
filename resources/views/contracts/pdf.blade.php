<!DOCTYPE html>
<html lang="{{ $lang ?? 'fr' }}">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>Contrat de réservation d'un Local commercial</title>
    <style>
        body { 
            font-family: 'DejaVu Sans', sans-serif; 
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
        
        .rtl-block {
            direction: rtl;
            text-align: right;
        }
        .rtl-block ul {
            direction: rtl;
            text-align: right;
            list-style-type: none;
            padding: 0;
            margin: 10px 0 0 0;
        }
        .rtl-block li {
            direction: rtl;
            text-align: right;
            position: relative;
            padding-right: 15px;
            margin-bottom: 5px;
        }
        .rtl-block li::before {
            content: "•";
            position: absolute;
            right: 0;
            top: 0;
            color: #000;
        }
        .rtl-block ul ul {
            padding-right: 15px;
            margin-top: 5px;
        }
    </style>
</head>
<body>
    @php
        $lang = $lang ?? 'fr';
        
        $ar = function ($text) use ($lang) {
            if ($lang === 'ar' && !empty($text)) {
                $parts = preg_split('/(<[^>]+>)/', $text, -1, PREG_SPLIT_DELIM_CAPTURE);
                $shapedParts = [];
                foreach ($parts as $part) {
                    if (str_starts_with($part, '<') && str_ends_with($part, '>')) {
                        $shapedParts[] = $part;
                    } else {
                        $shapedParts[] = \App\Services\ArabicShaper::shape($part);
                    }
                }
                return implode('', $shapedParts);
            }
            return $text;
        };

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
        @if(isset($lang) && $lang === 'en')
            Commercial Property Reservation Contract
        @elseif(isset($lang) && $lang === 'ar')
            {!! $ar('عقد حجز محل تجاري') !!}
        @else
            Contrat de réservation d'un Local commercial
        @endif
    </div>

    <div class="partie {{ (isset($lang) && $lang === 'ar') ? 'rtl-block' : '' }}">
        @if(isset($lang) && $lang === 'en')
            <span class="bold">PART 1</span> : Company {{ $companyName }} whose head office is at {{ $companyAddress }}.
        @elseif(isset($lang) && $lang === 'ar')
            {!! $ar('<span class="bold">الطرف الأول</span> : شركة ' . $companyName . ' الكائن مقرها الاجتماعي بـ ' . $companyAddress . '.') !!}
        @else
            <span class="bold">PARTIE 1</span> : Société {{ $companyName }} dont le siège se trouve à {{ $companyAddress }}.
        @endif
    </div>

    <div class="partie {{ (isset($lang) && $lang === 'ar') ? 'rtl-block' : '' }}">
        @if(isset($lang) && $lang === 'en')
            <span class="bold">PART 2</span> : Mlle/Mme/Mr {{ strtoupper($clientName) }}, adult, holding ID No. {{ $clientCIN }}, residing at {{ $clientAddress }}.
        @elseif(isset($lang) && $lang === 'ar')
            {!! $ar('<span class="bold">الطرف الثاني</span> : السيد/ة ' . strtoupper($clientName) . '، البالغ سن الرشد، الحامل لبطاقة التعريف الوطنية رقم ' . $clientCIN . '، والقاطن بـ ' . $clientAddress . '.') !!}
        @else
            <span class="bold">PARTIE 2</span> : Mlle/Mme/Mr {{ strtoupper($clientName) }}, Marocain, adulte, portant la CIN N° {{ $clientCIN }}, demeurant à {{ $clientAddress }}.
        @endif
    </div>

    <div class="text-center subtitle bold underline">
        @if(isset($lang) && $lang === 'en')
            CONTRACT AGREEMENT TEXT
        @elseif(isset($lang) && $lang === 'ar')
            {!! $ar('بنود العقد') !!}
        @else
            TEXTE DU CONTRAT
        @endif
    </div>

    @if(isset($clauses))
        @foreach($clauses as $clause)
            <div class="article {{ (isset($lang) && $lang === 'ar') ? 'rtl-block' : '' }}">
                @if(isset($lang) && $lang === 'ar')
                    <span class="bold underline">{!! $ar($clause['title']) !!}</span> : {!! $ar($clause['description']) !!}
                @else
                    <span class="bold underline">{{ $clause['title'] }}</span> : {!! $clause['description'] !!}
                @endif
            </div>
        @endforeach
    @endif

    <div style="margin-top: 50px;" class="bold {{ (isset($lang) && $lang === 'ar') ? 'rtl-block' : '' }}">
        @if(isset($lang) && $lang === 'en')
            Nador, dated {{ $contract->date ? \Carbon\Carbon::parse($contract->date)->format('d/m/Y') : now()->format('d/m/Y') }}
        @elseif(isset($lang) && $lang === 'ar')
            {!! $ar('الناظور، في ' . ($contract->date ? \Carbon\Carbon::parse($contract->date)->format('d/m/Y') : now()->format('d/m/Y'))) !!}
        @else
            Nador, le {{ $contract->date ? \Carbon\Carbon::parse($contract->date)->format('d/m/Y') : now()->format('d/m/Y') }}
        @endif
    </div>

    <table class="signatures" style="{{ (isset($lang) && $lang === 'ar') ? 'direction: rtl;' : '' }}">
        <tr>
            <td class="bold">
                @if(isset($lang) && $lang === 'en')
                    PART 1
                @elseif(isset($lang) && $lang === 'ar')
                    {!! $ar('الطرف الأول') !!}
                @else
                    PARTIE 1
                @endif
            </td>
            <td class="bold text-right" style="{{ (isset($lang) && $lang === 'ar') ? 'text-align: left;' : '' }}">
                @if(isset($lang) && $lang === 'en')
                    PART 2
                @elseif(isset($lang) && $lang === 'ar')
                    {!! $ar('الطرف الثاني') !!}
                @else
                    PARTIE 2
                @endif
            </td>
        </tr>
    </table>

    <div class="footer">
        {{ $companyName }} - {{ $companyAddress }} - RC {{ $company && $company->rc ? $company->rc : 'RRRRRRR' }}/ IF {{ $company && $company->if ? $company->if : 'YYYYYYYY' }}/ Patente {{ $company && $company->patent ? $company->patent : 'XXXXXXXX' }}<br>
        Tél : {{ $company && $company->phone ? $company->phone : '05 36 88 77 33 / 06 44 444 444' }} - Fax : {{ $company && $company->fax ? $company->fax : '' }}
    </div>
</body>
</html>
