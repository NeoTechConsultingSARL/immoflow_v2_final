<?php

namespace App\Observers;

use App\Models\BusinessPlanProduct;
use Illuminate\Support\Facades\Auth;

class BusinessPlanProductObserver
{
    public function creating(BusinessPlanProduct $product): void
    {
        if (Auth::id()) {
            $product->created_by = Auth::id();
            $product->updated_by = Auth::id();
        }
    }

    public function updating(BusinessPlanProduct $product): void
    {
        if (Auth::id()) {
            $product->updated_by = Auth::id();
        }
    }
}
