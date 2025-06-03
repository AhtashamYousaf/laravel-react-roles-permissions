<?php

declare(strict_types=1);

namespace App\Services;

use Illuminate\Database\Eloquent\Collection;
use Spatie\Permission\Models\Permission;

class PermissionService
{
    /**
     * Get all permissions
     * 
     * @return array
     */
    public function getAllPermissions(): array
    {
        $permissions = [
            'user.create',
            'user.view',
            'user.update',
            'user.delete',
            'role.create',
            'role.view',
            'role.update',
            'role.delete',
            'setting.create',
            'setting.view',
            'setting.update',
            'setting.delete',
            'dashboard.view',
            'profile.view',
            'profile.edit',
            'profile.update',
        ];

        return $permissions;
    }

    
    /**
     * Get all permission models from database
     *
     * @return Collection
     */
    public function getAllPermissionModels(): Collection
    {
        return Permission::all();
    }
    
      
    /**
     * Create all permissions from the definitions
     * 
     * @return array Created permissions
     */
    public function createPermissions(): array
    {
        $createdPermissions = [];
        $permissions = $this->getAllPermissions();
        
        foreach ($permissions as $permission) {
            $permission = $this->findOrCreatePermission($permission);
            $createdPermissions[] = $permission;
        }
        
        return $createdPermissions;
    }
    
    /**
     * Find or create a permission
     * 
     * @param string $name
     * @return Permission
     */
    public function findOrCreatePermission(string $name): Permission
    {
        return Permission::firstOrCreate(
            ['name' => $name],
            [
                'name' => $name,
                'guard_name' => 'web',
            ]
        );
    }
    
    /**
     * Get all permission objects by their names
     * 
     * @param array $permissionNames
     * @return array
     */
    public function getPermissionsByNames(array $permissionNames): array
    {
        return Permission::whereIn('name', $permissionNames)->get()->all();
    }

    public function getPermissionsByIds(array $roleIds, string $guard): Collection
    {
        return Permission::whereIn('id', $roleIds)->where('guard_name', $guard)->get();
    }
}
