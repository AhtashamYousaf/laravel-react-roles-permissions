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
        return Inertia::render('settings/general');
    }

    public function update( Request $request)
    {
        $fields = $request->all();
        // $this->checkAuthorization(auth()->user(), ['settings.edit']);

        $uploadPath = 'uploads/settings';
        foreach ($fields as $fieldName => $fieldValue) {
            if ($request->hasFile($fieldName)) {
                deleteImageFromPublic((string) config($fieldName));
                $fileUrl = storeImageAndGetUrl($request, $fieldName, $uploadPath);
                $this->settingService->addSetting($fieldName, $fileUrl);
            } else {
                $this->settingService->addSetting($fieldName, $fieldValue);
            }
        }

        // $this->storeActionLog(ActionType::UPDATED, [
        //     'settings' => $fields,
        // ]);
        return to_route('settings.general')->with('success', 'Settings updated successfully!');
    }
}
