<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class FaceController extends Controller
{
    public function upload(Request $request)
    {
        $request->validate([
            'image_base64' => 'required|string',
            'device_id'    => 'nullable|string|max:50',
            'timestamp'    => 'nullable|date',
        ]);

        $imageData = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $request->image_base64));

        if (!$imageData) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Gagal decode gambar.'
            ], 400);
        }

        $hash     = hash('sha256', $imageData);
        $filename = $hash . '.jpg';

        Storage::disk('local')->put('faces/' . $filename, $imageData);

        DB::table('face_logs')->insert([
            'hash'       => $hash,
            'device_id'  => $request->device_id,
            'timestamp'  => $request->timestamp ?? now(),
            'result'     => 'pending',
            'confidence' => null,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return response()->json([
            'status'  => 'success',
            'message' => 'Gambar berhasil diterima',
            'data'    => [
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
    public function getPendingFaces()
{
    $faces = DB::table('face_logs')
        ->where('result', 'pending')
        ->orderBy('created_at', 'asc')
        ->get();

    return response()->json($faces);
}


    public function updateResult(Request $request, $hash)
    {
        $request->validate([
            'result'     => 'required|string|in:valid,invalid,pending',
            'confidence' => 'nullable|numeric|min:0|max:1',
        ]);

        $log = DB::table('face_logs')->where('hash', $hash)->first();

        if (!$log) {
            return response()->json(['error' => 'Log not found'], 404);
        }

        // Update hasil validasi wajah
        DB::table('face_logs')->where('hash', $hash)->update([
            'result'     => $request->result,
            'confidence' => $request->confidence,
            'updated_at' => now(),
        ]);

        if ($log->order_id) {
            $newStatus = $request->result === 'valid' ? 'completed' : 'cancelled';
            DB::table('orders')->where('id', $log->order_id)->update([
                'status'     => $newStatus,
                'updated_at' => now(),
            ]);
        }

        return response()->json([
            'message'    => 'Result updated',
            'hash'       => $hash,
            'result'     => $request->result,
            'confidence' => $request->confidence,
        ]);
    }
}
