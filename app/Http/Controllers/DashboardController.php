<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Client;
use App\Models\License;
use App\Models\Machine;
use App\Models\Package;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $stats = [
            'total_licenses' => License::count(),
            'total_machines' => Machine::count(),
            'total_packages' => Package::count(),
            'total_clients' => Client::count(),
            'active_licenses' => License::where('status', 'active')->count(),
            'inactive_licenses' => License::where('status', 'inactive')->count(),
            'bound_licenses' => License::whereHas('machines')->count(),
            'unbound_licenses' => License::whereDoesntHave('machines')->count(),
        ];

        return Inertia::render('dashboard', [
            'stats' => $stats
        ]);
    }
} 