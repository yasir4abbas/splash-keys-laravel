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
// import { Textarea } from '@/components/ui/textarea';
import { router } from '@inertiajs/react';
import { PlusIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { clientColumns } from '@/data/client-columns';
import { DataTable } from '@/components/table/data-table';

const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Clients',
      href: '/clients'
    }
];

interface ClientState {
  Clients: any[];
  isEditDialogOpen: boolean;
  selectedClient: any | null;
  isLoading: boolean;
  error: string | null;
}

type ClientAction = 
  | { type: 'SET_CLIENTS'; payload: any[] }
  | { type: 'SET_EDIT_DIALOG_OPEN'; payload: boolean }
  | { type: 'SET_SELECTED_CLIENT'; payload: any | null }
  | { type: 'ADD_CLIENT'; payload: any }
  | { type: 'UPDATE_CLIENT'; payload: any }
  | { type: 'DELETE_CLIENT'; payload: number }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

// Initial state
const initialState: ClientState = {
  Clients: [],
  isEditDialogOpen: false,
  selectedClient: null,
  isLoading: false,
  error: null,
};

// Reducer function
function clientReducer(state: ClientState, action: ClientAction): ClientState {
  switch (action.type) {
    case 'SET_CLIENTS':
      return { ...state, Clients: action.payload };
    case 'SET_EDIT_DIALOG_OPEN':
      return { ...state, isEditDialogOpen: action.payload };
    case 'SET_SELECTED_CLIENT':
      return { ...state, selectedClient: action.payload };
    case 'ADD_CLIENT':
      return { ...state, Clients: [...state.Clients, action.payload] };
    case 'UPDATE_CLIENT':
      return {
        ...state,
        Clients: state.Clients.map(client => 
          client.id === action.payload.id ? action.payload : client
        )
      };
    case 'DELETE_CLIENT':
      return {
        ...state,
        Clients: state.Clients.filter(client => client.id !== action.payload)
      };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
}

export default function Clients() {
  const { auth } = usePage<SharedData>().props;
  const [state, dispatch] = useReducer(clientReducer, initialState);

  useEffect(() => {
          dispatch({ type: 'SET_LOADING', payload: true });
          
          fetch(route('clients.list'), {
            headers: {
              'Accept': 'application/json',
            }
          })
          .then(response => response.json())
          .then(data => {
              dispatch({ type: 'SET_CLIENTS', payload: data });
              dispatch({ type: 'SET_LOADING', payload: false });
          })
          .catch(error => {
              dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch Clients' });
              console.error('Error fetching Clients:', error);
          });
  }, []);

  const onDelete = (client: any) => {
      if (window.confirm(`Are you sure you want to delete client "${client.name}"?`)) {
        router.delete(route('clients.destroy', {id: client.id} ), {
          onSuccess: () => {
              dispatch({ type: 'DELETE_CLIENT', payload: client.id });
          }
      });
      }
  }

  const onEdit = (client: any) => {
      console.log('onEdit called with:', client);
      console.log('Route:', route('clients.edit', {id: client.id}));
      dispatch({ type: 'SET_SELECTED_CLIENT', payload: client });
      router.visit(route('clients.edit', {id: client.id}));
  }

  const handleAddSuccess = (newClient: any) => {
      dispatch({ type: 'ADD_CLIENT', payload: newClient });
  };

  const handleEditSuccess = (updatedClient: any) => {
      dispatch({ type: 'UPDATE_CLIENT', payload: updatedClient });
  };

  const handleEditDialogChange = (open: boolean) => {
      dispatch({ type: 'SET_EDIT_DIALOG_OPEN', payload: open });
  };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Clients" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between space-y-2">
                        <h1 className="text-2xl font-bold mb-4">Clients</h1>
                        <Button>
                            <Link href={route('clients.create')}>
                                Add Client
                            </Link>
                        </Button>
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
                      data={state.Clients} 
                      columns={clientColumns} 
                      onDelete={onDelete} 
                      onEdit={onEdit}   
                    />
                  )}
                </div>
            </div>
        </AppLayout>
    );
}

export function ClientAddDialog({ onSuccess }: { onSuccess?: (newClient: any) => void }) {
    const [ isCollapsed, setIsCollapsed] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        position: '',
        start_date: '',
        access_level: 'basic',
    });

    const handleOpenChange = (newOpen: boolean) => {
        if (!newOpen) {
            reset();
        }
        setIsCollapsed(newOpen);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('clients.store'), {
            preserveScroll: true,
            onError: (errors: any) => {
              if (errors.data) {
                if (onSuccess) {
                    onSuccess(JSON.parse(errors.data));
                }
                handleOpenChange(false);
              }
            },
            onSuccess: (response: any) => {
              if (onSuccess) {
                  onSuccess(response.data);
              }
              handleOpenChange(false);
            },
        });
    };

    return (
      <Dialog open={isCollapsed} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <Button variant={'outline'} className=''><PlusIcon className="mr-2 h-4 w-4" /> Create new Client</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Add Client</DialogTitle>
              <DialogDescription>
                Add a new client
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">
                  Name
                </Label>
                <Input
                  value={data.name}
                  onChange={(e) => {
                    setData('name', e.target.value)
                  }}
                  required
                />
                {errors.name && <InputError message={errors.name} />}
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="email">
                  Email
                </Label>
                <Input
                  type="email"
                  value={data.email}
                  onChange={(e) => {
                    setData('email', e.target.value)
                  }}
                  required
                />
                {errors.email && <InputError message={errors.email} />}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="position">
                  Position
                </Label>
                <Input
                  value={data.position}
                  onChange={(e) => {
                    setData('position', e.target.value)
                  }}
                />
                {errors.position && <InputError message={errors.position} />}
              </div>

              <div className="grid gap-2">
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

              <div className="grid gap-2">
                <Label htmlFor="access_level">
                  Access Level
                </Label>
                <Select
                  value={data.access_level}
                  onValueChange={value => {
                    setData('access_level', value)
                  }}
                  required 
                >
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

export function ClientEditDialog({ open, onOpenChange, client, onSuccess }: { open: boolean, onOpenChange: (open: boolean) => void, client: any, onSuccess?: (updatedClient: any) => void }) {
  const { data, setData, patch, processing, errors, reset } = useForm({
      name: client?.name || '',
      email: client?.email || '',
      position: client?.position || '',
      start_date: client?.start_date || '',
      access_level: client?.access_level || 'basic',
  });

  const handleOpenChange = (newOpen: boolean) => {
      if (!newOpen) {
          reset();
      }
      onOpenChange(newOpen);
  };

  // Update form data when client changes
  useEffect(() => {
      if (client) {
          setData('name', client.name || '');
          setData('email', client.email || '');
          setData('position', client.position || '');
          setData('start_date', client.start_date || '');
          setData('access_level', client.access_level || 'basic');
      }
  }, [client]);

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      patch(route('clients.update', client?.id), {
          preserveScroll: true,
          onSuccess: (response) => {
              if (onSuccess) {
                  onSuccess({ ...client, ...data });
              }
              handleOpenChange(false);
          },
          onError: (errors: any) => {
            if (errors.data) {
              if (onSuccess) {
                  onSuccess(JSON.parse(errors.data));
              }
              handleOpenChange(false);
            }
          }
      });
  };

  return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
          <DialogContent className="sm:max-w-[425px]">
              <form onSubmit={handleSubmit}>
                  <DialogHeader>
                      <DialogTitle>Edit Client</DialogTitle>
                      <DialogDescription>
                          Update the client details
                      </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">
                        Name
                      </Label>
                      <Input
                        value={data.name}
                        onChange={(e) => {
                          setData('name', e.target.value)
                        }}
                        required
                      />
                      {errors.name && <InputError message={errors.name} />}
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="email">
                        Email
                      </Label>
                      <Input
                        type="email"
                        value={data.email}
                        onChange={(e) => {
                          setData('email', e.target.value)
                        }}
                        required
                      />
                      {errors.email && <InputError message={errors.email} />}
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="position">
                        Position
                      </Label>
                      <Input
                        value={data.position}
                        onChange={(e) => {
                          setData('position', e.target.value)
                        }}
                      />
                      {errors.position && <InputError message={errors.position} />}
                    </div>

                    <div className="grid gap-2">
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

                    <div className="grid gap-2">
                      <Label htmlFor="access_level">
                        Access Level
                      </Label>
                      <Select
                        value={data.access_level}
                        onValueChange={value => {
                          setData('access_level', value)
                        }}
                        required 
                      >
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