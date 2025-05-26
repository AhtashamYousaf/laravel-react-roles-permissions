<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Setting;
use Inertia\Inertia;
use App\Services\SettingService;
use Illuminate\Contracts\Support\Renderable;

class GeneralSettingController extends Controller
{
    public function __construct(
        private readonly SettingService $settingService,
    ) {
    }

    public function index()
    {
        return Inertia::render('settings/general', [
            'settings' => $this->settingService->getSettings(),
        ]);
    }

    // public function store( Request $request)
    // {
    //     // Restrict specific fields in demo mode.
    //     if (env('DEMO_MODE', false)) {
    //         $restrictedFields = ld_apply_filters('settings_restricted_fields', ['app_name', 'google_analytics_script']);
    //         $fields = $request->except($restrictedFields);
    //     } else {
    //         $fields = $request->all();
    //     }

    //     $this->checkAuthorization(auth()->user(), ['settings.edit']);

    //     $uploadPath = 'uploads/settings';

    //     foreach ($fields as $fieldName => $fieldValue) {
    //         if ($request->hasFile($fieldName)) {
    //             deleteImageFromPublic((string) config($fieldName));
    //             $fileUrl = storeImageAndGetUrl($request, $fieldName, $uploadPath);
    //             $this->settingService->addSetting($fieldName, $fileUrl);
    //         } else {
    //             $this->settingService->addSetting($fieldName, $fieldValue);
    //         }
    //     }

    //     $this->envWriter->batchWriteKeysToEnvFile($fields);

    //     $this->storeActionLog(ActionType::UPDATED, [
    //         'settings' => $fields,
    //     ]);

    //     return redirect()->back()->with('success', 'Settings saved successfully.');
    // }
}
