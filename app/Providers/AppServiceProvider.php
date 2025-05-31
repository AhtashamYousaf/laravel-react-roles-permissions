<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Schema;
use App\Models\Setting;
use App\Models\User;
use Illuminate\Support\Facades\Log;

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
        
        // Check if settings table schema is present.
        try {
            if (Schema::hasTable('settings')) {
                $settings = Setting::pluck('option_value', 'option_name')->toArray();
                foreach ($settings as $key => $value) {
                    config(['settings.' . $key => $value]);
                }
            }
        } catch (\Exception $e) {
            Log::warning('Skipping settings config load: ' . $e->getMessage());
        }
    }
}
