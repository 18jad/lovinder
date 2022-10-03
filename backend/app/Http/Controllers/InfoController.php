<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class InfoController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api');
    }


    public function fetchProfile()
    {
        return response()->json(auth()->user());
    }
}
