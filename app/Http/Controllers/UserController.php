<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Redirect;
use App\Services\UserService;
use App\Http\Requests\User\StoreUserRequest;
use App\Http\Requests\User\UpdateUserRequest;
use App\Services\RolesService;
use App\Services\PermissionService;
use App\Models\User;

class UserController extends Controller
{
    public function __construct(
        private readonly UserService $userService,
        private readonly PermissionService $permissionService,
        private readonly RolesService $roleService
    )
    {
        
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $this->checkAuthorization(auth()->user(), ['user.view']);

        $search = $request->input('search') ?? null;
        $roleId = $request->input('role') ?? null;

        return Inertia::render('users/index', [
            'users' => $this->userService->getPaginatedUsers($search, $roleId),
            'roles' => $this->roleService->getAllRoles(),
            'permissions' => $this->permissionService->getAllPermissionModels(),
            'mustVerifyEmail' => false,
            'status' => session('status'),
            'search' => $search,
            'role' => $roleId
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
    public function store(StoreUserRequest $request): RedirectResponse
    {
        $this->checkAuthorization(auth()->user(), ['user.create']);
        $validated = $request->validated();
    
       try {
            $user = $this->userService->createUserWithRolesAndPermissions(
                $validated['name'],
                $validated['email'],
                $validated['password'],
                $validated['roleIds'] ?? [],
                $validated['permissionIds'] ?? []
            );

            event(new Registered($user));
        } catch (\Exception $e) {
            return back(303)->withErrors(['create' => $e->getMessage()]);
        }

        return to_route('admin.users.index')->with('success', 'User created!');
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
    public function update(UpdateUserRequest $request, User $user): RedirectResponse
    {
        $this->checkAuthorization(auth()->user(), ['user.update']);
        $validated = $request->validated();
        
        try {
            $this->userService->updateUserWithRolesAndPermissions(
                $user,
                name: $validated['name'],
                email: $validated['email'],
                password: $validated['password'] ?? null,
                roleIds: $validated['roleIds'] ?? [],
                permissionIds: $validated['permissionIds'] ?? []
            );
        } catch (\Exception $e) {
            return back(303)->withErrors(['update' => $e->getMessage()]);
        }

       return to_route('admin.users.index')->with('success', 'User updated successfully!');
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user): RedirectResponse
    {
        $this->checkAuthorization(auth()->user(), ['user.delete']);

        try {
            $this->userService->deleteUser($user);
        } catch (\Exception $e) {
            return back(303)->withErrors(['delete' => $e->getMessage()]);
        }

        return redirect()->back()->with('status', 'User deleted successfully.');
    }
}
