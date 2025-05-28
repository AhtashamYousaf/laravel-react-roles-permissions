<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Inertia\Inertia;
use App\Services\RolesService;
use App\Services\PermissionService;

class RoleController extends Controller
{
    public function __construct(
        private readonly RolesService $rolesService,
        private readonly PermissionService $permissionService
    )
    {
        
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $this->checkAuthorization(auth()->user(), ['role.view']);
        
        $perPage = config('settings.default_pagination') ?? 10;
        $search = request()->input('search') !== '' ? request()->input('search') : null;
        
        $roles = $this->rolesService->getPaginatedRolesWithUserCount($search, 10);
        $permissions = $this->permissionService->getAllPermissionModels();

        return Inertia::render('roles/Index', [
            'roles' => $roles,
            'permissions' => $permissions,
            'mustVerifyEmail' => false,
            'status' => session('status'),
            'search' => $search,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $this->checkAuthorization(auth()->user(), ['role.create']);
        $request->validate([
            'name' => 'required|string|max:255|unique:roles,name',
        ]);
    
        $role = $this->rolesService->createRole($request->input('name'), $request->permissions);
    
        return redirect()->back()->with('status', 'Role created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $this->checkAuthorization(auth()->user(), ['role.update']);
        $request->validate([
            'name' => 'required|string|max:255',
        ]);
        
        $role = $this->rolesService->updateRole(Role::findOrFail($id), $request->input('name'), $request->permissions);
       
        return redirect()->back()->with('status', 'Role updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $this->checkAuthorization(auth()->user(), ['role.delete']);
        
        $role = $this->rolesService->deleteRole(Role::findOrFail($id));
        
        return redirect()->back()->with('status', 'Role deleted successfully.');
    }
}
