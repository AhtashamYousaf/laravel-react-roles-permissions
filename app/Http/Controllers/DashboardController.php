<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Inertia\Inertia;
use Carbon\Carbon;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Services\DashboardService;
use App\Services\UserService;
use App\Services\PermissionService;
use App\Services\RolesService;

class DashboardController extends Controller
{

    public function __construct(private readonly DashboardService $dashboardService
                                ,private readonly UserService $userService
                                ,private readonly PermissionService $permissionService
                                ,private readonly RolesService $roleService)
    {
    }
    
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $this->checkAuthorization(auth()->user(), ['dashboard.view']);
    
        return Inertia::render('dashboard/index', [
            'users' => $this->userService->getUsers(),
            'roles' => $this->roleService->getAllRoles(),
            'permissions' => $this->permissionService->getAllPermissionModels(),
            'mustVerifyEmail' => false,
            'status' => session('status'),
            'chartData' => $this->dashboardService->getSignupChartData(),
        ]);
    }
}
