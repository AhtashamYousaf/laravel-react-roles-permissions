import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { Toaster } from '@/components/ui/sonner';
import AppLayout from '@/layouts/app-layout';
import CommonFunctions from '@/pages/helpers/common';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';
import RoleForm from './components/form';
import RoleSearch from './components/search';
import RoleTable from './components/table';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Roles', href: '/roles' },
];

type Role = {
    id: number;
    name: string;
    created_at: Date;
    updated_at: Date;
    permissions: { id: number; name: string }[];
};

type Props = {
    roles: {
        data: Role[];
        current_page: number;
        last_page: number;
        total: number;
        links: {
            url: string | null;
            label: string;
            active: boolean;
        }[];
    };
    permissions: { id: number; name: string }[];
    mustVerifyEmail: boolean;
    status?: string;
    search?: string;
};

export default function Index({ roles, permissions, search: initialSearch }: Props) {
    const [search, setSearch] = useState(initialSearch ?? '');
    const [openDialog, setOpenDialog] = useState<'create' | 'edit' | 'view' | 'delete' | null>(null);
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const { hasPermission } = CommonFunctions();

    const {
        data,
        setData,
        post,
        put,
        delete: destroy,
        processing,
        errors,
        reset,
    } = useForm<{
        name: string;
        permissions: number[];
    }>({
        name: '',
        permissions: [],
    });

    const isCreating = openDialog === 'create';
    const isEditing = openDialog === 'edit';

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (search.trim() !== initialSearch?.trim()) {
            router.get('/roles', { search: search.trim() }, { preserveScroll: true });
        }
    };

    const togglePermission = (id: number) => {
        setData('permissions', data.permissions.includes(id) ? data.permissions.filter((pid) => pid !== id) : [...data.permissions, id]);
    };

    const openModal = (type: 'create' | 'edit' | 'view' | 'delete', role: Role | null = null) => {
        setSelectedRole(role);

        if (type === 'edit' && role) {
            setData({
                name: role.name,
                permissions: role.permissions?.map((p) => p.id) ?? [],
            });
        } else if (type === 'create') {
            reset();
        }

        setOpenDialog(type);
    };

    const closeModal = () => {
        setOpenDialog(null);
        setSelectedRole(null);
        reset();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const method = isEditing ? put : post;
        const url = isEditing ? `/roles/${selectedRole?.id}` : '/roles';

        method(url, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success(`Role ${isEditing ? 'updated' : 'created'} successfully`);
                closeModal();
            },
            onError: () => {
                toast.error(`Failed to ${isEditing ? 'update' : 'create'} role`);
            },
        });
    };

    const handleDelete = () => {
        if (!selectedRole) return;

        destroy(`/roles/${selectedRole.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Role deleted successfully');
                closeModal();
            },
            onError: (Errors) => {
                toast.error(Errors?.delete || 'Failed to delete role');
                closeModal();
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="User Roles" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="border-sidebar-border/70 dark:border-sidebar-border bg-background relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border p-4 md:min-h-min">
                    <div className="absolute inset-0 size-full stroke-neutral-900/10 dark:stroke-neutral-100/10">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/10 dark:stroke-neutral-100/10" />
                    </div>

                    <div className="relative z-10 space-y-6">
                        <Toaster position="top-right" />

                        <RoleSearch search={search} onSearchChange={(e) => setSearch(e.target.value)} onSubmit={handleSearch} />

                        {hasPermission('role_create') && (
                            <div className="flex justify-end">
                                <Button onClick={() => openModal('create')}>Add New Role</Button>
                            </div>
                        )}

                        <RoleTable
                            roles={roles}
                            onView={(role) => openModal('view', role)}
                            onEdit={(role) => openModal('edit', role)}
                            onDelete={(role) => openModal('delete', role)}
                        />

                        {openDialog && (
                            <Dialog open={!!openDialog} onOpenChange={closeModal}>
                                <DialogContent className="sm:max-w-[500px]">
                                    {/* View Dialog */}
                                    {openDialog === 'view' && selectedRole && (
                                        <>
                                            <DialogHeader>
                                                <DialogTitle>View Role</DialogTitle>
                                                <DialogDescription>Role details below:</DialogDescription>
                                            </DialogHeader>

                                            <div className="space-y-4">
                                                <p>
                                                    <strong>ID:</strong> {selectedRole.id}
                                                </p>
                                                <p>
                                                    <strong>Name:</strong> {selectedRole.name}
                                                </p>

                                                <div>
                                                    <strong>Permissions:</strong>
                                                    {selectedRole.permissions?.length ? (
                                                        <div className="mt-2 space-y-4 rounded border bg-gray-50 p-3">
                                                            {Object.entries(
                                                                selectedRole.permissions.reduce(
                                                                    (acc: Record<string, typeof selectedRole.permissions>, perm) => {
                                                                        const [group] = perm.name.split('_');
                                                                        if (!acc[group]) acc[group] = [];
                                                                        acc[group].push(perm);
                                                                        return acc;
                                                                    },
                                                                    {},
                                                                ),
                                                            ).map(([group, perms]) => (
                                                                <div key={group}>
                                                                    <div className="mb-1 font-semibold text-gray-700 capitalize">
                                                                        {group.replaceAll('_', ' ')}
                                                                    </div>
                                                                    <div className="ml-3 flex flex-wrap gap-2">
                                                                        {perms.map((p) => (
                                                                            <span
                                                                                key={p.id}
                                                                                className="rounded-full bg-blue-100 px-2 py-1 text-sm text-blue-800"
                                                                            >
                                                                                {p.name.replace(`${group}_`, '').replaceAll('_', ' ')}
                                                                            </span>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <p className="mt-2 text-gray-500">No permissions assigned.</p>
                                                    )}
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {/* Create or Edit Dialog */}
                                    {(isCreating || isEditing) && (
                                        <>
                                            <DialogHeader>
                                                <DialogTitle>{isCreating ? 'Create Role' : 'Edit Role'}</DialogTitle>
                                                <DialogDescription>{isCreating ? 'Add a new role.' : 'Update role details.'}</DialogDescription>
                                            </DialogHeader>

                                            <RoleForm
                                                type={openDialog}
                                                data={data}
                                                permissions={permissions}
                                                errors={errors}
                                                processing={processing}
                                                togglePermission={togglePermission}
                                                onChange={(key, value) => setData(key, value)}
                                                onSubmit={handleSubmit}
                                                onClose={closeModal}
                                            />
                                        </>
                                    )}

                                    {/* Delete Dialog */}
                                    {openDialog === 'delete' && selectedRole && (
                                        <>
                                            <DialogHeader>
                                                <DialogTitle>Delete Role</DialogTitle>
                                                <DialogDescription>
                                                    Are you sure you want to delete the role <strong>{selectedRole.name}</strong>?
                                                </DialogDescription>
                                            </DialogHeader>
                                            <DialogFooter>
                                                <Button
                                                    variant="destructive"
                                                    onClick={() => {
                                                        handleDelete();
                                                    }}
                                                >
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
