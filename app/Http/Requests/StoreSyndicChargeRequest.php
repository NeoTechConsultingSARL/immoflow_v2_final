<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreSyndicChargeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'syndic_charge_type_id' => ['required', 'exists:syndic_charge_types,id'],
            'date_operation' => ['required', 'date'],
            'montant' => ['required', 'numeric', 'min:0'],
            'designation' => ['nullable', 'string', 'max:255'],
            'societe' => ['nullable', 'string', 'max:255'],
            'bloc_id' => ['required', 'exists:blocs,id'],
        ];
    }
}
