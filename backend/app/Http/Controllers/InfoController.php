<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\User;

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

    public function fetchUsers(Request $request)
    {
        $preference = $request->preference;
        $users = User::all()->where('gender', $preference);
        return response()->json($users);
    }
}
