<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;   // ← add this
use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class Shipment extends Model
{
    use HasFactory;                                      // ← and this

    protected $fillable = [
      'pickup_address','pickup_latitude','pickup_longitude',
      'dropoff_address','dropoff_latitude','dropoff_longitude',
      'cargo_type','weight','truck_type',
      'pickup_date','dropoff_date','status',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);            // ← make sure you also have:
    }
}
