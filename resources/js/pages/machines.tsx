import { type BreadcrumbItem, type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useEffect, useReducer, useState } from 'react';

import DeleteUser from '@/components/delete-user';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { Dialog, DialogFooter, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/date-picker';
import { Textarea } from '@/components/ui/textarea';
import { router } from '@inertiajs/react';
import { PlusIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { createMachineColumns } from '@/data/machine-columns';
import { DataTable } from '@/components/table/data-table';

const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Machines',
      href: '/machines'
    }
];

interface MachineState {
  Machines: any[];
  Clients: any[];
  Licenses: any[];
  isEditDialogOpen: boolean;
  selectedMachine: any | null;
  isLoading: boolean;
  error: string | null;
}

type MachineAction = 
  | { type: 'SET_MACHINES'; payload: any[] }
  | { type: 'SET_CLIENTS'; payload: any[] }
  | { type: 'SET_LICENSES'; payload: any[] }
  | { type: 'SET_EDIT_DIALOG_OPEN'; payload: boolean }
  | { type: 'SET_SELECTED_MACHINE'; payload: any | null }
  | { type: 'ADD_MACHINE'; payload: any }
  | { type: 'UPDATE_MACHINE'; payload: any }
  | { type: 'DELETE_MACHINE'; payload: number }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

// Initial state
const initialState: MachineState = {
  Machines: [],
  Clients: [],
  Licenses: [],
  isEditDialogOpen: false,
  selectedMachine: null,
  isLoading: false,
  error: null,
};

// Reducer function
function machineReducer(state: MachineState, action: MachineAction): MachineState {
  switch (action.type) {
    case 'SET_MACHINES':
      return { ...state, Machines: action.payload };
    case 'SET_CLIENTS':
      return { ...state, Clients: action.payload };
    case 'SET_LICENSES':
      return { ...state, Licenses: action.payload };
    case 'SET_EDIT_DIALOG_OPEN':
      return { ...state, isEditDialogOpen: action.payload };
    case 'SET_SELECTED_MACHINE':
      return { ...state, selectedMachine: action.payload };
    case 'ADD_MACHINE':
      return { ...state, Machines: [...state.Machines, action.payload] };
    case 'UPDATE_MACHINE':
      return {
        ...state,
        Machines: state.Machines.map(machine => 
          machine.id === action.payload.id ? action.payload : machine
        )
      };
    case 'DELETE_MACHINE':
      return {
        ...state,
        Machines: state.Machines.filter(machine => machine.id !== action.payload)
      };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
}

export default function Machines() {
  const { auth } = usePage<SharedData>().props;
  const [state, dispatch] = useReducer(machineReducer, initialState);

  useEffect(() => {
          dispatch({ type: 'SET_LOADING', payload: true });
          
          // Fetch machines, clients, and licenses in parallel
          Promise.all([
            fetch(route('machines.list'), {
              headers: { 'Accept': 'application/json' }
            }),
            fetch(route('clients.list'), {
              headers: { 'Accept': 'application/json' }
            }),
            fetch(route('licenses.list'), {
              headers: { 'Accept': 'application/json' }
            })
          ])
          .then(responses => Promise.all(responses.map(r => r.json())))
          .then(([machines, clients, licenses]) => {
              dispatch({ type: 'SET_MACHINES', payload: machines });
              dispatch({ type: 'SET_CLIENTS', payload: clients });
              dispatch({ type: 'SET_LICENSES', payload: licenses });
              dispatch({ type: 'SET_LOADING', payload: false });
          })
          .catch(error => {
              dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch data' });
              console.error('Error fetching data:', error);
          });
  }, []);

  const onDelete = (machine: any) => {
      const displayName = machine.hostname || machine.machine_id;
      if (window.confirm(`Are you sure you want to delete machine "${displayName}"?`)) {
        router.delete(route('machines.destroy', {id: machine.id} ), {
          onSuccess: () => {
              dispatch({ type: 'DELETE_MACHINE', payload: machine.id });
          },
          onError: (errors) => {
              console.error('Delete failed:', errors);
          }
      });
      }
  }

  const onEdit = (machine: any) => {
      dispatch({ type: 'SET_SELECTED_MACHINE', payload: machine });
      dispatch({ type: 'SET_EDIT_DIALOG_OPEN', payload: true });
  }

  const handleAddSuccess = (newMachine: any) => {
      dispatch({ type: 'ADD_MACHINE', payload: newMachine });
  };

  const handleEditSuccess = (updatedMachine: any) => {
      dispatch({ type: 'UPDATE_MACHINE', payload: updatedMachine });
  };

  const handleEditDialogChange = (open: boolean) => {
      dispatch({ type: 'SET_EDIT_DIALOG_OPEN', payload: open });
  };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Machines" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between space-y-2">
                        <h1 className="text-2xl font-bold mb-4">Machines</h1>
                        <MachineAddDialog 
                            onSuccess={handleAddSuccess}
                            clients={state.Clients}
                            licenses={state.Licenses}
                        />
                        <MachineEditDialog
                            open={state.isEditDialogOpen} 
                            onOpenChange={handleEditDialogChange}
                            machine={state.selectedMachine}
                            onSuccess={handleEditSuccess}
                            clients={state.Clients}
                            licenses={state.Licenses}
                        />
                    </div>
                <div>
                  {state.isLoading ? (
                    <div className="flex items-center justify-center p-8">
                      <Skeleton className="h-8 w-8 rounded-full" />
                    </div>
                  ) : state.error ? (
                    <div className="flex items-center justify-center p-8">
                      <div className="text-red-500">{state.error}</div>
                    </div>
                  ) : (
                    <DataTable 
                      data={state.Machines} 
                      columns={createMachineColumns()} 
                      onDelete={onDelete} 
                      onEdit={onEdit}   
                    />
                  )}
                </div>
            </div>
        </AppLayout>
    );
}

export function MachineAddDialog({ onSuccess, clients, licenses }: { 
    onSuccess?: (newMachine: any) => void;
    clients: any[];
    licenses: any[];
}) {
    const [ isCollapsed, setIsCollapsed] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        hostname: '',
        fingerprint: '',
        status: 'active',
        client_id: '',
        license_id: '',
    });

    const handleOpenChange = (newOpen: boolean) => {
        if (!newOpen) {
            reset();
        }
        setIsCollapsed(newOpen);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('machines.store'), {
            preserveScroll: true,
            onError: (errors: any) => {
              if (errors.data) {
                if (onSuccess) {
                    onSuccess(JSON.parse(errors.data));
                }
                handleOpenChange(false);
              }
            },
            onSuccess: () => {
              // Handle success case if needed
              handleOpenChange(false);
            },
        });
    };

    return (
      <Dialog open={isCollapsed} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <Button variant={'outline'} className=''><PlusIcon className="mr-2 h-4 w-4" /> Create new Machine</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Add Machine</DialogTitle>
              <DialogDescription>
                Add a new machine
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="hostname">
                  Hostname
                </Label>
                <Input
                  value={data.hostname}
                  onChange={(e) => {
                    setData('hostname', e.target.value)
                  }}
                />
                {errors.hostname && <InputError message={errors.hostname} />}
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="fingerprint">
                  Fingerprint
                </Label>
                <Textarea
                  value={data.fingerprint}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                    setData('fingerprint', e.target.value)
                  }}
                  placeholder="Enter machine fingerprint"
                  required
                />
                {errors.fingerprint && <InputError message={errors.fingerprint} />}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="status">
                  Status
                </Label>
                <Select
                  value={data.status}
                  onValueChange={value => {
                    setData('status', value)
                  }}
                  required 
                >
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

              <div className="grid gap-2">
                <Label htmlFor="client_id">
                  Client
                </Label>
                <Select
                  value={data.client_id}
                  onValueChange={value => {
                    setData('client_id', value)
                  }}
                  required 
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select client" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id.toString()}>
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.client_id && <InputError message={errors.client_id} />}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="license_id">
                  License
                </Label>
                <Select
                  value={data.license_id}
                  onValueChange={value => {
                    setData('license_id', value)
                  }}
                  required 
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select license" />
                  </SelectTrigger>
                  <SelectContent>
                    {licenses.map((license) => (
                      <SelectItem key={license.id} value={license.id.toString()}>
                        {license.license_key}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.license_id && <InputError message={errors.license_id} />}
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={processing}>
                {processing ? 'Adding...' : 'Add'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    )
}

export function MachineEditDialog({ 
    open, 
    onOpenChange, 
    machine, 
    onSuccess, 
    clients, 
    licenses 
}: { 
    open: boolean; 
    onOpenChange: (open: boolean) => void; 
    machine: any; 
    onSuccess?: (updatedMachine: any) => void;
    clients: any[];
    licenses: any[];
}) {
  const { data, setData, patch, processing, errors, reset } = useForm({
      hostname: machine?.hostname || '',
      fingerprint: machine?.fingerprint || '',
      status: machine?.status || 'active',
      client_id: machine?.client_id ? machine.client_id.toString() : '',
      license_id: machine?.license_id ? machine.license_id.toString() : '',
  });

  const handleOpenChange = (newOpen: boolean) => {
      if (!newOpen) {
          reset();
      }
      onOpenChange(newOpen);
  };

  // Update form data when machine changes
  useEffect(() => {
      if (machine) {
          setData('hostname', machine.hostname || '');
          setData('fingerprint', machine.fingerprint || '');
          setData('status', machine.status || 'active');
          setData('client_id', machine.client_id ? machine.client_id.toString() : '');
          setData('license_id', machine.license_id ? machine.license_id.toString() : '');
      }
  }, [machine]);

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      patch(route('machines.update', machine?.id), {
          preserveScroll: true,
          onError: (errors: any) => {
            if (errors.data) {
              if (onSuccess) {
                  onSuccess(JSON.parse(errors.data));
              }
              handleOpenChange(false);
            }
          },
          onSuccess: () => {
              // Handle success case if needed
              handleOpenChange(false);
          }
      });
  };

  return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
          <DialogContent className="sm:max-w-[425px]">
              <form onSubmit={handleSubmit}>
                  <DialogHeader>
                      <DialogTitle>Edit Machine</DialogTitle>
                      <DialogDescription>
                          Update the machine details
                      </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="hostname">
                        Hostname
                      </Label>
                      <Input
                        value={data.hostname}
                        onChange={(e) => {
                          setData('hostname', e.target.value)
                        }}
                      />
                      {errors.hostname && <InputError message={errors.hostname} />}
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="fingerprint">
                        Fingerprint
                      </Label>
                      <Textarea
                        value={data.fingerprint}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                          setData('fingerprint', e.target.value)
                        }}
                        placeholder="Enter machine fingerprint"
                        required
                      />
                      {errors.fingerprint && <InputError message={errors.fingerprint} />}
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="status">
                        Status
                      </Label>
                      <Select
                        value={data.status}
                        onValueChange={value => {
                          setData('status', value)
                        }}
                        required 
                      >
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

                    <div className="grid gap-2">
                      <Label htmlFor="client_id">
                        Client
                      </Label>
                      <Select
                        value={data.client_id}
                        onValueChange={value => {
                          setData('client_id', value)
                        }}
                        required 
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select client" />
                        </SelectTrigger>
                        <SelectContent>
                          {clients.map((client) => (
                            <SelectItem key={client.id} value={client.id.toString()}>
                              {client.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.client_id && <InputError message={errors.client_id} />}
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="license_id">
                        License
                      </Label>
                      <Select
                        value={data.license_id}
                        onValueChange={value => {
                          setData('license_id', value)
                        }}
                        required 
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select license" />
                        </SelectTrigger>
                        <SelectContent>
                          {licenses.map((license) => (
                            <SelectItem key={license.id} value={license.id.toString()}>
                              {license.license_key}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.license_id && <InputError message={errors.license_id} />}
                    </div>
                  </div>
                  <DialogFooter>
                      <Button type="submit" disabled={processing}>
                          {processing ? 'Saving...' : 'Save'}
                      </Button>
                  </DialogFooter>
              </form>
          </DialogContent>
      </Dialog>
  );
}