<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Auth\Events\Registered;
use Illuminate\Validation\Rules;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Redirect;
use App\Services\UserService;

class UserController extends Controller
{
    public function __construct(private readonly UserService $userService,)
    {
        
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $this->checkAuthorization(auth()->user(), ['user.view']);

        $search = request()->input('search') !== '' ? request()->input('search') : null;
        $roleId = request()->input('role') !== '' ? request()->input('role') : null;

        return Inertia::render('users/index', [
            'users' => $this->userService->getPaginatedUsers($search, $roleId),
            'roles' => Role::all(),
            'permissions' => Permission::all(),
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
    public function store(Request $request): RedirectResponse
    {
        $this->checkAuthorization(auth()->user(), ['user.create']);
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:' . User::class,
            'password' => ['required', Rules\Password::defaults()],
            'roleIds' => 'required|array',
            'roleIds.*' => 'integer|exists:roles,id',
            'permissionIds' => 'nullable|array',
            'permissionIds.*' => 'integer|exists:permissions,id',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        event(new Registered($user));

        $roleIds = $request->input('roleIds');

        // Fetch roles by IDs
        $roles = Role::whereIn('id', $roleIds)->where('guard_name', 'web')->get();
        if ($user->id === auth()->id() && !$user->hasRole('Superadmin')) {
            return back(303)->withErrors(['update' => 'You cannot change your own role.']);
        }

        foreach ($roles as $role) {
            if (in_array($role->name, ['Admin', 'Superadmin']) && !auth()->user()->hasRole('Superadmin')) {
                return back(303)->withErrors(['update' => 'Only superadmin can assign the admin or Superadmin role.']);
            }
        }
        // Sync roles
        $user->syncRoles($roles->pluck('name')->toArray());

         // ✅ Sync direct permissions (optional in addition to role-based permissions)
        $permissionIds = $request->input('permissionIds', []);
        $permissions = Permission::whereIn('id', $permissionIds)->where('guard_name', 'web')->get();
        $user->syncPermissions($permissions);

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
    public function update(Request $request, string $id): RedirectResponse
    {
        $this->checkAuthorization(auth()->user(), ['user.update']);
        $user = User::findOrFail($id);
        
        $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|string|lowercase|email|max:255|unique:users,email,' . $id,
        'password' => ['nullable', Rules\Password::defaults()],
        'roleIds' => 'required|array',
        'roleIds.*' => 'integer|exists:roles,id',
        'permissionIds' => 'nullable|array',
        'permissionIds.*' => 'integer|exists:permissions,id',
        ]);
        
        $user->fill([
            'name' => $request->input('name'),
            'email' => $request->input('email'),
        ]);

        if (!empty($request->input('password'))) {
            $user->password = Hash::make($request->input('password'));
        }

        
        $roleIds = $request->input('roleIds');

        // Fetch roles by IDs
        $roles = Role::whereIn('id', $roleIds)->where('guard_name', 'web')->get();
        if ($user->id === auth()->id() && !$user->hasRole('Superadmin')) {
            return back()->withErrors(['update' => 'You cannot change your own role.']);
        }

        foreach ($roles as $role) {
            if (in_array($role->name, ['Admin', 'Superadmin']) && !auth()->user()->hasRole('Superadmin')) {
                return back()->withErrors(['update' => 'Only superadmin can assign the Admin or Superadmin role.']);
            }
        }

        $user->save();
        // Sync roles
        $user->syncRoles($roles->pluck('name')->toArray());

        // Sync individual permissions (optional in addition to role-based permissions)
        $permissionIds = $request->input('permissionIds', []);
        $permissions = Permission::whereIn('id', $permissionIds)->where('guard_name', 'web')->get();
        $user->syncPermissions($permissions);

       return to_route('admin.users.index')->with('success', 'User updated successfully!');
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $this->checkAuthorization(auth()->user(), ['user.delete']);
        $user = User::findOrFail($id);
        if ($user->id == auth()->id()) {
            return back(303)->withErrors(['delete' => 'You cannot delete your own account.']);
        }
        if ($user->hasRole('Superadmin')) {
            return back(303)->withErrors(['delete' => 'Cannot delete this user.']);
        }

        $user->syncRoles(); 
        $user->syncPermissions();    
        
        $user->delete();
        

        return redirect()->back()->with('status', 'User deleted successfully.');
    }
}
