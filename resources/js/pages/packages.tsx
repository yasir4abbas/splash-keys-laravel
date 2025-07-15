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
import { packageColumns } from '@/data/package-columns';
import { DataTable } from '@/components/table/data-table';

const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Packages',
      href: '/packages'
    }
];

interface PackageState {
  Packages: any[];
  isEditDialogOpen: boolean;
  selectedPackage: any | null;
  isLoading: boolean;
  error: string | null;
}

type PackageAction = 
  | { type: 'SET_PACKAGES'; payload: any[] }
  | { type: 'SET_EDIT_DIALOG_OPEN'; payload: boolean }
  | { type: 'SET_SELECTED_PACKAGE'; payload: any | null }
  | { type: 'ADD_PACKAGE'; payload: any }
  | { type: 'UPDATE_PACKAGE'; payload: any }
  | { type: 'DELETE_PACKAGE'; payload: number }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

// Initial state
const initialState: PackageState = {
  Packages: [],
  isEditDialogOpen: false,
  selectedPackage: null,
  isLoading: false,
  error: null,
};

// Reducer function
function packageReducer(state: PackageState, action: PackageAction): PackageState {
  switch (action.type) {
    case 'SET_PACKAGES':
      return { ...state, Packages: action.payload };
    case 'SET_EDIT_DIALOG_OPEN':
      return { ...state, isEditDialogOpen: action.payload };
    case 'SET_SELECTED_PACKAGE':
      return { ...state, selectedPackage: action.payload };
    case 'ADD_PACKAGE':
      return { ...state, Packages: [...state.Packages, action.payload] };
    case 'UPDATE_PACKAGE':
      return {
        ...state,
        Packages: state.Packages.map(packageItem => 
          packageItem.id === action.payload.id ? action.payload : packageItem
        )
      };
    case 'DELETE_PACKAGE':
      return {
        ...state,
        Packages: state.Packages.filter(packageItem => packageItem.id !== action.payload)
      };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
}

export default function Packages() {
  const { auth } = usePage<SharedData>().props;
  const [state, dispatch] = useReducer(packageReducer, initialState);

  useEffect(() => {
          dispatch({ type: 'SET_LOADING', payload: true });
          
          fetch(route('packages.list'), {
            headers: {
              'Accept': 'application/json',
            }
          })
          .then(response => response.json())
          .then(data => {
              dispatch({ type: 'SET_PACKAGES', payload: data });
              dispatch({ type: 'SET_LOADING', payload: false });
          })
          .catch(error => {
              dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch Packages' });
              console.error('Error fetching Packages:', error);
          });
  }, []);

  const onDelete = (packageItem: any) => {
      if (window.confirm(`Are you sure you want to delete package "${packageItem.package_name}"?`)) {
        router.delete(route('packages.destroy', {id: packageItem.id} ), {
          onSuccess: () => {
              dispatch({ type: 'DELETE_PACKAGE', payload: packageItem.id });
          }
      });
      }
  }

  const onEdit = (packageItem: any) => {
      dispatch({ type: 'SET_SELECTED_PACKAGE', payload: packageItem });
      dispatch({ type: 'SET_EDIT_DIALOG_OPEN', payload: true });
  }

  const handleAddSuccess = (newPackage: any) => {
      dispatch({ type: 'ADD_PACKAGE', payload: newPackage });
  };

  const handleEditSuccess = (updatedPackage: any) => {
      dispatch({ type: 'UPDATE_PACKAGE', payload: updatedPackage });
  };

  const handleEditDialogChange = (open: boolean) => {
      dispatch({ type: 'SET_EDIT_DIALOG_OPEN', payload: open });
  };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Packages" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between space-y-2">
                        <h1 className="text-2xl font-bold mb-4">Packages</h1>
                        <PackageAddDialog 
                            onSuccess={handleAddSuccess} 
                        />
                        <PackageEditDialog
                            open={state.isEditDialogOpen} 
                            onOpenChange={handleEditDialogChange}
                            package={state.selectedPackage}
                            onSuccess={handleEditSuccess}
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
                      data={state.Packages} 
                      columns={packageColumns} 
                      onDelete={onDelete} 
                      onEdit={onEdit}   
                    />
                  )}
                </div>
            </div>
        </AppLayout>
    );
}

export function PackageAddDialog({ onSuccess }: { onSuccess?: (newPackage: any) => void }) {
    const [ isCollapsed, setIsCollapsed] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        package_name: '',
        version: '',
        description: '',
        support_contact: '',
    });

    const handleOpenChange = (newOpen: boolean) => {
        if (!newOpen) {
            reset();
        }
        setIsCollapsed(newOpen);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('packages.store'), {
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
          <Button variant={'outline'} className=''><PlusIcon className="mr-2 h-4 w-4" /> Create new Package</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Add Package</DialogTitle>
              <DialogDescription>
                Add a new package
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="package_name">
                  Package Name
                </Label>
                <Input
                  value={data.package_name}
                  onChange={(e) => {
                    setData('package_name', e.target.value)
                  }}
                  placeholder="Enter package name"
                  required
                />
                {errors.package_name && <InputError message={errors.package_name} />}
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="version">
                  Version
                </Label>
                <Input
                  value={data.version}
                  onChange={(e) => {
                    setData('version', e.target.value)
                  }}
                  placeholder="Enter version (e.g., 1.0.0)"
                  required
                />
                {errors.version && <InputError message={errors.version} />}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">
                  Description
                </Label>
                <Textarea
                  value={data.description}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                    setData('description', e.target.value)
                  }}
                  placeholder="Enter package description"
                  required
                />
                {errors.description && <InputError message={errors.description} />}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="support_contact">
                  Support Contact
                </Label>
                <Input
                  value={data.support_contact}
                  onChange={(e) => {
                    setData('support_contact', e.target.value)
                  }}
                  placeholder="Enter support contact"
                  required
                />
                {errors.support_contact && <InputError message={errors.support_contact} />}
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

export function PackageEditDialog({ open, onOpenChange, package: packageItem, onSuccess }: { open: boolean, onOpenChange: (open: boolean) => void, package: any, onSuccess?: (updatedPackage: any) => void }) {
  const { data, setData, patch, processing, errors, reset } = useForm({
      package_name: packageItem?.package_name || '',
      version: packageItem?.version || '',
      description: packageItem?.description || '',
      support_contact: packageItem?.support_contact || '',
  });

  const handleOpenChange = (newOpen: boolean) => {
      if (!newOpen) {
          reset();
      }
      onOpenChange(newOpen);
  };

  // Update form data when package changes
  useEffect(() => {
      if (packageItem) {
          setData('package_name', packageItem.package_name || '');
          setData('version', packageItem.version || '');
          setData('description', packageItem.description || '');
          setData('support_contact', packageItem.support_contact || '');
      }
  }, [packageItem]);

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      patch(route('packages.update', packageItem?.id), {
          preserveScroll: true,
          onSuccess: (response) => {
              if (onSuccess) {
                  onSuccess({ ...packageItem, ...data });
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
                      <DialogTitle>Edit Package</DialogTitle>
                      <DialogDescription>
                          Update the package details
                      </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="package_name">
                        Package Name
                      </Label>
                      <Input
                        value={data.package_name}
                        onChange={(e) => {
                          setData('package_name', e.target.value)
                        }}
                        placeholder="Enter package name"
                        required
                      />
                      {errors.package_name && <InputError message={errors.package_name} />}
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="version">
                        Version
                      </Label>
                      <Input
                        value={data.version}
                        onChange={(e) => {
                          setData('version', e.target.value)
                        }}
                        placeholder="Enter version (e.g., 1.0.0)"
                        required
                      />
                      {errors.version && <InputError message={errors.version} />}
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="description">
                        Description
                      </Label>
                      <Textarea
                        value={data.description}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                          setData('description', e.target.value)
                        }}
                        placeholder="Enter package description"
                        required
                      />
                      {errors.description && <InputError message={errors.description} />}
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="support_contact">
                        Support Contact
                      </Label>
                      <Input
                        value={data.support_contact}
                        onChange={(e) => {
                          setData('support_contact', e.target.value)
                        }}
                        placeholder="Enter support contact"
                        required
                      />
                      {errors.support_contact && <InputError message={errors.support_contact} />}
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