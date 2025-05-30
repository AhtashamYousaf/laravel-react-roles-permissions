<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;
use App\Models\Setting;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        [$message, $author] = str(Inspiring::quotes()->random())->explode('-');
        // Fetch all settings at once to avoid N+1 queries
       $settings = Setting::whereIn('option_name', [
            'app_name',
            'site_logo_lite',
            'site_logo_dark',
            'site_icon',
            'site_favicon',
        ])->pluck('option_value', 'option_name')->toArray();
        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'quote' => ['message' => trim($message), 'author' => trim($author)],
            'auth' => [
                'user' => $request->user(),
                'role' => $request->user()?->getRoleNames()->toArray(),
                'permissions' => $request->user()?->getAllPermissions()?->pluck('name')->toArray() ?? [],
            ],
            'settings' => [
                'app_name' => $settings['app_name'] ?? config('settings.app_name'),
                'site_logo_lite' => $settings['site_logo_lite'] ?? config('settings.site_logo_lite'),
                'site_logo_dark' => $settings['site_logo_dark'] ?? config('settings.site_logo_dark'),
                'site_icon' => $settings['site_icon'] ?? config('settings.site_icon'),
                'site_favicon' => $settings['site_favicon'] ?? config('settings.site_favicon'),
            ],
            'ziggy' => fn (): array => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
        ];
    }
}
