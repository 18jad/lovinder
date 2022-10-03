<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use Illuminate\Support\Facades\Validator;

class ImageController extends Controller
{


    public function upload(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'image' => 'required|image|mimes:png,jpg,jpeg'
        ]);
        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'error' => $validator->errors()
            ], 401);
        } else {
            $imageName = time() . auth()->id() . '.' . $request->image->extension();
            $request->image->move(public_path('images'), $imageName);
            return response()->json([
                "status" => true,
            ]);
        }
    }
}
