<?php

namespace App\Http\Requests;

use App\Models\SyndicChargeType;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateSyndicChargeTypeRequest extends FormRequest
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
        /** @var SyndicChargeType $syndicChargeType */
        $syndicChargeType = $this->route('syndicChargeType');

        return [
            'nom' => ['required', 'string', 'max:255', Rule::unique('syndic_charge_types', 'nom')->ignore($syndicChargeType->id)],
        ];
    }
}
