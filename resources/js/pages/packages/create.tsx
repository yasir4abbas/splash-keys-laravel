import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { router } from '@inertiajs/react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Plus, Minus } from 'lucide-react';

interface MetadataItem {
    key: string;
    value: string;
}

interface PackageFormData {
    package_name: string;
    version: string;
    description: string;
    support_contact: string;
    metadata: MetadataItem[];
}

interface CreatePackagePageProps {
    package?: any;
}

export default function CreatePackage({ package: packageItem }: CreatePackagePageProps) {
    const { auth } = usePage<SharedData>().props;
    const isEditing = !!packageItem;
    
    const { data, setData, post, patch, processing, errors, reset } = useForm({
        package_name: '',
        version: '',
        description: '',
        support_contact: '',
        metadata: [],
    });

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Packages',
            href: '/packages'
        },
        {
            title: isEditing ? 'Edit Package' : 'Create Package',
            href: isEditing ? `/packages/create/${packageItem.id}` : '/packages/create'
        }
    ];

    // Load package data when editing
    useEffect(() => {
        if (packageItem) {
            setData({
                package_name: packageItem.package_name || '',
                version: packageItem.version || '',
                description: packageItem.description || '',
                support_contact: packageItem.support_contact || '',
                metadata: packageItem.meta?.map((meta: any) => ({
                    key: meta.key || '',
                    value: meta.value || ''
                })) || [],
            });
        }
    }, [packageItem]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (isEditing) {
            patch(route('packages.update', { id: packageItem.id }), {
                onSuccess: () => {
                    router.visit(route('packages'));
                },
                onError: (errors: any) => {
                    if (errors.data) {
                        try {
                            const packageData = JSON.parse(errors.data);
                            router.visit(route('packages'));
                        } catch (e) {
                            console.error('Error parsing response:', e);
                        }
                    }
                },
            });
        } else {
            post(route('packages.store'), {
                onSuccess: () => {
                    router.visit(route('packages'));
                },
                onError: (errors: any) => {
                    if (errors.data) {
                        try {
                            const packageData = JSON.parse(errors.data);
                            router.visit(route('packages'));
                        } catch (e) {
                            console.error('Error parsing response:', e);
                        }
                    }
                },
            });
        }
    };

    const handleCancel = () => {
        router.visit(route('packages'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={isEditing ? 'Edit Package' : 'Create Package'} />
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
                            Back to Packages
                        </Button>
                    </div>
                </div>
                <div className="">
                    <div className="max-w-2xl mx-auto mb-4">
                        <div className="flex gap-4 grid">
                            <h1 className="text-2xl font-bold">
                                {isEditing ? 'Edit Package' : 'Create New Package'}
                            </h1>
                        </div>
                    </div>

                    <div className="max-w-2xl mx-auto">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="border border-gray-200 rounded-lg p-4">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="package_name">
                                            Package Name
                                        </Label>
                                        <Input
                                            id="package_name"
                                            value={data.package_name}
                                            onChange={(e) => setData('package_name', e.target.value)}
                                            placeholder="Enter package name"
                                            required
                                        />
                                        {errors.package_name && <InputError message={errors.package_name} />}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="version">
                                            Version
                                        </Label>
                                        <Input
                                            id="version"
                                            value={data.version}
                                            onChange={(e) => setData('version', e.target.value)}
                                            placeholder="Enter version (e.g., 1.0.0)"
                                            required
                                        />
                                        {errors.version && <InputError message={errors.version} />}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="description">
                                            Description
                                        </Label>
                                        <Textarea
                                            id="description"
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            placeholder="Enter package description"
                                            required
                                        />
                                        {errors.description && <InputError message={errors.description} />}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="support_contact">
                                            Support Contact
                                        </Label>
                                        <Input
                                            id="support_contact"
                                            value={data.support_contact}
                                            onChange={(e) => setData('support_contact', e.target.value)}
                                            placeholder="Enter support contact"
                                            required
                                        />
                                        {errors.support_contact && <InputError message={errors.support_contact} />}
                                    </div>
                                </div>
                            </div>

                            <div className="border border-gray-200 rounded-lg p-4">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-medium">Metadata</h3>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                const newMetadata = [...(data.metadata as MetadataItem[]), { key: '', value: '' }];
                                                setData('metadata', newMetadata);
                                            }}
                                            className="flex items-center gap-2"
                                        >
                                            <Plus className="h-4 w-4" />
                                            Add Metadata
                                        </Button>
                                    </div>
                                    
                                    {(data.metadata as MetadataItem[]).length === 0 ? (
                                        <div className="text-center py-4 text-gray-500">
                                            No metadata added yet. Click "Add Metadata" to add key-value pairs.
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {(data.metadata as MetadataItem[]).map((meta: MetadataItem, index: number) => (
                                                <div key={index} className="flex gap-2 items-start">
                                                    <div className="flex-1">
                                                        <Input
                                                            placeholder="Key"
                                                            value={meta.key}
                                                            onChange={(e) => {
                                                                const newMetadata = [...(data.metadata as MetadataItem[])];
                                                                newMetadata[index].key = e.target.value;
                                                                setData('metadata', newMetadata);
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="flex-1">
                                                        <Input
                                                            placeholder="Value"
                                                            value={meta.value}
                                                            onChange={(e) => {
                                                                const newMetadata = [...(data.metadata as MetadataItem[])];
                                                                newMetadata[index].value = e.target.value;
                                                                setData('metadata', newMetadata);
                                                            }}
                                                        />
                                                    </div>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => {
                                                            const newMetadata = (data.metadata as MetadataItem[]).filter((_: MetadataItem, i: number) => i !== index);
                                                            setData('metadata', newMetadata);
                                                        }}
                                                        className="flex items-center gap-2"
                                                    >
                                                        <Minus className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <Button type="submit" disabled={processing}>
                                    {processing 
                                        ? (isEditing ? 'Updating...' : 'Creating...') 
                                        : (isEditing ? 'Update Package' : 'Create Package')
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