<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Inertia\Inertia;
use Carbon\Carbon;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class DashboardController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        
        $users = User::all();

        $chartData = collect(range(0, 89))->map(function ($i) {
        $date = Carbon::now()->subDays(89 - $i)->format('Y-m-d');
            return [
                'date' => $date,
                'mobile' => rand(50, 200),
                'desktop' => rand(100, 300),
            ];
        })->values()->all();

        return Inertia::render('dashboard/index', [
            'users' => $users,
            'roles' => Role::all(),
            'permissions' => Permission::all(),
            'mustVerifyEmail' => false,
            'status' => session('status'),
            'chartData' => $chartData,
        ]);
    }
}
