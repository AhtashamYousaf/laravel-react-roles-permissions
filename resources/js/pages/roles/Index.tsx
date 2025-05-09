import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'User Roles', href: '/roles' },
];

type Role = {
    id: number;
    name: string;
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
    permissions: {
        id: number;
        name: string;
    }[];
    mustVerifyEmail: boolean;
    status?: string;
    search?: string;
};

export default function Index(props: Props) {
    const [search, setSearch] = useState(props.search ?? '');
    const [openDialog, setOpenDialog] = useState<'create' | 'edit' | 'view' | 'delete' | null>(null);
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const [newRoleName, setNewRoleName] = useState('');
    const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);

    const openModal = (type: 'edit' | 'view' | 'delete', role: Role) => {
        setSelectedRole(role);
        setOpenDialog(type);
    };

    const closeModal = () => {
        setOpenDialog(null);
        setSelectedRole(null);
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/roles', { search }, { preserveScroll: true });
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this role?')) {
            router.delete(`/roles/${id}`);
        }
    };

    const togglePermission = (id: number) => {
        setSelectedPermissions((prev) =>
            prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
        );
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
                        <form onSubmit={handleSearch} className="flex items-center gap-2">
                            <Input placeholder="Search roles..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-sm" />
                            <Button type="submit">Search</Button>
                        </form>
                        <div className="flex justify-end">
                            <Button onClick={() => setOpenDialog('create')}>Add New Role</Button>
                        </div>
                        <div className="bg-background overflow-x-auto rounded-lg border">
                            <Table>
                                <TableCaption>A list of all user roles.</TableCaption>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[80px]">#</TableHead>
                                        <TableHead>Role Name</TableHead>
                                        <TableHead className="text-center">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {props.roles.data.length > 0 ? (
                                        props.roles.data.map((role, index) => (
                                            <TableRow key={role.id}>
                                                <TableCell className="font-medium">{index + 1 + (props.roles.current_page - 1) * 10}</TableCell>
                                                <TableCell>{role.name}</TableCell>
                                                <TableCell className="space-x-2 text-center">
                                                    <Button size="icon" variant="ghost" onClick={() => openModal('view', role)}>
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    <Button size="icon" variant="ghost" onClick={() => openModal('edit', role)}>
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                    <Button size="icon" variant="ghost" onClick={() => openModal('delete', role)}>
                                                        <Trash2 className="text-destructive h-4 w-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={3} className="text-muted-foreground py-4 text-center">
                                                No roles found.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
                            {props.roles.links.map((link, idx) => (
                                <Button
                                    key={idx}
                                    variant={link.active ? 'default' : 'outline'}
                                    onClick={() => link.url && router.get(link.url)}
                                    disabled={!link.url}
                                    size="sm"
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>

                        <Dialog open={!!openDialog} onOpenChange={closeModal}>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>
                                        {openDialog === 'create' && 'Create Role'}
                                        {openDialog === 'view' && 'View Role'}
                                        {openDialog === 'edit' && 'Edit Role'}
                                        {openDialog === 'delete' && 'Delete Role'}
                                    </DialogTitle>
                                    <DialogDescription>
                                        {openDialog === 'create' && 'Add a new role.'}
                                        {openDialog === 'view' && 'Here is the role detail.'}
                                        {openDialog === 'edit' && 'Make changes to the role and save.'}
                                        {openDialog === 'delete' && 'Are you sure you want to delete this role?'}
                                    </DialogDescription>
                                </DialogHeader>
                                {openDialog === 'create' && (
                                    <form
                                        onSubmit={(e) => {
                                            e.preventDefault();
                                            router.post(
                                                '/roles',
                                                { 
                                                    name: newRoleName,
                                                    permissions: selectedPermissions,
                                                },
                                                {
                                                    onSuccess: () => {
                                                        closeModal();
                                                        setNewRoleName('');
                                                        setSelectedPermissions([]);
                                                    },
                                                },
                                            );
                                        }}
                                        className="grid gap-4 py-4"
                                    >
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="newRoleName" className="text-right">
                                                Name
                                            </Label>
                                            <Input
                                                id="newRoleName"
                                                value={newRoleName}
                                                onChange={(e) => setNewRoleName(e.target.value)}
                                                className="col-span-3"
                                                required
                                                autoComplete="off"
                                            />
                                        </div>
                                        <div>
                                            <Label className="mb-2 block">Assign Permissions</Label>
                                            <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border p-2 rounded">
                                                {props.permissions.map((perm) => (
                                                    <label key={perm.id} className="flex items-center gap-2">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedPermissions.includes(perm.id)}
                                                            onChange={() => togglePermission(perm.id)}
                                                        />
                                                        {perm.name}
                                                    </label>
                                                ))}
                                            </div>
                                        </div>

                                        <DialogFooter>
                                            <Button type="submit">Create Role</Button>
                                        </DialogFooter>
                                    </form>
                                )}

                                {openDialog === 'view' && (
                                    <div className="space-y-2">
                                        <p>
                                            <strong>ID:</strong> {selectedRole?.id}
                                        </p>
                                        <p>
                                            <strong>Name:</strong> {selectedRole?.name}
                                        </p>
                                        <p>
                                            <strong>Permissions:</strong>
                                        </p>
                                    </div>
                                )}

                                {openDialog === 'edit' && selectedRole && (
                                    <form
                                        onSubmit={(e) => {
                                            e.preventDefault();
                                            // Send update via Inertia
                                            router.put(`/roles/${selectedRole.id}`, { name: selectedRole.name });
                                            closeModal();
                                        }}
                                        className="grid gap-4 py-4"
                                    >
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="name" className="text-right">
                                                Name
                                            </Label>
                                            <Input
                                                id="name"
                                                value={selectedRole.name}
                                                onChange={(e) => setSelectedRole({ ...selectedRole, name: e.target.value })}
                                                className="col-span-3"
                                                required
                                                autoComplete="name"
                                            />
                                        </div>
                                        <DialogFooter>
                                            <Button type="submit">Save changes</Button>
                                        </DialogFooter>
                                    </form>
                                )}

                                {openDialog === 'delete' && selectedRole && (
                                    <DialogFooter>
                                        <Button
                                            variant="destructive"
                                            onClick={() => {
                                                handleDelete(selectedRole.id);
                                                closeModal();
                                            }}
                                        >
                                            Yes, Delete
                                        </Button>
                                        <Button variant="outline" onClick={closeModal}>
                                            Cancel
                                        </Button>
                                    </DialogFooter>
                                )}
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
