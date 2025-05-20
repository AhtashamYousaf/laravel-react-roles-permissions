<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        
        $users = User::all();
       
        return Inertia::render('dashboard', [
            'users' => $users,
            'mustVerifyEmail' => false,
            'status' => session('status'),
        ]);
    }
}
