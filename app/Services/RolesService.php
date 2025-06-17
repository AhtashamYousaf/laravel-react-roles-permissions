<?php

declare(strict_types=1);

namespace App\Services;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolesService
{
    public function __construct(private readonly PermissionService $permissionService)
    {
    }

    public function getAllRoles()
    {
        return Role::all();
    }

    public function getRolesDropdown(): array
    {
        return Role::pluck('name', 'id')->toArray();
    }

    public function getPaginatedRoles(string $search = null, int $perPage = 10): LengthAwarePaginator
    {
        $query = Role::query()->with('permissions');

        if ($search) {
            $query->where('name', 'like', '%' . $search . '%');
        }

        return $query->paginate($perPage);
    }

    
    public function roleHasPermissions(Role $role, $permissions): bool
    {
        foreach ($permissions as $permission) {
            if (!$role->hasPermissionTo($permission->name)) {
                return false;
            }
        }

        return true;
    }

    public function createRole(string $name, array $permissions = []): Role
    {
        $role = Role::create(['name' => $name, 'guard_name' => 'web']);

        if (!empty($permissions)) {
            $role->syncPermissions($permissions);
        }

        return $role;
    }

    public function findRoleById(int $id): ?Role
    {
        return Role::findById($id);
    }

    public function getRolesByIds(array $roleIds, string $guard): Collection
    {
        return Role::whereIn('id', $roleIds)->where('guard_name', $guard)->get();
    }

    public function updateRole(Role $role, string $name, array $permissions = []): Role
    {
        $role->name = $name;
        $role->save();

        if (!empty($permissions)) {
            $role->syncPermissions($permissions);
        }

        return $role;
    }

    public function deleteRole(Role $role): bool
    {
        return $role->delete();
    }

    /**
     * Count users in a specific role
     * 
     * @param Role|string $role
     * @return int
     */
    public function countUsersInRole($role): int
    {
        if (is_string($role)) {
            $role = Role::where('name', $role)->first();
            if (!$role) {
                return 0;
            }
        }

        return $role->users->count();
    }

    /**
     * Get roles with user counts
     * 
     * @param string|null $search
     * @param int $perPage
     * @return LengthAwarePaginator
     */
    public function getPaginatedRolesWithUserCount(string $search = null, int $perPage = 10): LengthAwarePaginator
    {
        $query = Role::query()->with('permissions');

        if ($search) {
            $query->where('name', 'like', '%' . $search . '%');
        }

        // Exclude Admin and Superadmin unless the current user is Superadmin
        if (!auth()->user()->hasRole('Superadmin')) {
            $query->whereNotIn('name', ['Admin', 'Superadmin']);
        }

        $roles = $query->paginate($perPage);

        // Add user count to each role
        foreach ($roles as $role) {
            $role->user_count = $this->countUsersInRole($role);
        }

        return $roles;
    }

    /**
     * Create predefined roles with their permissions
     * 
     * @return array
     */
    public function createPredefinedRoles(): array
    {
        $roles = [];

        // 1. Superadmin role - has all permissions
        $allPermissionNames = [];
        foreach ($this->permissionService->getAllPermissions() as $permission) {
           $allPermissionNames[] = $permission;  
        }

        $roles['superadmin'] = $this->createRole('Superadmin', $allPermissionNames);

        // 2. Admin role - has almost all permissions except some critical ones
        $adminPermissions = $allPermissionNames;
        $adminExcludedPermissions = [
            'user.delete', // Cannot delete users
        ];

        $adminPermissions = array_diff($adminPermissions, $adminExcludedPermissions);
        $roles['admin'] = $this->createRole('Admin', $adminPermissions);

        // 3. User role - basic user role
        $userPermissions = [
            'dashboard.view',
            'profile.view',
            'profile.edit',
            'profile.update',
        ];

        $roles['user'] = $this->createRole('User', $userPermissions);

        return $roles;
    }

    /**
     * Get a specific predefined role's permissions
     * 
     * @param string $roleName
     * @return array
     */
    public function getPredefinedRolePermissions(string $roleName): array
    {
        $roleName = strtolower($roleName);

        switch ($roleName) {
            case 'superadmin':
                // All permissions
                $allPermissionNames = [];
                foreach ($this->permissionService->getAllPermissions() as $permission) {
                    $allPermissionNames[] = $permission;
                }
                return $allPermissionNames;

            case 'admin':
                // All except some critical permissions
                $adminExcludedPermissions = [
                    'user.delete',
                ];
                $allPermissionNames = [];
                foreach ($this->permissionService->getAllPermissions() as $permission) {
                    $allPermissionNames[] = $permission;
                }
                return array_diff($allPermissionNames, $adminExcludedPermissions);

            case 'user':
            default:
                return [
                    'dashboard.view',
                    'profile.view',
                    'profile.edit',
                    'profile.update',
                ];
        }
    }
}
