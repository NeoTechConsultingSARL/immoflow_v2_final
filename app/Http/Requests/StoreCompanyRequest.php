<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreCompanyRequest extends FormRequest
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
            'name' => ['required', 'string', 'max:255', 'unique:companies'],
            'status' => ['required', 'in:active,inactive'],
            'description' => ['nullable', 'string'],
            'email' => ['nullable', 'email', 'max:255'],
            'address' => ['nullable', 'string'],
            'phone' => ['nullable', 'string', 'max:45'],
            'website' => ['nullable', 'url', 'max:255'],
            'properties' => ['nullable', 'integer', 'min:0'],
            'rc' => ['nullable', 'string', 'max:255'],
            'if' => ['nullable', 'string', 'max:255'],
            'patent' => ['nullable', 'string', 'max:255'],
            'fax' => ['nullable', 'string', 'max:45'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'The company name is required.',
            'name.string' => 'The company name must be a string.',
            'name.max' => 'The company name may not be greater than 255 characters.',
            'name.unique' => 'A company with this name already exists.',
            'status.required' => 'The status field is required.',
            'status.in' => 'Please select a valid status (active or inactive).',
            'description.string' => 'The description must be a string.',
            'email.email' => 'Please enter a valid email address.',
            'email.max' => 'The email may not be greater than 255 characters.',
            'address.string' => 'The address must be a string.',
            'phone.string' => 'The phone number must be a string.',
            'phone.max' => 'The phone number may not be greater than 45 characters.',
            'website.url' => 'Please enter a valid website URL.',
            'website.max' => 'The website may not be greater than 255 characters.',
            'properties.integer' => 'The properties count must be a number.',
            'properties.min' => 'The properties count cannot be negative.',
            'rc.string' => 'The RC must be a string.',
            'rc.max' => 'The RC may not be greater than 255 characters.',
            'if.string' => 'The IF must be a string.',
            'if.max' => 'The IF may not be greater than 255 characters.',
            'patent.string' => 'The Patent must be a string.',
            'patent.max' => 'The Patent may not be greater than 255 characters.',
            'fax.string' => 'The Fax must be a string.',
            'fax.max' => 'The Fax may not be greater than 45 characters.',
        ];
    }
}
