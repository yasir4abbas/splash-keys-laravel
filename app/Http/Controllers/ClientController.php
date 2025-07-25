<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use App\Models\Company;
use App\Models\LeaveRequest;
use App\Models\LeaveBalance;
use App\Models\Employee;
use App\Models\CompanyHoliday;
use App\Models\User;
use Inertia\Inertia;
use App\Models\Client;

class ClientController extends Controller 
{
    public function index()
    {
        return Inertia::render('clients');
    }

    public function edit($id)
    {
        $client = Client::with('clientIPs')->find($id);
        $client->hostnames = $client->clientIPs->pluck('hostname')->toArray();
        return Inertia::render('clients/create', [
            'client' => $client
        ]);
    }

    public function create()
    {
        return Inertia::render('clients/create');
    }

    public function list()
    {
        $clients = Client::with('clientIPs')->get();
        $clients->each(function ($client) {
            $client->hostnames = $client->clientIPs->pluck('hostname')->toArray();
        });
        return response()->json($clients);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:clients,email',
            // 'position' => 'required|string|max:255',
            'start_date' => 'required|date',
            // 'access_level' => 'required|string|max:255',
            'hostnames' => 'array',
            'hostnames.*' => 'string|max:255',
        ]);
        
        $client = Client::create($request->except('hostnames'));
        
        // Handle hostnames
        if ($request->has('hostnames')) {
            foreach ($request->hostnames as $hostname) {
                if (!empty($hostname)) {
                    $client->clientIPs()->create([
                        'hostname' => $hostname,
                    ]);
                }
            }
        }
        
        return back()->withErrors(['data' => json_encode($client)]);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:clients,email,' . $id,
            'position' => 'required|string|max:255',
            'start_date' => 'required|date',
            'access_level' => 'required|string|max:255',
            'hostnames' => 'array',
            'hostnames.*' => 'string|max:255',
        ]);
        
        $client = Client::find($id);
        $client->update($request->except('hostnames'));
        
        $client->clientIPs()->delete();
        if ($request->has('hostnames')) {
            foreach ($request->hostnames as $hostname) {
                if (!empty($hostname)) {
                    $client->clientIPs()->create([
                        'hostname' => $hostname,
                    ]);
                }
            }
        }
        
        return back()->withErrors(['data' => json_encode($client)]);
    }

    public function destroy($id)
    {
        $client = Client::find($id);
        $client->clientIPs()->delete();
        $client->machines()->delete();
        if (!$client) {
            return back()->withErrors(['error' => 'Client not found']);
        }
        $client->delete();
        return redirect()->back();
    }
}