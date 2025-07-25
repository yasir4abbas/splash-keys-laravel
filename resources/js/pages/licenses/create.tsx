import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { router } from '@inertiajs/react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RefreshCw, ArrowLeft } from 'lucide-react';

interface LicenseFormData {
    license_key: string;
    license_type: string;
    max_count: number;
    expiration_date: string;
    cost: string;
    renewal_terms: string;
    status: string;
    package_id: string;
}

interface CreateLicensePageProps {
    license?: any;
    packages: any[];
}

export default function CreateLicense({ license, packages }: CreateLicensePageProps) {
    const { auth } = usePage<SharedData>().props;
    const isEditing = !!license;
    const [hasExpiration, setHasExpiration] = useState(true);
    
    const { data, setData, post, patch, processing, errors, reset } = useForm({
        license_key: '',
        license_type: 'per-machine',
        max_count: 1,
        expiration_date: '',
        cost: '0',
        renewal_terms: '',
        status: 'active',
        package_id: '',
    });

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Licenses',
            href: '/licenses'
        },
        {
            title: isEditing ? 'Edit License' : 'Create License',
            href: isEditing ? `/licenses/create/${license.id}` : '/licenses/create'
        }
    ];

    function generateKey() {
        const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let key = '';
        for (let i = 0; i < 20; i++) {
            key += charset.charAt(Math.floor(Math.random() * charset.length));
        }
        setData('license_key', key);
    }

    useEffect(() => {
        if (license) {
            setData({
                license_key: license.license_key || '',
                license_type: license.license_type || 'per-user',
                max_count: license.max_count || 1,
                expiration_date: license.expiration_date || '',
                cost: license.cost || '',
                renewal_terms: license.renewal_terms || '',
                status: license.status || 'active',
                package_id: license.package_id?.toString() || '',
            });
            // Set expiration checkbox based on whether license has expiration date
            setHasExpiration(!!license.expiration_date);
        }
    }, [license]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Handle expiration date based on checkbox
        if (!hasExpiration) {
            setData('expiration_date', '');
        }
        
        if (isEditing) {
            patch(route('licenses.update', { id: license.id }), {
                onSuccess: () => {
                    router.visit(route('licenses'));
                },
                onError: (errors: any) => {
                    if (errors.data) {
                        try {
                            const licenseData = JSON.parse(errors.data);
                            router.visit(route('licenses'));
                        } catch (e) {
                            console.error('Error parsing response:', e);
                        }
                    }
                },
            });
        } else {
            post(route('licenses.store'), {
                onSuccess: () => {
                    router.visit(route('licenses'));
                },
                onError: (errors: any) => {
                    if (errors.data) {
                        try {
                            const licenseData = JSON.parse(errors.data);
                            router.visit(route('licenses'));
                        } catch (e) {
                            console.error('Error parsing response:', e);
                        }
                    }
                },
            });
        }
    };

    const handleCancel = () => {
        router.visit(route('licenses'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={isEditing ? 'Edit License' : 'Create License'} />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between space-y-2">
                <div className="flex items-center gap-4">
                        <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={handleCancel}
                            className="flex items-center gap-2"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Licenses
                        </Button>
                    </div>
                </div>
                <div className="">
                    <div className="max-w-2xl mx-auto mb-4">
                        <div className="flex gap-4 grid">
                            <h1 className="text-2xl font-bold">
                                {isEditing ? 'Edit License' : 'Create New License'}
                            </h1>
                        </div>
                    </div>

                    <div className="max-w-2xl mx-auto">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="border rounded-lg p-4">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="license_key">
                                            License Key
                                        </Label>
                                        <div className="flex gap-2">
                                            <Input
                                                id="license_key"
                                                value={data.license_key}
                                                onChange={(e) => setData('license_key', e.target.value)}
                                                placeholder="Enter license key"
                                            />
                                            <Button type="button" variant="outline" onClick={generateKey} title="Generate Key">
                                                <RefreshCw className="w-4 h-4" />
                                            </Button>
                                        </div>
                                        {errors.license_key && <InputError message={errors.license_key} />}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="license_type">
                                            Type
                                        </Label>
                                        <Select value={data.license_type} onValueChange={(value) => setData('license_type', value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select license type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="per-machine">Per Machine</SelectItem>
                                                {/* <SelectItem value="per-user">Per User</SelectItem> */}
                                            </SelectContent>
                                        </Select>
                                        {errors.license_type && <InputError message={errors.license_type} />}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="max_count">
                                            Max Count
                                        </Label>
                                        <Input
                                            id="max_count"
                                            type="number"
                                            value={data.max_count}
                                            onChange={(e) => setData('max_count', parseInt(e.target.value))}
                                            placeholder="Enter max count"
                                        />
                                        {errors.max_count && <InputError message={errors.max_count} />}
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center space-x-2 mb-2">
                                            <Checkbox
                                                id="has_expiration"
                                                checked={hasExpiration}
                                                onCheckedChange={(checked) => {
                                                    setHasExpiration(checked as boolean);
                                                    if (!checked) {
                                                        setData('expiration_date', '');
                                                    }
                                                }}
                                            />
                                            <Label htmlFor="has_expiration" className="text-sm font-medium">
                                                Set expiration date
                                            </Label>
                                        </div>
                                        {hasExpiration && (
                                            <>
                                                <Label htmlFor="expiration_date">
                                                    Expiration Date
                                                </Label>
                                                <Input
                                                    id="expiration_date"
                                                    type="date"
                                                    value={data.expiration_date}
                                                    onChange={(e) => setData('expiration_date', e.target.value)}
                                                    placeholder="Select expiration date"
                                                />
                                                {errors.expiration_date && <InputError message={errors.expiration_date} />}
                                            </>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="cost">
                                            Cost
                                        </Label>
                                        <Input
                                            id="cost"
                                            value={data.cost}
                                            onChange={(e) => setData('cost', e.target.value)}
                                            placeholder="Enter cost"
                                        />
                                        {errors.cost && <InputError message={errors.cost} />}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="renewal_terms">
                                            Renewal Terms
                                        </Label>
                                        <Textarea
                                            id="renewal_terms"
                                            value={data.renewal_terms}
                                            onChange={(e) => setData('renewal_terms', e.target.value)}
                                            placeholder="Enter renewal terms"
                                        />
                                        {errors.renewal_terms && <InputError message={errors.renewal_terms} />}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="status">
                                            Status
                                        </Label>
                                        <Select value={data.status} onValueChange={(value) => setData('status', value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="active">Active</SelectItem>
                                                <SelectItem value="inactive">Inactive</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.status && <InputError message={errors.status} />}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="package_id">
                                            Package
                                        </Label>
                                        <Select value={data.package_id} onValueChange={(value) => setData('package_id', value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select package" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {packages.map((pkg) => (
                                                    <SelectItem key={pkg.id} value={pkg.id.toString()}>
                                                        {pkg.package_name} v{pkg.version}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.package_id && <InputError message={errors.package_id} />}
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <Button type="submit" disabled={processing}>
                                    {processing 
                                        ? (isEditing ? 'Updating...' : 'Creating...') 
                                        : (isEditing ? 'Update License' : 'Create License')
                                    }
                                </Button>
                                <Button type="button" variant="outline" onClick={handleCancel}>
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
