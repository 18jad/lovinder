<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Conversation;
use App\Models\Message;
use App\Models\User;
use App\Models\Block;

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
            $result[] = [$this->fetchUserById_no_request($chat->converstation_with), $chat];
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
        $message = Message::create([
            'sender_id' => auth()->user()->id,
            'receiver_id' => $request->receiver_id,
            'converstation_id' => $request->converstation_id,
            'message' => $request->message,
            'created_at' => new \DateTime(),
        ]);
        $other_user = Conversation::select('id')->where('user_id', $request->receiver_id)->where('converstation_with', auth()->user()->id)->get();
        Message::create([
            'sender_id' => auth()->user()->id,
            'receiver_id' => $request->receiver_id,
            'converstation_id' => $other_user[0]->id,
            'message' => $request->message,
            'created_at' => new \DateTime(),
        ]);
        return response()->json([
            'status' => true,
            'message' => 'Message sent successfully',
        ]);
    }

    public function block(Request $request)
    {
        $second_id = $request->second_id;
        Block::create([
            'first_id' => auth()->user()->id,
            'second_id' => $second_id,
        ]);
        return response()->json([
            'status' => true,
            'message' => 'Blocked successfully',
        ]);
    }

    public function fetchUserById_no_request($id)
    {
        $user = User::find($id);
        return response()->json($user);
    }
}
