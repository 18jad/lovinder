<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

use App\Models\Matching;
use App\Models\Conversation;


class MatchingController extends Controller
{

    public function __construct()
    {
        $this->middleware('auth:api');
    }

    public function match(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'match_with' => 'required'
        ]);
        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'error' => $validator->errors()
            ], 401);
        } else {
            $user_id = auth()->user()->id;
            $match_with_id = $request->match_with;
            Matching::insert([
                ['first_id' => $user_id, 'second_id' => $match_with_id],
            ]);
            $this->checkMatch($user_id, $match_with_id);
            return response()->json([
                'status' => true,
                'message' => 'Successfully matched'
            ]);
        }
    }

    // to check if 2 users match if yes create a conversation for them
    public function checkMatch($user_id, $match_with_id)
    {
        $query1 = Matching::where('first_id', $user_id)->where('second_id', $match_with_id)->first();
        $query2 = Matching::where('first_id', $match_with_id)->where('second_id', $user_id)->first();
        if ($query1 && $query2) {
            Conversation::insert([
                ['user_id' => $user_id, 'converstation_with' => $match_with_id],
                ['user_id' => $match_with_id, 'converstation_with' => $user_id],
            ]);
        }
    }
}
