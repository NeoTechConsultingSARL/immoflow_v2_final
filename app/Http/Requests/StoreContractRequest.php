<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreContractRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        if ($this->has('schedule') && is_array($this->schedule)) {
            $filteredSchedule = array_filter($this->schedule, function ($item) {
                return isset($item['amount']) && trim($item['amount']) !== '';
            });

            $this->merge([
                'schedule' => array_values($filteredSchedule),
            ]);
        }
    }

    public function rules(): array
    {
        return [
            'client_id' => 'nullable|exists:clients,id',
            // if client is new, we might expect client details
            'first_name' => 'required_without:client_id|string|max:255',
            'last_name' => 'required_without:client_id|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'required_without:client_id|string|max:255',
            'id_number' => 'nullable|string|max:255',

            'property_id' => 'required|exists:properties,id',
            'contract_number' => 'required|string|unique:contracts,contract_number',
            'price' => 'required|numeric|min:0',
            'advance' => 'nullable|numeric|min:0',
            'paymentDuration' => 'nullable|integer|min:1',
            'paymentFrequency' => 'nullable|integer|min:1',
            'date' => 'nullable|date',

            'modification.notes' => 'nullable|string',
            'modification.image' => 'nullable|image|max:2048',

            'withDetails' => 'required|boolean',
            'schedule' => 'required_if:withDetails,1|array',
            'schedule.*.due_date' => 'required_with:schedule|date',
            'schedule.*.amount' => 'required_with:schedule|numeric|min:0',
            'schedule.*.observation' => 'nullable|string',

            'commission' => 'nullable|array',
            'commission.broker_name' => 'required_with:commission|string|max:255',
            'commission.amount' => 'required_with:commission|numeric|min:0',
            'commission.description' => 'nullable|string',
            'commission.status' => 'nullable|string',
        ];
    }
}
