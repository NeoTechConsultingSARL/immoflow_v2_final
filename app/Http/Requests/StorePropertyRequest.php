<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StorePropertyRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'bloc_id' => ['required', 'exists:blocs,id'],
            'property_type_id' => ['required', 'exists:property_types,id'],
            'price' => ['required', 'numeric', 'min:0'],
            'status' => ['required', 'in:available,reserved,sold'],
        ];
    }
}
