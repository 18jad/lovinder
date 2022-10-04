<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ImageController;
use App\Http\Controllers\InfoController;
use App\Http\Controllers\MessagesController;
use App\Http\Controllers\MatchingController;

Route::group(['middleware' => 'api', 'prefix' => 'auth'], function ($router) {
    Route::post('login', [AuthController::class, 'login'])->name('login');
    Route::post('register', [AuthController::class, 'register']);
    Route::post('logout', [AuthController::class, 'logout']);
});

Route::group(["middleware" => "api", "prefix" => "info"], function ($router) {
    Route::get('profile', [InfoController::class, 'fetchProfile']);
    Route::post('users', [InfoController::class, 'fetchUsers']);
    Route::post('user_profile', [InfoController::class, 'fetchUserById']);
});

Route::group(["middleware" => 'api', "prefix" => "chat"], function ($router) {
    Route::post('chat', [MessagesController::class, 'fetchChat']);
    Route::post('messages', [MessagesController::class, 'fetchMessages']);
    Route::post('send_message', [MessagesController::class, 'sendMessage']);
});

Route::group(['middleware' => 'api', "prefix" => "date"], function ($router) {
    Route::post('match', [MatchingController::class, 'match']);
});

Route::group(['middleware' => 'api', "prefix" => "images"], function ($router) {
    Route::post('upload', [ImageController::class, 'upload']);
});

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
