<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;
use Illuminate\Auth\Events\Registered;
use Illuminate\Validation\Rules;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Redirect;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        if (!auth()->user()->hasAnyRole(['super-admin', 'admin'])) {
            return back(403)->withErrors(['list' => 'Unauthorized access']);
        }
    
        $search = $request->get('search');
        $roleId = $request->input('role');
    
        $users = User::with('roles')
            ->when($search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->when(auth()->user()->hasRole('admin'), function ($query) {
                $query->whereDoesntHave('roles', function ($q) {
                    $q->where('name', 'super-admin');
                });
            })
            ->when($roleId && $roleId !== 'all', function ($query) use ($roleId) {
                $query->whereHas('roles', function ($q) use ($roleId) {
                    $q->where('id', $roleId);
                });
            })
            ->paginate(10)
            ->withQueryString();
    
        return Inertia::render('users/index', [
            'users' => $users,
            'roles' => Role::all(),
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
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:' . User::class,
            'password' => ['required', Rules\Password::defaults()],
            'roleIds' => 'required|array',
            'roleIds.*' => 'integer|exists:roles,id'
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
        if ($user->id === auth()->id() && !$user->hasRole('super-admin')) {
            return back(303)->withErrors(['update' => 'You cannot change your own role.']);
        }

        foreach ($roles as $role) {
            if (in_array($role->name, ['admin', 'super-admin']) && !auth()->user()->hasRole('super-admin')) {
                return back(303)->withErrors(['update' => 'Only superadmin can assign the admin or super-admin role.']);
            }
        }
        // Sync roles
        $user->syncRoles($roles->pluck('name')->toArray());

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
        $user = User::findOrFail($id);
        
        $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|string|lowercase|email|max:255|unique:users,email,' . $id,
        'password' => ['nullable', Rules\Password::defaults()],
        'roleIds' => 'required|array',
        'roleIds.*' => 'integer|exists:roles,id'
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
        if ($user->id === auth()->id() && !$user->hasRole('super-admin')) {
            return back(303)->withErrors(['update' => 'You cannot change your own role.']);
        }

        foreach ($roles as $role) {
            if (in_array($role->name, ['admin', 'super-admin']) && !auth()->user()->hasRole('super-admin')) {
                return back(303)->withErrors(['update' => 'Only superadmin can assign the admin or super-admin role.']);
            }
        }

        $user->save();
        // Sync roles
        $user->syncRoles($roles->pluck('name')->toArray());

       return to_route('admin.users.index')->with('success', 'User updated successfully!');
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $user = User::findOrFail($id);
        if ($user->id == auth()->id()) {
            return back(303)->withErrors(['delete' => 'You cannot delete your own account.']);
        }
        if ($user->hasRole('super-admin')) {
            return back(303)->withErrors(['delete' => 'Cannot delete this user.']);
        }

        $user->syncRoles(); 
        $user->syncPermissions();    
        
        $user->delete();
        

        return redirect()->back()->with('status', 'User deleted successfully.');
    }
}
