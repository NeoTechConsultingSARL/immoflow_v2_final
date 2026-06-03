<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateShareholderRequest extends FormRequest
{
    public function authorize(): bool
    {
        $shareholder = $this->route('shareholder');

        return $shareholder && $this->user()?->can('update', $shareholder);
    }

    /**
     * @return array<string, array<int, string>>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:100'],
            'amount' => ['required', 'numeric', 'min:0.01'],
        ];
    }
}
