<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTrancheRequest extends FormRequest
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
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'project_id' => ['sometimes', 'required', 'exists:projects,id'],
            'status' => ['sometimes', 'required', 'string', 'in:active,inactive'],
        ];
    }
}
