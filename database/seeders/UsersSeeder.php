<?php

declare(strict_types=1);

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class UsersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $permissions = [
            'user_create',
            'user_view',
            'user_update',
            'user_delete',
            'role_create',
            'role_view',
            'role_update',
            'role_delete',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // Create roles
        $superAdminRole = Role::firstOrCreate(['name' => 'super-admin']);
        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        $userRole = Role::firstOrCreate(['name' => 'user']);

        $superAdminRole->syncPermissions(Permission::all());

        $adminRole->syncPermissions([
            'user_create',
            'user_view',
            'user_update',
            'user_delete',
        ]);

        // User role can have no permissions or only view permissions
        $userRole->syncPermissions(['user_view']);

        // Create users
        $superAdmin = User::factory()->create([
            'name' => 'Super Admin',
            'email' => 'superadmin@gmail.com',
            'password' => bcrypt('superadmin'),
        ]);

        $admin = User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@gmail.com',
            'password' => bcrypt('admin'),
        ]);

        $user = User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@gmail.com',
            'password' => bcrypt('user'),
        ]);

        // Assign roles
        $superAdmin->assignRole($superAdminRole);
        $admin->assignRole($adminRole);
        $user->assignRole($userRole);
    }
}