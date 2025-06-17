<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\User;
use Illuminate\Pagination\LengthAwarePaginator;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Hash;

class UserService
{
    public function __construct(private readonly PermissionService $permissionService,
                                private readonly RolesService $roleService)
    {

    }
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

     public function createUser(string $name, string $email, string $password): User
    {
        $user = User::create(['name' => $name, 'email' => $email, 'password' => $password]);
        
        return $user;
    }

    public function createUserWithRolesAndPermissions(
        string $name,
        string $email,
        string $password,
        array $roleIds = [],
        array $permissionIds = []
    ): User
    {   
        $roles = $this->roleService->getRolesByIds($roleIds, 'web');
        $permissions = $this->permissionService->getPermissionsByIds($permissionIds, 'web');

        foreach ($roles as $role) {
            if (in_array($role->name, ['Admin', 'Superadmin']) && !auth()->user()->hasRole('Superadmin')) {
                throw new \Exception('Only superadmin can assign the Admin or Superadmin role.');
            }
        }

        $user = $this->createUser($name, $email, Hash::make($password));
        $user->syncRoles($roles->pluck('name')->toArray());
        $user->syncPermissions($permissions);

        return $user;
    }

    public function updateUserWithRolesAndPermissions(
        User $user,
        string $name,
        string $email,
        ?string $password,
        array $roleIds = [],
        array $permissionIds = []
        ): User 
    {

        // Business rule: Can't change your own role unless superadmin
        if ($user->id === auth()->id() && !$user->hasRole('Superadmin')) {
            throw new \Exception('You cannot change your own role.');
        }

        $roles = $this->roleService->getRolesByIds($roleIds, 'web');

        foreach ($roles as $role) {
            if (in_array($role->name, ['Admin', 'Superadmin']) && !auth()->user()->hasRole('Superadmin')) {
                throw new \Exception('Only superadmin can assign the Admin or Superadmin role.');
            }
        }

        $user->name = $name;
        $user->email = $email;

        if (!empty($password)) {
            $user->password = Hash::make($password);
        }

        $user->save();

        $user->syncRoles($roles->pluck('name')->toArray());

        $permissions = $this->permissionService->getPermissionsByIds($permissionIds, 'web');
        $user->syncPermissions($permissions);

        return $user;
    }


    public function deleteUser(User $user): bool
    {   
        if ($user->id == auth()->id()) {
            throw new \Exception('You cannot delete your own account.');
        }
        if ($user->hasRole('Superadmin')) {
            throw new \Exception('Cannot delete this user.');
        }

        $user->syncRoles(); 
        $user->syncPermissions();    

        return $user->delete();
    }
}
