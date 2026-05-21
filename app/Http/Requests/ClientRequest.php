<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class ClientRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // We'll manage authorization via middleware/roles
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $clientId = $this->client ? $this->client->id : null;

        return [
            'full_name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:clients,email,'.$clientId,
            'phone' => 'nullable|string|max:20',
            'identity_number' => 'required|string|max:50|unique:clients,identity_number,'.$clientId,
            'address' => 'nullable|string',
            'type' => 'required|in:Lead,Prospect,Owner',
        ];
    }
}
