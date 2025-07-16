<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\User;
use App\Services\PermissionService;
use App\Services\RolesService;
use Illuminate\Database\Seeder;

/**
 * Class RolePermissionSeeder.
 *
 * @see https://spatie.be/docs/laravel-permission/v5/basic-usage/multiple-guards
 */
class RolePermissionSeeder extends Seeder
{
    public function __construct(
        private readonly PermissionService $permissionService,
        private readonly RolesService $rolesService
    ) {
    }

    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Create all permissions
        $this->command->info('Creating permissions...');
        $this->permissionService->createPermissions();

        // Create predefined roles with their permissions
        $this->command->info('Creating predefined roles...');
        $roles = $this->rolesService->createPredefinedRoles();

        // Assign Superadmin role to user named "Super Admin"
        $superAdminUser = User::where('name', 'Super Admin')->first();
        if ($superAdminUser) {
            $this->command->info('Assigning Superadmin role to "Super Admin" user...');
            $superAdminUser->assignRole($roles['superadmin']);
        }

        // Assign Admin role to user named "Admin"
        $adminUser = User::where('name', 'Admin')->first();
        if ($adminUser) {
            $this->command->info('Assigning Admin role to "Admin" user...');
            $adminUser->assignRole($roles['admin']);
        }

        // Assign User role to user named "User"
        $basicUser = User::where('name', 'User')->first();
        if ($basicUser) {
            $this->command->info('Assigning User role to "User" user...');
            $basicUser->assignRole($roles['user']);
        }

        // Optional: assign default 'User' role to everyone else who has no role
        $this->command->info('Assigning User role to all other users without any role...');
        User::doesntHave('roles')->each(function ($user) use ($roles) {
            $user->assignRole($roles['user']);
        });

        $this->command->info('Roles and Permissions created successfully!');
    }
}
