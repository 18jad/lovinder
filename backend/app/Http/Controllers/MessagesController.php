<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Conversation;
use App\Models\Message;
use App\Models\User;
use Illuminate\Support\Facades\Validator;

class MessagesController extends Controller
{

    public function __construct()
    {
        $this->middleware('auth:api');
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

    public function fetchMessages(Request $request)
    {
        $conversation_id = $request->conversation_id;
        $messages = Message::all()->where('converstation_id', $conversation_id);
        return response()->json($messages);
    }

    public function sendMessage(Request $request)
    {
        $validator = Validator::make($request->all(), [
            "receiver_id" => "required",
            "converstation_id" => "required",
            "message" => "required|string|min:1",
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'error' => $validator->errors()
            ], 401);
        } else {
            $message = Message::create(['sender_id' => auth()->user()->id, $validator->validated()]);
            return response()->json([
                'status' => true,
                'message' => 'Message sent successfully',
            ], 201);
        }
    }

    public function fetchUserById_no_request($id)
    {
        $user = User::find($id);
        return response()->json($user);
    }
}
