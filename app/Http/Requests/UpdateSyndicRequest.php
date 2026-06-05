<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateSyndicRequest extends FormRequest
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
            'date' => ['required', 'date'],
            'montant' => ['required', 'numeric', 'min:0', 'max:9999999999.99'],
            'client_id' => ['required', 'exists:clients,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'montant.max' => 'Le montant ne peut pas dépasser 9 999 999 999,99 DH.',
        ];
    }
}
