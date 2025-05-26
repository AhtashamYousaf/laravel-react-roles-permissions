<?php

namespace App\Http\Controllers;
use App\Traits\AuthorizationChecker;

abstract class Controller
{
    use AuthorizationChecker;
}
