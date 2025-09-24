<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function validateOrder($id)
    {
        $order = DB::table('orders')->where('id', $id)->first();

        if (!$order) {
            return response()->json([
                'status' => 'error',
                'message' => 'Order not found'
            ], 404);
        }

        // Set status jadi "validating"
        DB::table('orders')->where('id', $id)->update([
            'status' => 'validating',
            'updated_at' => now()
        ]);

        return response()->json([
            'status' => 'success',
            'message' => "Order #$id siap divalidasi",
            'data' => DB::table('orders')->where('id', $id)->first() // ambil data terbaru
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
}