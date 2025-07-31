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
use App\Models\License;
use App\Models\Package;

class LicenseController extends Controller 
{
    public function index()
    {
        return Inertia::render('licenses');
    }

    public function edit($id)
    {
        $license = License::with('package')->find($id);
        $packages = Package::select('id', 'package_name', 'version')->get();
        
        return Inertia::render('licenses/create', [
            'license' => $license,
            'packages' => $packages
        ]);
    }

    public function create()
    {
        $packages = Package::select('id', 'package_name', 'version')->get();
        return Inertia::render('licenses/create', [
            'packages' => $packages
        ]);
    }

    public function list()
    {
        $licenses = License::with(['machines', 'package'])->get();
        return response()->json($licenses);
    }

    public function store(Request $request)
    {
        $request->validate([
            'license_key' => 'required|string|unique:licenses,license_key',
            'license_type' => 'required|string|in:per-user,per-machine,concurrent-users',
            'max_count' => 'required|integer|min:1',
            'expiration_date' => 'nullable|string',
            'cost' => 'required|string',
            'status' => 'required|string|in:active,inactive',
            'package_id' => 'required|exists:packages,id',
        ]);
        if (!$request->has('renewal_terms')) {
            $request->merge(['renewal_terms' => 'na']);
        }
        $license = License::create($request->all());
        return back()->withErrors(['data' => json_encode($license)]);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'license_key' => 'required|string|unique:licenses,license_key,' . $id,
            'license_type' => 'required|string|in:per-user,per-machine',
            'max_count' => 'required|integer|min:1',
            'expiration_date' => 'nullable|string',
            'cost' => 'required|string',
            'status' => 'required|string|in:active,inactive',
            'package_id' => 'required|exists:packages,id',
        ]);
        
        $license = License::find($id);
        if (!$license) {
            Log::error('License not found for update', ['id' => $id]);
            return back()->withErrors(['error' => 'License not found']);
        }
        
        if (!$request->has('renewal_terms')) {
            $request->merge(['renewal_terms' => 'na']);
        }
        
        $license->update($request->all());
        
        return back()->withErrors(['data' => json_encode($license)]);
    }

    public function destroy($id)
    {
        $license = License::find($id);
        if (!$license) {
            return back()->withErrors(['error' => 'License not found']);
        }
        $license->delete();
        return redirect()->back();
    }

    public function getPackages()
    {
        $packages = Package::select('id', 'package_name', 'version')->get();
        return response()->json($packages);
    }
}