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
        $search = $request->get('search');
        $users = User::with('roles')->when($search, function ($query, $search) {
            $query->where('name', 'like', "%{$search}%");
        })->paginate(10)->withQueryString();
       
        
        return Inertia::render('users/index', [
            'users' => $users,
            'roles' => Role::all(),
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
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:' . User::class,
            'password' => ['required', Rules\Password::defaults()],
            'roleId' => 'required|numeric',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        event(new Registered($user));

        $role = Role::findById($request->input('roleId'), 'web');
        $user->syncRoles([$role->name]);

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
        'roleId' => 'required|numeric',
        ]);

        $user->fill([
            'name' => $request->input('name'),
            'email' => $request->input('email'),
        ]);

        if (!empty($request->input('password'))) {
            $user->password = Hash::make($request->input('password'));
        }

        $user->save();

        $role = Role::findById($request->input('roleId'), 'web');
        $user->syncRoles([$role->name]);

       return to_route('admin.users.index')->with('success', 'User updated successfully!');
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $user = User::findOrFail($id);

        if ($user->hasRole('super-admin')) {
            return back(303)->withErrors(['delete' => 'Cannot delete this user.']);
        }

        $user->syncRoles(); 
        $user->syncPermissions();    
        
        $user->delete();
        

        return redirect()->back()->with('status', 'User deleted successfully.');
    }
}
