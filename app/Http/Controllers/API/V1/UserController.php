<?php

namespace App\Http\Controllers\API\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Controllers\API\BaseController as BaseController;
use App\Services\UserService;
use App\Services\RolesService;
use App\Services\PermissionService;
use Illuminate\Http\JsonResponse;

class UserController extends BaseController
{

    public function __construct(
        private readonly UserService $userService,
        private readonly PermissionService $permissionService,
        private readonly RolesService $roleService
    )
    {
        
    }

    /**
     * List of Users (API)
     *
     * @return \Illuminate\Http\Response
     */
    public function getUsers(Request $request): JsonResponse
    {
        $this->checkAuthorization(auth()->user(), ['user.view']);

        $search = $request->input('search');
        $roleId = $request->input('role');

        $users = $this->userService->getPaginatedUsers($search, $roleId);

        return $this->sendResponse($users, 'Users retrieved successfully.');
    }

}
