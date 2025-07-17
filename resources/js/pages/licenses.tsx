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
import { PlusIcon, RefreshCw } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { licenseColumns } from '@/data/license-columns';
import { DataTable } from '@/components/table/data-table';

const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Licenses',
      href: '/licenses'
    }
];

interface LicenseState {
  Licenses: any[];
  Packages: any[];
  isEditDialogOpen: boolean;
  selectedLicense: any | null;
  isLoading: boolean;
  error: string | null;
}

type LicenseAction = 
  | { type: 'SET_LICENSES'; payload: any[] }
  | { type: 'SET_PACKAGES'; payload: any[] }
  | { type: 'SET_EDIT_DIALOG_OPEN'; payload: boolean }
  | { type: 'SET_SELECTED_LICENSE'; payload: any | null }
  | { type: 'ADD_LICENSE'; payload: any }
  | { type: 'UPDATE_LICENSE'; payload: any }
  | { type: 'DELETE_LICENSE'; payload: number }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

// Initial state
const initialState: LicenseState = {
  Licenses: [],
  Packages: [],
  isEditDialogOpen: false,
  selectedLicense: null,
  isLoading: false,
  error: null,
};

// Reducer function
function licenseReducer(state: LicenseState, action: LicenseAction): LicenseState {
  switch (action.type) {
    case 'SET_LICENSES':
      return { ...state, Licenses: action.payload };
    case 'SET_PACKAGES':
      return { ...state, Packages: action.payload };
    case 'SET_EDIT_DIALOG_OPEN':
      return { ...state, isEditDialogOpen: action.payload };
    case 'SET_SELECTED_LICENSE':
      return { ...state, selectedLicense: action.payload };
    case 'ADD_LICENSE':
      return { ...state, Licenses: [...state.Licenses, action.payload] };
    case 'UPDATE_LICENSE':
      return {
        ...state,
        Licenses: state.Licenses.map(license => 
          license.id === action.payload.id ? action.payload : license
        )
      };
    case 'DELETE_LICENSE':
      return {
        ...state,
        Licenses: state.Licenses.filter(license => license.id !== action.payload)
      };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
}

export default function Licenses() {
  const { auth } = usePage<SharedData>().props;
  const [state, dispatch] = useReducer(licenseReducer, initialState);

  useEffect(() => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    // Fetch licenses
    fetch(route('licenses.list'), {
      headers: {
        'Accept': 'application/json',
      }
    })
    .then(response => response.json())
    .then(data => {
        dispatch({ type: 'SET_LICENSES', payload: data });
    })
    .catch(error => {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch Licenses' });
        console.error('Error fetching Licenses:', error);
    });

    // Fetch packages for dropdown
    fetch(route('licenses.packages'), {
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
        console.error('Error fetching Packages:', error);
        dispatch({ type: 'SET_LOADING', payload: false });
    });
  }, []);

  const onDelete = (license: any) => {
      if (window.confirm(`Are you sure you want to delete license "${license.license_key}"?`)) {
        router.delete(route('licenses.destroy', {id: license.id} ), {
          onSuccess: () => {
              dispatch({ type: 'DELETE_LICENSE', payload: license.id });
          }
      });
      }
  }

  const onEdit = (license: any) => {
      dispatch({ type: 'SET_SELECTED_LICENSE', payload: license });
      router.visit(route('licenses.edit', {id: license.id}));
    //   dispatch({ type: 'SET_EDIT_DIALOG_OPEN', payload: true });
  }

  const handleAddSuccess = (newLicense: any) => {
      dispatch({ type: 'ADD_LICENSE', payload: newLicense });
  };

  const handleEditSuccess = (updatedLicense: any) => {
      dispatch({ type: 'UPDATE_LICENSE', payload: updatedLicense });
  };

  const handleEditDialogChange = (open: boolean) => {
      dispatch({ type: 'SET_EDIT_DIALOG_OPEN', payload: open });
  };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Licenses" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between space-y-2">
                        <h1 className="text-2xl font-bold mb-4">Licenses</h1>
                        {/* <LicenseAddDialog 
                            onSuccess={handleAddSuccess}
                            packages={state.Packages}
                        />
                        <LicenseEditDialog
                            open={state.isEditDialogOpen} 
                            onOpenChange={handleEditDialogChange}
                            license={state.selectedLicense}
                            onSuccess={handleEditSuccess}
                            packages={state.Packages}
                        /> */}
                        <Button>
                            <Link href={route('licenses.create')}>
                                Add License
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
                      data={state.Licenses} 
                      columns={licenseColumns} 
                      onDelete={onDelete} 
                      onEdit={onEdit}   
                    />
                  )}
                </div>
            </div>
        </AppLayout>
    );
}

// export function LicenseAddDialog({ onSuccess, packages }: { onSuccess?: (newLicense: any) => void, packages: any[] }) {
//     const [ isCollapsed, setIsCollapsed] = useState(false);
//     const { data, setData, post, processing, errors, reset } = useForm({
//         license_key: '',
//         license_type: 'per-user',
//         max_count: 1,
//         expiration_date: '',
//         cost: '',
//         renewal_terms: '',
//         status: 'active',
//         package_id: '',
//     });

//     function generateKey() {
//         const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
//         let key = '';
//         for (let i = 0; i < 20; i++) {
//             key += charset.charAt(Math.floor(Math.random() * charset.length));
//         }
//         setData('license_key', key);
//     }

//     const handleOpenChange = (newOpen: boolean) => {
//         if (!newOpen) {
//             reset();
//         }
//         setIsCollapsed(newOpen);
//     };

//     const handleSubmit = (e: React.FormEvent) => {
//         e.preventDefault();
//         post(route('licenses.store'), {
//             preserveScroll: true,
//             onError: (errors: any) => {
//               if (errors.data) {
//                 try {
//                   const licenseData = JSON.parse(errors.data);
//                   onSuccess?.(licenseData);
//                   handleOpenChange(false);
//                 } catch (e) {
//                   console.error('Error parsing response:', e);
//                 }
//               }
//             },
//         });
//     };

//     return (
//         <Dialog open={isCollapsed} onOpenChange={handleOpenChange}>
//             <DialogTrigger asChild>
//                 <Button>
//                     <PlusIcon className="mr-2 h-4 w-4" />
//                     Add License
//                 </Button>
//             </DialogTrigger>
//             <DialogContent className="sm:max-w-[425px]">
//                 <DialogHeader>
//                     <DialogTitle>Add New License</DialogTitle>
//                     <DialogDescription>
//                         Create a new license for your software package.
//                     </DialogDescription>
//                 </DialogHeader>
//                 <form onSubmit={handleSubmit}>
//                     <div className="space-y-4 py-4">
//                         <div className="space-y-2">
//                             <Label htmlFor="license_key">
//                                 License Key
//                             </Label>
//                             <div className="flex gap-2">
//                                 <Input
//                                     id="license_key"
//                                     value={data.license_key}
//                                     onChange={(e) => setData('license_key', e.target.value)}
//                                     placeholder="Enter license key"
//                                 />
//                                 <Button type="button" variant="outline" onClick={generateKey} title="Generate Key">
//                                     <RefreshCw className="w-4 h-4" />
//                                 </Button>
//                             </div>
//                             {errors.license_key && <InputError message={errors.license_key} />}
//                         </div>
//                         <div className="space-y-2">
//                             <Label htmlFor="license_type">
//                                 Type
//                             </Label>
//                             <Select value={data.license_type} onValueChange={(value) => setData('license_type', value)}>
//                                 <SelectTrigger>
//                                     <SelectValue placeholder="Select license type" />
//                                 </SelectTrigger>
//                                 <SelectContent>
//                                     <SelectItem value="per-user">Per User</SelectItem>
//                                     <SelectItem value="per-machine">Per Machine</SelectItem>
//                                 </SelectContent>
//                             </Select>
//                             {errors.license_type && <InputError message={errors.license_type} />}
//                         </div>
//                         <div className="space-y-2">
//                             <Label htmlFor="max_count">
//                                 Max Count
//                             </Label>
//                             <Input
//                                 id="max_count"
//                                 type="number"
//                                 value={data.max_count}
//                                 onChange={(e) => setData('max_count', parseInt(e.target.value))}
//                                 placeholder="Enter max count"
//                             />
//                             {errors.max_count && <InputError message={errors.max_count} />}
//                         </div>
//                         <div className="space-y-2">
//                             <Label htmlFor="expiration_date">
//                                 Expiration Date
//                             </Label>
//                             <Input
//                                 id="expiration_date"
//                                 type="date"
//                                 value={data.expiration_date}
//                                 onChange={(e) => setData('expiration_date', e.target.value)}
//                             />
//                             {errors.expiration_date && <InputError message={errors.expiration_date} />}
//                         </div>
//                         <div className="space-y-2">
//                             <Label htmlFor="cost">
//                                 Cost
//                             </Label>
//                             <Input
//                                 id="cost"
//                                 value={data.cost}
//                                 onChange={(e) => setData('cost', e.target.value)}
//                                 placeholder="Enter cost"
//                             />
//                             {errors.cost && <InputError message={errors.cost} />}
//                         </div>
//                         <div className="space-y-2">
//                             <Label htmlFor="renewal_terms">
//                                 Renewal Terms
//                             </Label>
//                             <Textarea
//                                 id="renewal_terms"
//                                 value={data.renewal_terms}
//                                 onChange={(e) => setData('renewal_terms', e.target.value)}
//                                 placeholder="Enter renewal terms"
//                             />
//                             {errors.renewal_terms && <InputError message={errors.renewal_terms} />}
//                         </div>
//                         <div className="space-y-2">
//                             <Label htmlFor="status">
//                                 Status
//                             </Label>
//                             <Select value={data.status} onValueChange={(value) => setData('status', value)}>
//                                 <SelectTrigger>
//                                     <SelectValue placeholder="Select status" />
//                                 </SelectTrigger>
//                                 <SelectContent>
//                                     <SelectItem value="active">Active</SelectItem>
//                                     <SelectItem value="inactive">Inactive</SelectItem>
//                                 </SelectContent>
//                             </Select>
//                             {errors.status && <InputError message={errors.status} />}
//                         </div>
//                         <div className="space-y-2">
//                             <Label htmlFor="package_id">
//                                 Package
//                             </Label>
//                             <Select value={data.package_id} onValueChange={(value) => setData('package_id', value)}>
//                                 <SelectTrigger>
//                                     <SelectValue placeholder="Select package" />
//                                 </SelectTrigger>
//                                 <SelectContent>
//                                     {packages.map((pkg) => (
//                                         <SelectItem key={pkg.id} value={pkg.id.toString()}>
//                                             {pkg.package_name} v{pkg.version}
//                                         </SelectItem>
//                                     ))}
//                                 </SelectContent>
//                             </Select>
//                             {errors.package_id && <InputError message={errors.package_id} />}
//                         </div>
//                     </div>
//                     <DialogFooter>
//                         <Button type="submit" disabled={processing}>
//                             {processing ? 'Creating...' : 'Create License'}
//                         </Button>
//                     </DialogFooter>
//                 </form>
//             </DialogContent>
//         </Dialog>
//     );
// }

// export function LicenseEditDialog({ open, onOpenChange, license, onSuccess, packages }: { open: boolean, onOpenChange: (open: boolean) => void, license: any, onSuccess?: (updatedLicense: any) => void, packages: any[] }) {
//     const { data, setData, patch, processing, errors, reset } = useForm({
//         license_key: '',
//         license_type: 'per-user',
//         max_count: 1,
//         expiration_date: '',
//         cost: '',
//         renewal_terms: '',
//         status: 'active',
//         package_id: '',
//     });

//     function generateKey() {
//         const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
//         let key = '';
//         for (let i = 0; i < 20; i++) {
//             key += charset.charAt(Math.floor(Math.random() * charset.length));
//         }
//         setData('license_key', key);
//     }

//     useEffect(() => {
//         if (license) {
//             setData({
//                 license_key: license.license_key || '',
//                 license_type: license.license_type || 'per-user',
//                 max_count: license.max_count || 1,
//                 expiration_date: license.expiration_date || '',
//                 cost: license.cost || '',
//                 renewal_terms: license.renewal_terms || '',
//                 status: license.status || 'active',
//                 package_id: license.package_id?.toString() || '',
//             });
//         }
//     }, [license]);

//     const handleOpenChange = (newOpen: boolean) => {
//         if (!newOpen) {
//             reset();
//         }
//         onOpenChange(newOpen);
//     };

//     const handleSubmit = (e: React.FormEvent) => {
//         e.preventDefault();
//         patch(route('licenses.update', { id: license?.id }), {
//             preserveScroll: true,
//             onError: (errors: any) => {
//               if (errors.data) {
//                 try {
//                   const licenseData = JSON.parse(errors.data);
//                   onSuccess?.(licenseData);
//                   handleOpenChange(false);
//                 } catch (e) {
//                   console.error('Error parsing response:', e);
//                 }
//               }
//             },
//         });
//     };

//     if (!license) return null;

//     return (
//         <Dialog open={open} onOpenChange={handleOpenChange}>
//             <DialogContent className="sm:max-w-[425px]">
//                 <DialogHeader>
//                     <DialogTitle>Edit License</DialogTitle>
//                     <DialogDescription>
//                         Update the license information.
//                     </DialogDescription>
//                 </DialogHeader>
//                 <form onSubmit={handleSubmit}>
//                     <div className="space-y-4 py-4">
//                         <div className="space-y-2">
//                             <Label htmlFor="license_key">
//                                 License Key
//                             </Label>
//                             <div className="flex gap-2">
//                                 <Input
//                                     id="license_key"
//                                     value={data.license_key}
//                                     onChange={(e) => setData('license_key', e.target.value)}
//                                     placeholder="Enter license key"
//                                 />
//                                 <Button type="button" variant="outline" onClick={generateKey} title="Generate Key">
//                                     <RefreshCw className="w-4 h-4" />
//                                 </Button>
//                             </div>
//                             {errors.license_key && <InputError message={errors.license_key} />}
//                         </div>
//                         <div className="space-y-2">
//                             <Label htmlFor="license_type">
//                                 Type
//                             </Label>
//                             <Select value={data.license_type} onValueChange={(value) => setData('license_type', value)}>
//                                 <SelectTrigger>
//                                     <SelectValue placeholder="Select license type" />
//                                 </SelectTrigger>
//                                 <SelectContent>
//                                     <SelectItem value="per-user">Per User</SelectItem>
//                                     <SelectItem value="per-machine">Per Machine</SelectItem>
//                                 </SelectContent>
//                             </Select>
//                             {errors.license_type && <InputError message={errors.license_type} />}
//                         </div>
//                         <div className="space-y-2">
//                             <Label htmlFor="max_count">
//                                 Max Count
//                             </Label>
//                             <Input
//                                 id="max_count"
//                                 type="number"
//                                 value={data.max_count}
//                                 onChange={(e) => setData('max_count', parseInt(e.target.value))}
//                                 placeholder="Enter max count"
//                             />
//                             {errors.max_count && <InputError message={errors.max_count} />}
//                         </div>
//                         <div className="space-y-2">
//                             <Label htmlFor="expiration_date">
//                                 Expiration Date
//                             </Label>
//                             <Input
//                                 id="expiration_date"
//                                 type="date"
//                                 value={data.expiration_date}
//                                 onChange={(e) => setData('expiration_date', e.target.value)}
//                             />
//                             {errors.expiration_date && <InputError message={errors.expiration_date} />}
//                         </div>
//                         <div className="space-y-2">
//                             <Label htmlFor="cost">
//                                 Cost
//                             </Label>
//                             <Input
//                                 id="cost"
//                                 value={data.cost}
//                                 onChange={(e) => setData('cost', e.target.value)}
//                                 placeholder="Enter cost"
//                             />
//                             {errors.cost && <InputError message={errors.cost} />}
//                         </div>
//                         <div className="space-y-2">
//                             <Label htmlFor="renewal_terms">
//                                 Renewal Terms
//                             </Label>
//                             <Textarea
//                                 id="renewal_terms"
//                                 value={data.renewal_terms}
//                                 onChange={(e) => setData('renewal_terms', e.target.value)}
//                                 placeholder="Enter renewal terms"
//                             />
//                             {errors.renewal_terms && <InputError message={errors.renewal_terms} />}
//                         </div>
//                         <div className="space-y-2">
//                             <Label htmlFor="status">
//                                 Status
//                             </Label>
//                             <Select value={data.status} onValueChange={(value) => setData('status', value)}>
//                                 <SelectTrigger>
//                                     <SelectValue placeholder="Select status" />
//                                 </SelectTrigger>
//                                 <SelectContent>
//                                     <SelectItem value="active">Active</SelectItem>
//                                     <SelectItem value="inactive">Inactive</SelectItem>
//                                 </SelectContent>
//                             </Select>
//                             {errors.status && <InputError message={errors.status} />}
//                         </div>
//                         <div className="space-y-2">
//                             <Label htmlFor="package_id">
//                                 Package
//                             </Label>
//                             <Select value={data.package_id} onValueChange={(value) => setData('package_id', value)}>
//                                 <SelectTrigger>
//                                     <SelectValue placeholder="Select package" />
//                                 </SelectTrigger>
//                                 <SelectContent>
//                                     {packages.map((pkg) => (
//                                         <SelectItem key={pkg.id} value={pkg.id.toString()}>
//                                             {pkg.package_name} v{pkg.version}
//                                         </SelectItem>
//                                     ))}
//                                 </SelectContent>
//                             </Select>
//                             {errors.package_id && <InputError message={errors.package_id} />}
//                         </div>
//                     </div>
//                     <DialogFooter>
//                         <Button type="submit" disabled={processing}>
//                             {processing ? 'Updating...' : 'Update License'}
//                         </Button>
//                     </DialogFooter>
//                 </form>
//             </DialogContent>
//         </Dialog>
//     );
// }
