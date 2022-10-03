<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ImageController;

Route::group(['middleware' => 'api', 'prefix' => 'auth'], function ($router) {
    Route::post('login', [AuthController::class, 'login']);
    Route::post('register', [AuthController::class, 'register']);
    Route::post('logout', [AuthController::class, 'logout']);
});

Route::group(["middleware" => "preference", "prefix" => "info"], function ($router) {
    Route::get('profile', [AuthController::class, 'fetchProfile']);
    Route::post('users', [AuthController::class, 'fetchUsers']);
    Route::post('chat', [AuthController::class, 'fetchChat']);
    Route::post('messages', [AuthController::class, 'fetchMessages']);
});

Route::group(["prefix" => "images"], function ($router) {
    Route::post('upload', 'App\Http\Controllers\ImageController@upload');
    Route::get('update', [ImageController::class, 'update']);
});

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
