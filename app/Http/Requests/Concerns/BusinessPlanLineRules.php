<?php

namespace App\Http\Requests\Concerns;

trait BusinessPlanLineRules
{
    /**
     * @return array<string, array<int, string>>
     */
    protected function lineItemRules(string $typeField, string $typeLabel): array
    {
        return [
            $typeField => ['required', 'string', 'max:255'],
            'land_size' => ['nullable', 'numeric', 'min:0'],
            'unit_price' => ['nullable', 'numeric', 'min:0'],
            'amount' => ['required', 'numeric', 'min:0'],
            'description' => ['nullable', 'string'],
        ];
    }
}
