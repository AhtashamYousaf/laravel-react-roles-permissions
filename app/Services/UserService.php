<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\User;
use Illuminate\Pagination\LengthAwarePaginator;
use Spatie\Permission\Models\Role;

class UserService
{
    public function getUsers(): LengthAwarePaginator
    {
        $query = User::query();
        $search = request()->input('search');

        if ($search) {
            $query->where('name', 'like', "%{$search}%")
                ->orWhere('email', 'like', "%{$search}%");
        }

        $role = request()->input('role');
        if ($role) {
            $query->whereHas('roles', function ($q) use ($role) {
                $q->where('name', $role);
            });
        }

        return $query->latest()->paginate(config('settings.default_pagination') ?? 10);
    }

    public function getUserById(int $id): ?User
    {
        return User::findOrFail($id);
    }

    public function getPaginatedUsers(string $search = null, string $roleId = null, int $perPage = 10): LengthAwarePaginator
    {
        $query = User::query()->with(['roles','permissions']);

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', '%' . $search . '%')
                ->orWhere('email', 'like', '%' . $search . '%');
            });
        }
        $query->when(auth()->user()->hasRole('Admin'), function ($query) {
            $query->whereDoesntHave('roles', function ($q) {
                $q->where('name', 'Superadmin');
            });
        });

        $query->when($roleId && $roleId !== 'all', function ($query) use ($roleId) {
            $query->whereHas('roles', function ($q) use ($roleId) {
                $q->where('id', $roleId);
            });
        });

        return $query->paginate($perPage)->withQueryString();
    }
}
