<?php

declare(strict_types=1);

namespace App\Services;
use App\Models\User;

class UserService
{
    public array $excluded_settings = [];

    public function __construct()
    {
    }

    public function addUser(string $optionName, mixed $optionValue, bool $autoload = false): ?User
    {
        if (in_array($optionName, $this->excluded_settings)) {
            return null;
        }

        return User::updateOrCreate(
            ['option_name' => $optionName],
            ['option_value' => $optionValue ?? '', 'autoload' => $autoload]
        );
    }

    public function updateUser(string $optionName, mixed $optionValue, ?bool $autoload = null): bool
    {
        if (in_array($optionName, $this->excluded_settings)) {
            return false;
        }

        $user = User::where('option_name', $optionName)->first();

        if ($user) {
            $user->update([
                'option_value' => $optionValue,
                'autoload' => $autoload ?? $user->autoload,
            ]);
            return true;
        }

        return false;
    }

    public function deleteUser(string $optionName): bool
    {
        return User::where('option_name', $optionName)->delete() > 0;
    }

    public function getUser(string $optionName): mixed
    {
        return User::where('option_name', $optionName)->value('option_value');
    }

    public function getUsers(int|bool|null $autoload = true): array
    {
        if ($autoload === -1) {
            return User::all()->toArray();
        }

        return User::where('autoload', (bool) $autoload)->get()->toArray();
    }
}
