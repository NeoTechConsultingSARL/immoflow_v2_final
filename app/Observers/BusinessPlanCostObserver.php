<?php

namespace App\Observers;

use App\Models\BusinessPlanCost;
use Illuminate\Support\Facades\Auth;

class BusinessPlanCostObserver
{
    public function creating(BusinessPlanCost $cost): void
    {
        if (Auth::id()) {
            $cost->created_by = Auth::id();
            $cost->updated_by = Auth::id();
        }
    }

    public function updating(BusinessPlanCost $cost): void
    {
        if (Auth::id()) {
            $cost->updated_by = Auth::id();
        }
    }
}
