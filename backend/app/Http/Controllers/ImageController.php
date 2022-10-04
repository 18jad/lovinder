<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use Illuminate\Support\Facades\Validator;

use App\Models\User;

class ImageController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api');
    }

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
            // get the image name with the file type
            $uploaded_image_full_name = $request->image->getClientOriginalName();

            // extract only image name without extension type
            $uploaded_image_name = pathinfo($uploaded_image_full_name, PATHINFO_FILENAME);

            // rename the image to image original name + current tiem + user id + .image type
            $imageName = $uploaded_image_name . time() . auth()->user()->id . '.' . $request->image->extension();

            // store the image inside iamges folder in public directory (public/images)
            $request->image->move(public_path('images'), $imageName);

            // update current logged in user field
            User::where('id', auth()->user()->id)->update([
                'profile' => $imageName
            ]);
            return response()->json([
                "status" => true,
                "image_name" => $imageName,
                "image_path" => public_path('images'),
                "image_src" => "/backend/public/images/" . $imageName,
            ]);
        }
    }
}
