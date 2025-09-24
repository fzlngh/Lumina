<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class FaceController extends Controller
{
    public function upload(Request $request)
{
    // Validasi input
    $request->validate([
        'image_base64' => 'required|string',
        'device_id' => 'nullable|string|max:50',
        'timestamp' => 'nullable|date',
    ]);

    // Bersihkan prefix base64 (supaya aman)
    $imageData = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $request->image_base64));

    if (!$imageData) {
        return response()->json([
            'status' => 'error',
            'message' => 'Gagal decode gambar.'
        ], 400);
    }

    $hash = hash('sha256', $imageData);
    $filename = $hash . '.jpg';

    \Illuminate\Support\Facades\Storage::disk('local')->put('faces/' . $filename, $imageData);

    \Illuminate\Support\Facades\DB::table('face_logs')->insert([
        'hash' => $hash,
        'device_id' => $request->device_id,
        'timestamp' => $request->timestamp ?? now(),
        'result' => 'pending',
        'confidence' => null,
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    return response()->json([
        'status' => 'success',
        'message' => 'Gambar berhasil diterima',
        'data' => [
            'hash' => $hash,
            'file' => $filename,
        ]
    ], 201);
}


    public function getLogs()
    {
        return DB::table('face_logs')
            ->orderBy('created_at', 'desc')
            ->limit(50)
            ->get();
    }

    public function getLogByHash($hash)
    {
        $log = DB::table('face_logs')->where('hash', $hash)->first();
        if (!$log) {
            return response()->json(['error' => 'Not found'], 404);
        }
        return $log;
    }
}
