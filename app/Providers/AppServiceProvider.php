<?php

namespace App\Providers;


use App\Models\ProjectDocument;
use App\Observers\ProjectDocumentObserver;
use App\Models\BusinessPlanCost;
use App\Models\BusinessPlanProduct;
use App\Models\Shareholder;
use App\Observers\BusinessPlanCostObserver;
use App\Observers\BusinessPlanProductObserver;
use App\Observers\ShareholderObserver;
use App\Policies\BusinessPlanPolicy;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Shareholder::observe(ShareholderObserver::class);

        ProjectDocument::observe(ProjectDocumentObserver::class);

        BusinessPlanCost::observe(BusinessPlanCostObserver::class);
        BusinessPlanProduct::observe(BusinessPlanProductObserver::class);

        Gate::policy(BusinessPlanCost::class, BusinessPlanPolicy::class);
        Gate::policy(BusinessPlanProduct::class, BusinessPlanPolicy::class);


        Vite::prefetch(concurrency: 3);

        RateLimiter::for('global', function (Request $request) {
            return $request->user()
                ? Limit::perMinute(180)->by($request->user()->id)
                : Limit::perMinute(60)->by($request->ip());
        });

        RateLimiter::for('api', function (Request $request) {
            return $request->user()
                ? Limit::perMinute(60)->by($request->user()->id)
                : Limit::perMinute(30)->by($request->ip());
        });

        RateLimiter::for('auth', function (Request $request) {
            return Limit::perMinute(5)->by($request->ip());
        });
    }
}
