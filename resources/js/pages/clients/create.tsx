import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { router } from '@inertiajs/react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/date-picker';
import { ArrowLeft, X } from 'lucide-react';

interface ClientFormData {
    name: string;
    email: string;
    position: string;
    start_date: string;
    access_level: string;
    hostnames: string[];
}

interface CreateClientPageProps {
    client?: any;
}

export default function CreateClient({ client }: CreateClientPageProps) {
    const { auth } = usePage<SharedData>().props;
    const isEditing = !!client;
    
    const { data, setData, post, patch, processing, errors, reset } = useForm({
        name: '',
        email: '',
        position: '',
        start_date: '',
        access_level: 'basic',
        hostnames: [],
    });

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Clients',
            href: '/clients'
        },
        {
            title: isEditing ? 'Edit Client' : 'Create Client',
            href: isEditing ? `/clients/create/${client.id}` : '/clients/create'
        }
    ];

    // Load client data when editing
    useEffect(() => {
        if (client) {
            setData({
                name: client.name || '',
                email: client.email || '',
                position: client.position || '',
                start_date: client.start_date || '',
                access_level: client.access_level || 'basic',
                hostnames: client.hostnames || [],
            });
        }
    }, [client]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (isEditing) {
            patch(route('clients.update', { id: client.id }), {
                onSuccess: () => {
                    router.visit(route('clients'));
                },
                onError: (errors: any) => {
                    if (errors.data) {
                        try {
                            const clientData = JSON.parse(errors.data);
                            router.visit(route('clients'));
                        } catch (e) {
                            console.error('Error parsing response:', e);
                        }
                    }
                },
            });
        } else {
            post(route('clients.store'), {
                onSuccess: () => {
                    router.visit(route('clients'));
                },
                onError: (errors: any) => {
                    if (errors.data) {
                        try {
                            const clientData = JSON.parse(errors.data);
                            router.visit(route('clients'));
                        } catch (e) {
                            console.error('Error parsing response:', e);
                        }
                    }
                },
            });
        }
    };

    const handleCancel = () => {
        router.visit(route('clients'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={isEditing ? 'Edit Client' : 'Create Client'} />
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
                            Back to Clients
                        </Button>
                    </div>
                </div>
                <div className="">
                    <div className="max-w-2xl mx-auto mb-4">
                        <div className="flex gap-4 grid">
                            <h1 className="text-2xl font-bold">
                                {isEditing ? 'Edit Client' : 'Create New Client'}
                            </h1>
                        </div>
                    </div>

                    <div className="max-w-2xl mx-auto">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="border border-gray-200 rounded-lg p-4">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">
                                            Name
                                        </Label>
                                        <Input
                                            id="name"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            placeholder="Enter client name"
                                            required
                                        />
                                        {errors.name && <InputError message={errors.name} />}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email">
                                            Email
                                        </Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            placeholder="Enter email address"
                                            required
                                        />
                                        {errors.email && <InputError message={errors.email} />}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="position">
                                            Position
                                        </Label>
                                        <Input
                                            id="position"
                                            value={data.position}
                                            onChange={(e) => setData('position', e.target.value)}
                                            placeholder="Enter position"
                                            required
                                        />
                                        {errors.position && <InputError message={errors.position} />}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="start_date">
                                            Start Date
                                        </Label>
                                        <DatePicker
                                            value={data.start_date ? new Date(data.start_date) : undefined}
                                            onChange={(date) => {
                                                setData('start_date', date ? date.toISOString().split('T')[0] : '')
                                            }}
                                            placeholder="Select start date"
                                        />
                                        {errors.start_date && <InputError message={errors.start_date} />}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="access_level">
                                            Access Level
                                        </Label>
                                        <Select value={data.access_level} onValueChange={(value) => setData('access_level', value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select access level" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="basic">Basic</SelectItem>
                                                <SelectItem value="standard">Standard</SelectItem>
                                                <SelectItem value="premium">Premium</SelectItem>
                                                <SelectItem value="admin">Admin</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.access_level && <InputError message={errors.access_level} />}
                                    </div>
                                </div>
                            </div>

                            <div className="border border-gray-200 rounded-lg p-4">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="hostnames">
                                            Hostnames
                                        </Label>
                                        <div className="space-y-3">
                                            <div className="flex flex-wrap gap-2">
                                                {data.hostnames.map((hostname, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm"
                                                    >
                                                        <span>{hostname}</span>
                                                        <button
                                                            type="button"
                                                                                                                    onClick={() => {
                                                            const newHostnames = (data.hostnames as string[]).filter((_, i) => i !== index);
                                                            setData('hostnames', newHostnames);
                                                        }}
                                                            className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
                                                        >
                                                            <X className="h-3 w-3" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="flex gap-2">
                                                <Input
                                                    id="hostname-input"
                                                    placeholder="Enter hostname and press Enter"
                                                                                                onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    const input = e.target as HTMLInputElement;
                                                    const hostname = input.value.trim();
                                                    if (hostname && !(data.hostnames as string[]).includes(hostname)) {
                                                        setData('hostnames', [...(data.hostnames as string[]), hostname]);
                                                        input.value = '';
                                                    }
                                                }
                                            }}
                                                                                                onBlur={(e) => {
                                                const hostname = e.target.value.trim();
                                                if (hostname && !(data.hostnames as string[]).includes(hostname)) {
                                                    setData('hostnames', [...(data.hostnames as string[]), hostname]);
                                                    e.target.value = '';
                                                }
                                            }}
                                                />
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={() => {
                                                        const input = document.getElementById('hostname-input') as HTMLInputElement;
                                                        const hostname = input.value.trim();
                                                        if (hostname && !data.hostnames.includes(hostname)) {
                                                            setData('hostnames', [...data.hostnames, hostname]);
                                                            input.value = '';
                                                        }
                                                    }}
                                                >
                                                    Add
                                                </Button>
                                            </div>
                                        </div>
                                        {errors.hostnames && <InputError message={errors.hostnames} />}
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <Button type="submit" disabled={processing}>
                                    {processing 
                                        ? (isEditing ? 'Updating...' : 'Creating...') 
                                        : (isEditing ? 'Update Client' : 'Create Client')
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
