<?php

function handle_ld_setting(string $method, ...$parameters): mixed
{
    return app(App\Services\SettingService::class)->{$method}(...$parameters);
}

function add_setting(string $optionName, mixed $optionValue, bool $autoload = false): void
{
    handle_ld_setting('addSetting', $optionName, $optionValue, $autoload);
}

function update_setting(string $optionName, mixed $optionValue, ?bool $autoload = null): bool
{
    return handle_ld_setting('updateSetting', $optionName, $optionValue, $autoload);
}

function delete_setting(string $optionName): bool
{
    return handle_ld_setting('deleteSetting', $optionName);
}

function get_setting(string $optionName): mixed
{
    return handle_ld_setting('getSetting', $optionName);
}

function get_settings(int|bool|null $autoload = true): array
{
    return handle_ld_setting('getSettings', $autoload);
}

if (!function_exists('storeImageAndGetUrl')) {
    function storeImageAndGetUrl($request, $fileName, $path)
    {
        if ($request->hasFile($fileName)) {
            $uploadedFile = $request->file($fileName);
            $fileName = $fileName . '.' . $uploadedFile->getClientOriginalExtension();
            $targetPath = public_path($path);
            if (!file_exists($targetPath)) {
                mkdir($targetPath, 0777, true);
            }
            $uploadedFile->move($targetPath, $fileName);
            return ('/' . $path . '/' . $fileName);
        }
        return null;
    }
}

if (!function_exists('deleteImageFromPublic')) {
    function deleteImageFromPublic(string $imageUrl)
    {
        $urlParts = parse_url($imageUrl);
        $filePath = ltrim($urlParts['path'], '/');
        if (File::exists(public_path($filePath))) {
            if (File::delete(public_path($filePath))) {
                Log::info("File deleted successfully: " . $filePath);
            } else {
                Log::error("Failed to delete file: " . $filePath);
            }
        } else {
            Log::warning("File does not exist: " . $filePath);
        }
    }
}




