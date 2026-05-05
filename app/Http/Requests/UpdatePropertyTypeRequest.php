<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePropertyTypeRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'required', 'string', 'max:255', 'unique:property_types,name,'.$this->propertyType->id],
            'description' => ['nullable', 'string'],
            'icon' => ['nullable', 'string'],
        ];
    }
}
