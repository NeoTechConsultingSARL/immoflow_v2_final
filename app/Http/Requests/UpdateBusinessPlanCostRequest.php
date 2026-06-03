<?php

namespace App\Http\Requests;

use App\Http\Requests\Concerns\BusinessPlanLineRules;
use App\Models\BusinessPlanCost;
use Illuminate\Foundation\Http\FormRequest;

class UpdateBusinessPlanCostRequest extends FormRequest
{
    use BusinessPlanLineRules;

    public function authorize(): bool
    {
        return $this->user()?->can('update', BusinessPlanCost::class) ?? false;
    }

    /**
     * @return array<string, array<int, string>>
     */
    public function rules(): array
    {
        return $this->lineItemRules('cost_type', 'cost type');
    }
}
