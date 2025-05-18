<?php

namespace App\Http\Controllers;

use App\Models\Shipment;
use Illuminate\Http\Request;

class ShipmentController extends Controller
{
    // List only this user’s shipments
    public function index(Request $request)
    {
        return response()->json(
            $request->user()->shipments()->get()
        );
    }

    // Create a new shipment for this user
    public function store(Request $request)
{
    $data = $request->validate([
        'pickup_address'    => 'required|string',
        'pickup_latitude'   => 'required|numeric',
        'pickup_longitude'  => 'required|numeric',
        'dropoff_address'   => 'required|string',
        'dropoff_latitude'  => 'required|numeric',
        'dropoff_longitude' => 'required|numeric',
        'cargo_type'        => 'required|string',
        'weight'            => 'required|string',
        'truck_type'        => 'required|string',
        // no more pickup_date/dropoff_date here
    ]);

    $shipment = $request->user()->shipments()->create($data);

    return response()->json($shipment, 201);
}

    // Show a single shipment (only if it belongs to you, or you’re admin)
    // app/Http/Controllers/ShipmentController.php

public function show(Request $request, $id)
{
    $shipment = Shipment::with('user')->findOrFail($id);

    if ($shipment->user_id !== $request->user()->id
        && ! $request->user()->is_admin
    ) {
        return response()->json(['message'=>'Forbidden'], 403);
    }

    return response()->json($shipment);
}


    // Admin: list *all* shipments in the system, now including the user's name
    public function all(Request $request)
    {
        if (! $request->user()->is_admin) {
            return response()->json(['message'=>'Forbidden'], 403);
        }
    
        // eager-load the `user` relationship so you can show their name
        $shipments = Shipment::with('user')->get();
    
        return response()->json($shipments);
    }

    // Admin: update status (or any other field) on any shipment
    public function update(Request $request, $id)
    {
        if (! $request->user()->is_admin) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $shipment = Shipment::findOrFail($id);

        $data = $request->validate([
            'status' => 'required|in:pending,in_progress,delivered',
        ]);

        $shipment->update($data);

        return response()->json($shipment);
    }
}
