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

    public function list()
    {
        $clients = Client::all();
        return response()->json($clients);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:clients,email',
            'position' => 'required|string|max:255',
            'start_date' => 'required|date',
            'access_level' => 'required|string|max:255',
        ]);
        $client = Client::create($request->all());
        return back()->withErrors(['data' => json_encode($client)]);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:clients,email',
            'position' => 'required|string|max:255',
            'start_date' => 'required|date',
            'access_level' => 'required|string|max:255',
        ]);
        $client = Client::find($id);
        $client->update($request->all());
        return back()->withErrors(['data' => json_encode($client)]);
    }

    public function destroy($id)
    {
        $client = Client::find($id);
        $client->delete();
        return back()->withErrors(['data' => 'Client deleted successfully']);
    }
}