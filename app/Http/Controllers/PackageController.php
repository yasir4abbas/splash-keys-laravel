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

    public function list()
    {
        $packages = Package::all();
        return response()->json($packages);
    }

    public function store(Request $request)
    {
        $request->validate([
            'package_name' => 'required|string|max:255',
            'version' => 'required|string|max:255',
            'description' => 'required|string|max:255',
            'support_contact' => 'required|string|max:255',
        ]);
        $package = Package::create($request->all());
        return back()->withErrors(['data' => json_encode($package)]);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'package_name' => 'required|string|max:255',
            'version' => 'required|string|max:255',
            'description' => 'required|string|max:255',
            'support_contact' => 'required|string|max:255',
        ]);
        $package = Package::find($id);
        $package->update($request->all());
        return back()->withErrors(['data' => json_encode($package)]);
    }

    public function destroy($id)
    {
        $package = Package::find($id);
        $package->delete();
        return back()->withErrors(['data' => 'Package deleted successfully']);
    }
}