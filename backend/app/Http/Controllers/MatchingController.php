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
            // $this->checkMatch($user_id, $match_with_id);
            return response()->json([
                'status' => true,
                'message' => 'Successfully matched'
            ]);
        }
    }
}
