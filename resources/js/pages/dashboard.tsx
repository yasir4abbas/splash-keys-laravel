import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { StatsCard } from '@/components/dashboard/stats-card';
import { 
    Key, 
    Monitor, 
    Package, 
    Users, 
    CheckCircle, 
    XCircle,
    Link,
    Unlink
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

interface DashboardProps {
    stats: {
        total_licenses: number;
        total_machines: number;
        total_packages: number;
        total_clients: number;
        active_licenses: number;
        inactive_licenses: number;
        bound_licenses: number;
        unbound_licenses: number;
    };
}

export default function Dashboard({ stats }: DashboardProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className="grid auto-rows-min gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                    <StatsCard
                        title="Total Licenses"
                        value={stats.total_licenses}
                        icon={Key}
                        description="All licenses in the system"
                        className='bg-muted'
                    />
                    <StatsCard
                        title="Total Machines"
                        value={stats.total_machines}
                        icon={Monitor}
                        className='bg-muted'
                        description="Registered machines"
                    />
                    <StatsCard
                        title="Total Packages"
                        value={stats.total_packages}
                        icon={Package}
                        className='bg-muted'
                        description="Software packages"
                    />
                    <StatsCard
                        title="Total Clients"
                        value={stats.total_clients}
                        icon={Users}
                        description="Active clients"
                        className='bg-muted'
                    />
                    <StatsCard
                        title="Active Licenses"
                        value={stats.active_licenses}
                        icon={CheckCircle}
                        description="Currently active licenses"
                        className='bg-muted'
                    />
                    <StatsCard
                        title="Inactive Licenses"
                        value={stats.inactive_licenses}
                        icon={XCircle}
                        description="Currently inactive licenses"
                        className='bg-muted'
                    />
                    <StatsCard
                        title="Bound Licenses"
                        value={stats.bound_licenses}
                        icon={Link}
                        description="Licenses with machines"
                        className='bg-muted'
                    />
                    <StatsCard
                        title="Unbound Licenses"
                        value={stats.unbound_licenses}
                        icon={Unlink}
                        description="Licenses without machines"
                        className='bg-muted'
                    />
                </div>
                
                <div className="relative min-h-[400px] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                    <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                </div>
            </div>
        </AppLayout>
    );
}
