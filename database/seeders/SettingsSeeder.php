<?php

declare(strict_types=1);

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SettingsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('settings')->insert([
            // Site title.
            ['option_name' => 'app_name', 'option_value' => 'Laravel Dashboard'],

            // Site logo and icons.
            ['option_name' => 'site_logo_lite', 'option_value' => '/logo.svg'],
            ['option_name' => 'site_logo_dark', 'option_value' => '/logo.svg'],
            ['option_name' => 'site_icon', 'option_value' => '/favicon.ico'],
            ['option_name' => 'site_favicon', 'option_value' => '/favicon.svg'],
        ]);
    }
}
