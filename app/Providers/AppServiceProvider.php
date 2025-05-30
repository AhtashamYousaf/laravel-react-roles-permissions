<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Schema;
use App\Models\Setting;
use App\Models\User;

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
        if (Schema::hasTable('settings')) {
            $settings = Setting::pluck('option_value', 'option_name')->toArray();
            foreach ($settings as $key => $value) {
                config(['settings.' . $key => $value]);
            }
        }
    }
}
