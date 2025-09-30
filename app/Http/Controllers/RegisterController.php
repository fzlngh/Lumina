<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Storage;

class RegisterController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
            'photos'   => 'required|array|min:3|max:3',  // harus 3 foto
            'photos.*' => 'image|mimes:jpg,jpeg,png|max:4096',
        ]);

        // Buat user baru
        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => bcrypt($request->password),
        ]);

        // Simpan foto ke dataset/{user_id}/
        $datasetPath = "dataset/" . $user->id;
        if (!Storage::disk('local')->exists($datasetPath)) {
            Storage::disk('local')->makeDirectory($datasetPath);
        }

        foreach ($request->file('photos') as $index => $photo) {
            $filename = "photo" . ($index+1) . ".jpg";
            $photo->storeAs($datasetPath, $filename, 'local');
        }

        return response()->json([
            'message' => 'User registered and dataset uploaded',
            'user'    => $user,
            'dataset' => $datasetPath
        ]);
    }
}
