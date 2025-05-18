<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $data = $request->validate([
            'name'                  => 'required|string|max:255',
            'email'                 => 'required|email|unique:users,email',
            'phone'                 => 'required|unique:users,phone',
            'password'              => 'required|confirmed|min:6',
        ]);

        $user = User::create([
            'name'     => $data['name'],
            'email'    => $data['email'],
            'phone'    => $data['phone'],
            'password' => Hash::make($data['password']),
            // if you want newly registered to be admin, add 'is_admin' here
        ]);

        $token = $user->createToken('mobile')->plainTextToken;

        return response()->json([
            'user'     => $user,
            'token'    => $token,
            'is_admin' => $user->is_admin,   // ← return flag
        ], 201);
    }

    public function login(Request $request)
    {
        $data = $request->validate([
            'email_or_phone' => 'required',
            'password'       => 'required',
        ]);

        $user = User::where('email', $data['email_or_phone'])
                    ->orWhere('phone', $data['email_or_phone'])
                    ->first();

        if (! $user || ! Hash::check($data['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email_or_phone' => ['Invalid credentials.'],
            ]);
        }

        $token = $user->createToken('mobile')->plainTextToken;

        return response()->json([
            'user'     => $user,
            'token'    => $token,
            'is_admin' => $user->is_admin,   // ← return flag
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out']);
    }
}
