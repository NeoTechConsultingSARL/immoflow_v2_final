<?php

namespace App\Http\Requests;

use App\Models\Shareholder;
use Illuminate\Foundation\Http\FormRequest;

class StoreShareholderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('create', Shareholder::class) ?? false;
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
