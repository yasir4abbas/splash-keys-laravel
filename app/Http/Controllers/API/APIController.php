<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Client;
use App\Models\License;
use App\Models\Machine;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class APIController extends Controller 
{

    public function registerMachine(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'license_id' => 'required|string|exists:licenses,license_id',
                'client_email' => 'required|email|exists:clients,email',
                'hostname' => 'required|string|max:255',
                'fingerprint' => 'required|string|max:500',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $license = License::where('license_id', $request->license_id)->first();
            if (!$license) {
                return response()->json([
                    'success' => false,
                    'message' => 'License not found'
                ], 404);
            }

            if ($license->status !== 'active') {
                return response()->json([
                    'success' => false,
                    'message' => 'License is not active'
                ], 400);
            }

            if ($license->expiration_date && $license->expiration_date->isPast()) {
                return response()->json([
                    'success' => false,
                    'message' => 'License has expired'
                ], 400);
            }

            $client = Client::where('email', $request->client_email)->first();
            if (!$client) {
                return response()->json([
                    'success' => false,
                    'message' => 'Client not found'
                ], 404);
            }

            $existingMachine = Machine::where('fingerprint', $request->fingerprint)->first();
            
            if ($existingMachine) {
                return response()->json([
                    'success' => false,
                    'message' => 'Machine with this fingerprint already exists',
                    'machine_id' => $existingMachine->machine_id
                ], 409);
            }

            $currentMachineCount = Machine::where('license_id', $license->id)->count();
            if ($license->max_count && $currentMachineCount >= $license->max_count) {
                return response()->json([
                    'success' => false,
                    'message' => 'License has reached maximum machine count'
                ], 400);
            }

            $machine = Machine::create([
                'hostname' => $request->hostname,
                'fingerprint' => $request->fingerprint,
                'client_id' => $client->id,
                'license_id' => $license->id,
                'status' => 'active'
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Machine registered successfully',
                'data' => [
                    'machine_id' => $machine->machine_id,
                    'hostname' => $machine->hostname,
                    'license_id' => $license->license_id,
                    'client_email' => $client->email
                ]
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Internal server error',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function checkMachine(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'license_id' => 'required|string|exists:licenses,license_id',
                'client_email' => 'required|email|exists:clients,email',
                'hostname' => 'required|string|max:255',
                'fingerprint' => 'required|string|max:500',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $license = License::where('license_id', $request->license_id)->first();
            if (!$license) {
                return response()->json([
                    'success' => false,
                    'message' => 'License not found'
                ], 404);
            }

            $client = Client::where('email', $request->client_email)->first();
            if (!$client) {
                return response()->json([
                    'success' => false,
                    'message' => 'Client not found'
                ], 404);
            }

            $machine = Machine::where('fingerprint', $request->fingerprint)
                            ->where('license_id', $license->id)
                            ->where('client_id', $client->id)
                            ->first();
            if (!$machine) {
                return response()->json([
                    'success' => false,
                    'message' => 'Machine not found or not registered with this license',
                    'exists' => false
                ], 404);
            }

            return response()->json([
                'success' => true,
                'message' => 'Machine found and registered',
                'data' => [
                    'machine_id' => $machine->machine_id,
                    'hostname' => $machine->hostname,
                    'status' => $machine->status,
                    'license_id' => $license->license_id,
                    'client_email' => $client->email,
                    'exists' => true
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Internal server error',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function validateLicense(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'license_id' => 'required|string|exists:licenses,license_id',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }
            $license = License::with('package')->where('license_id', $request->license_id)->first();
            
            if (!$license) {
                return response()->json([
                    'success' => false,
                    'message' => 'License not found'
                ], 404);
            }

            $isActive = $license->status === 'active';
            $isExpired = $license->expiration_date && $license->expiration_date->isPast();
            $currentMachineCount = Machine::where('license_id', $license->id)->count();

            return response()->json([
                'success' => true,
                'data' => [
                    'license_id' => $license->license_id,
                    'license_type' => $license->license_type,
                    'status' => $license->status,
                    'is_active' => $isActive && !$isExpired,
                    'is_expired' => $isExpired,
                    'expiration_date' => $license->expiration_date?->toDateString(),
                    'max_count' => $license->max_count,
                    'current_count' => $currentMachineCount,
                    // 'cost' => $license->cost,
                    'renewal_terms' => $license->renewal_terms,
                    'package' => $license->package ? [
                        'id' => $license->package->id,
                        'name' => $license->package->name,
                        'description' => $license->package->description
                    ] : null
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Internal server error',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}