import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';

import UserForm from './components/form';
import UserSearch from './components/search';
import UserTable from './components/table';

import { Toaster } from '@/components/ui/sonner';
import { type BreadcrumbItem } from '@/types';
import { toast } from 'sonner';

type Role = {
    id: number;
    name: string;
};

type Permission = {
    id: number;
    name: string;
};

type User = {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    roles: Role[];
    permissions: Permission[];
    created_at: Date;
};

type Props = {
    users: {
        data: User[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links: {
            url: string | null;
            label: string;
            active: boolean;
        }[];
    };
    roles: Role[];
    permissions: { id: number; name: string }[];
    mustVerifyEmail: boolean;
    status?: string;
    search?: string;
    role?: string;
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Users', href: '/users' },
];

type DialogType = 'create' | 'edit' | 'delete' | null;

export default function Index({ users, roles, permissions, search: initialSearch, role: initialRole }: Props) {
    const [search, setSearch] = useState(initialSearch ?? '');
    const [openDialog, setOpenDialog] = useState<DialogType>(null);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [roleId, setRoleId] = useState(initialRole ?? '');
    const defaultFormData = {
        name: '',
        email: '',
        password: '',
        roleIds: [] as number[],
        permissionIds: [] as number[],
    };

    const { data, setData, get, put, post, delete: destroy, processing, errors, reset } = useForm({ ...defaultFormData });

    const isCreating = openDialog === 'create';
    const isEditing = openDialog === 'edit';

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();

        const trimmedSearch = search.trim();
        const trimmedInitialSearch = initialSearch?.trim() || '';
        const initialRoleValue = initialRole || '';

        if (trimmedSearch !== trimmedInitialSearch || roleId !== initialRoleValue) {
            get(
                route('admin.users.index', {
                    search: trimmedSearch || undefined,
                    role: roleId ? roleId : undefined,
                }),
            );
        }
    };

    const openModal = (type: DialogType, user: User | null = null) => {
        setSelectedUser(user);

        setData(
            user
                ? {
                      ...defaultFormData,
                      name: user.name,
                      email: user.email,
                      roleIds: user.roles.map((role) => role.id),
                      permissionIds: user.permissions?.map((permission) => permission.id) || [],
                  }
                : defaultFormData,
        );

        setOpenDialog(type);
    };

    const closeModal = () => {
        setOpenDialog(null);
        setSelectedUser(null);
        reset();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const method = isEditing ? put : post;
        const routeName = isEditing ? route('admin.users.update', selectedUser!.id) : route('admin.users.store');

        method(routeName, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success(`User ${isEditing ? 'updated' : 'created'} successfully`);
                closeModal();
            },
            onError: (Errors) => {
                toast.error(Errors?.update || Errors?.create || `Failed to ${isEditing ? 'update' : 'create'} user`);
            },
        });
    };

    const handleDelete = () => {
        if (!selectedUser) return;
        destroy(route('admin.users.destroy', selectedUser.id), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('User deleted successfully');
                closeModal();
            },
            onError: (Errors) => {
                toast.error(Errors?.delete || 'Failed to delete user');
                closeModal();
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manage Users" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="border-sidebar-border/70 dark:border-sidebar-border bg-background relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border p-4 md:min-h-min">
                    <div className="absolute inset-0 size-full stroke-neutral-900/10 dark:stroke-neutral-100/10">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/10 dark:stroke-neutral-100/10" />
                    </div>

                    <div className="relative z-10 space-y-6">
                        <Toaster position="top-right" />
                        <UserSearch
                            search={search}
                            roleId={roleId}
                            roles={roles}
                            onSearchChange={(e) => setSearch(e.target.value)}
                            onRoleChange={(value: string) => setRoleId(value)}
                            onSubmit={handleSearch}
                        />

                        <div className="flex justify-end">
                            <Button onClick={() => openModal('create')}>Add New User</Button>
                        </div>

                        <UserTable
                            users={users}
                            onEdit={(user: User) => openModal('edit', user)}
                            onDelete={(user: User) => openModal('delete', user)}
                        />

                        {openDialog && (
                            <Dialog open={!!openDialog} onOpenChange={closeModal}>
                                <DialogContent className="sm:max-w-[425px]">
                                    {isCreating || isEditing ? (
                                        <>
                                            <DialogHeader>
                                                <DialogTitle>{isCreating ? 'Create User' : 'Edit User'}</DialogTitle>
                                                <DialogDescription>{isCreating ? 'Add a new user.' : 'Update user details.'}</DialogDescription>
                                            </DialogHeader>
                                            <UserForm
                                                data={data}
                                                roles={roles}
                                                permissions={permissions}
                                                errors={errors}
                                                processing={processing}
                                                submitLabel={isCreating ? 'Create User' : 'Save Changes'}
                                                onChange={(field, value) => setData(field, value)}
                                                onSubmit={handleSubmit}
                                            />
                                        </>
                                    ) : (
                                        <>
                                            <DialogHeader>
                                                <DialogTitle>Delete User</DialogTitle>
                                                <DialogDescription>
                                                    Are you sure you want to delete this user "{selectedUser?.name}" ?
                                                </DialogDescription>
                                            </DialogHeader>
                                            <DialogFooter>
                                                <Button variant="destructive" onClick={handleDelete}>
                                                    Yes, Delete
                                                </Button>
                                                <Button variant="outline" onClick={closeModal}>
                                                    Cancel
                                                </Button>
                                            </DialogFooter>
                                        </>
                                    )}
                                </DialogContent>
                            </Dialog>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
