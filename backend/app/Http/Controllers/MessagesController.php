<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Conversation;
use App\Models\Message;
use App\Models\User;


class MessagesController extends Controller
{
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

    public function fetchUserById_no_request($id)
    {
        $user = User::find($id);
        return response()->json($user);
    }
}
