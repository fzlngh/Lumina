<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function getValidatingOrders()
{
    $orders = DB::table('orders')
        ->join('face_logs', 'orders.id', '=', 'face_logs.order_id')
        ->where('orders.status', 'validating')
        ->select('orders.id', 'orders.user_id', 'orders.status', 'face_logs.hash')
        ->get();

    return response()->json($orders);
}


    public function validateOrder($id)
{
    $order = DB::table('orders')->where('id', $id)->first();

    if (!$order) {
        return response()->json([
            'status' => 'error',
            'message' => 'Order not found'
        ], 404);
    }

    // Ambil face log terbaru (dummy, apapun wajah terakhir yg diupload)
    $latestLog = DB::table('face_logs')->orderBy('created_at', 'desc')->first();

    // Update status order
    DB::table('orders')->where('id', $id)->update([
        'status' => 'validating',
        'updated_at' => now()
    ]);

    // Force relasikan log terbaru ke order ini
    if ($latestLog) {
        DB::table('face_logs')->where('id', $latestLog->id)->update([
            'order_id' => $id,
            'updated_at' => now()
        ]);
    }

    return response()->json([
        'status' => 'success',
        'message' => "Order #$id siap divalidasi",
        'data' => DB::table('orders')->where('id', $id)->first()
    ]);
}


    public function confirmOrder(Request $request, $id)
    {
        $request->validate([
            'result' => 'required|string|in:success,failed'
        ]);

        $order = DB::table('orders')->where('id', $id)->first();

        if (!$order) {
            return response()->json([
                'status' => 'error',
                'message' => 'Order not found'
            ], 404);
        }

        // Update status sesuai hasil
        $newStatus = $request->result === 'success' ? 'completed' : 'cancelled';

        DB::table('orders')->where('id', $id)->update([
            'status' => $newStatus,
            'updated_at' => now()
        ]);

        return response()->json([
            'status' => 'success',
            'message' => "Order #$id sudah divalidasi",
            'result' => $request->result
        ]);
    }
    public function getPendingFaces()
{
    $logs = DB::table('face_logs')
        ->where('result', 'pending')
        ->select('id', 'user_id', 'hash', 'result')
        ->get();

    return response()->json($logs);
}

}
