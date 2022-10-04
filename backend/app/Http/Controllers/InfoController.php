<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\User;
use App\Models\Conversation;

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

    public function fetchUserById(Request $request)
    {
        $id = $request->id;
        $user = User::find($id);
        return response()->json($user);
    }

    public function fetchUserById_no_request($id)
    {
        $user = User::find($id);
        return response()->json($user);
    }


    public function fetchChat(Request $request)
    {
        $chats = Conversation::all()->where('user_id', $request->user()->id)->unique(['converstation_with']);
        $result = [];
        foreach ($chats as $chat) {
            $result[] = $this->fetchUserById_no_request($chat->converstation_with);
        }
        return response()->json($result);
    }
}
