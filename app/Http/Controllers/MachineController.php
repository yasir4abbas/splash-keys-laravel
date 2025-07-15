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
use App\Models\Machine;

class MachineController extends Controller 
{
    public function index()
    {
        return Inertia::render('machines');
    }

    public function list()
    {
        $machines = Machine::with(['client', 'license'])->get();
        return response()->json($machines);
    }

    public function store(Request $request)
    {
        $request->validate([
            'hostname' => 'nullable|string|max:255',
            'fingerprint' => 'required|string',
            'status' => 'required|string|in:active,inactive',
            'client_id' => 'required|integer|exists:clients,id',
            'license_id' => 'required|integer|exists:licenses,id',
        ]);
        $machine = Machine::create($request->all());
        return back()->withErrors(['data' => json_encode($machine)]);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'hostname' => 'nullable|string|max:255',
            'fingerprint' => 'required|string',
            'status' => 'required|string|in:active,inactive',
            'client_id' => 'required|integer|exists:clients,id',
            'license_id' => 'required|integer|exists:licenses,id',
        ]);
        $machine = Machine::find($id);
        $machine->update($request->all());
        return back()->withErrors(['data' => json_encode($machine)]);
    }

    public function destroy($id)
    {
        $machine = Machine::find($id);
        $machine->delete();
        return back()->withErrors(['data' => 'Machine deleted successfully']);
    }
}