<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use App\Models\Face;

class FaceController extends Controller
{
    // === Upload foto dari ESP32 ===
    public function upload(Request $request)
    {
        $request->validate([
            'image_base64' => 'required|string',
            'device_id'    => 'required|string',
        ]);

        $imageData = $request->input('image_base64');
        $deviceId  = $request->input('device_id');

        // Hilangkan prefix "data:image/jpeg;base64,"
        if (strpos($imageData, ',') !== false) {
            $imageData = explode(',', $imageData)[1];
        }

        $binaryData = base64_decode($imageData);
        if (!$binaryData) {
            return response()->json([
                'status' => 'error',
                'message' => 'Invalid base64 image'
            ], 400);
        }

        // Generate hash unik
        $hash = Str::random(16);
        $fileName = $hash . '.jpg';

        // Simpan file
        Storage::put("faces/$fileName", $binaryData);

        // DEMO MODE: device tertentu otomatis valid
        $userId = 1;
        if ($deviceId === "esp32cam-1") {
            $userId = 1; // otomatis valid
        }

        // Simpan ke DB
        $face = Face::create([
            'hash'      => $hash,
            'file'      => $fileName,
            'device_id' => $deviceId,
            'user_id'   => $userId,
            'status'    => 'pending',
        ]);

        return response()->json([
            'status'  => 'success',
            'message' => 'Gambar berhasil diterima',
            'data'    => [
                'hash' => $hash,
                'file' => $fileName,
            ]
        ]);
    }

    // === Cek hasil berdasarkan hash ===
    public function getLogByHash($hash)
    {
        $face = Face::where('hash', $hash)->first();
        if (!$face) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Hash not found'
            ], 404);
        }

        return response()->json([
            'hash'       => $face->hash,
            'device_id'  => $face->device_id,
            'result'     => $face->status,      // pending / valid / invalid
            'confidence' => $face->confidence,
            'user_id'    => $face->user_id,
        ]);
    }

    // === Ambil list pending untuk worker ===
    public function getPendingFaces()
    {
        return Face::where('status', 'pending')->get();
    }

    // === Update hasil dari worker ===
    public function updateResult(Request $request, $hash)
    {
        $face = Face::where('hash', $hash)->first();
        if (!$face) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Hash not found'
            ], 404);
        }

        $face->status = $request->input('result');
        $face->confidence = $request->input('confidence');
        $face->user_id = $request->input('user_id', $face->user_id);
        $face->save();

        return response()->json([
            'status'  => 'success',
            'message' => 'Result updated',
            'data'    => $face
        ]);
    }
}
