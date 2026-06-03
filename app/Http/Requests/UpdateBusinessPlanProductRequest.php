<?php

namespace App\Http\Requests;

use App\Http\Requests\Concerns\BusinessPlanLineRules;
use App\Models\BusinessPlanProduct;
use Illuminate\Foundation\Http\FormRequest;

class UpdateBusinessPlanProductRequest extends FormRequest
{
    use BusinessPlanLineRules;

    public function authorize(): bool
    {
        return $this->user()?->can('update', BusinessPlanProduct::class) ?? false;
    }

    /**
     * @return array<string, array<int, string>>
     */
    public function rules(): array
    {
        return $this->lineItemRules('product_type', 'product type');
    }
}
