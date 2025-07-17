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
use App\Models\Package;

class PackageController extends Controller 
{
    public function index()
    {
        return Inertia::render('packages');
    }

    public function edit($id)
    {
        $package = Package::with('meta')->find($id);
        return Inertia::render('packages/create', [
            'package' => $package
        ]);
    }

    public function create()
    {
        return Inertia::render('packages/create');
    }

    public function list()
    {
        $packages = Package::with('meta')->get();
        return response()->json($packages);
    }

    public function store(Request $request)
    {
        $request->validate([
            'package_name' => 'required|string|max:255',
            'version' => 'required|string|max:255',
            'description' => 'required|string|max:255',
            'support_contact' => 'required|string|max:255',
            'metadata' => 'array',
            'metadata.*.key' => 'string|max:255',
            'metadata.*.value' => 'string|max:255',
        ]);
        
        $package = Package::create($request->except('metadata'));
        if ($request->has('metadata')) {
            foreach ($request->metadata as $meta) {
                if (!empty($meta['key']) && !empty($meta['value'])) {
                    $package->setMeta($meta['key'], $meta['value']);
                }
            }
        }
        
        return back()->withErrors(['data' => json_encode($package)]);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'package_name' => 'required|string|max:255',
            'version' => 'required|string|max:255',
            'description' => 'required|string|max:255',
            'support_contact' => 'required|string|max:255',
            'metadata' => 'array',
            'metadata.*.key' => 'string|max:255',
            'metadata.*.value' => 'string|max:255',
        ]);
        
        $package = Package::find($id);
        $package->update($request->except('metadata'));
        
        // Clear existing metadata and add new ones
        $package->meta()->delete();
        
        // Handle metadata
        if ($request->has('metadata')) {
            foreach ($request->metadata as $meta) {
                if (!empty($meta['key']) && !empty($meta['value'])) {
                    $package->setMeta($meta['key'], $meta['value']);
                }
            }
        }
        
        return back()->withErrors(['data' => json_encode($package)]);
    }

    public function destroy($id)
    {
        $package = Package::find($id);
        $package->delete();
        return back()->withErrors(['data' => 'Package deleted successfully']);
    }
}