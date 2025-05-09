import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';

import UserSearch from './components/search';
import UserTable from './components/table';
import UserFormDialog from './components/form';
import userService from '@/services/user-service';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Users', href: '/users' },
];

type Role = {
    id: number;
    name: string;
};
type User = {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    roles: Role[];
    created_at: Date;
};

type Props = {
    users: {
        data: User[];
        current_page: number;
        last_page: number;
        total: number;
        links: {
            url: string | null;
            label: string;
            active: boolean;
        }[];
    };
    roles: Role[];
    mustVerifyEmail: boolean;
    status?: string;
    search?: string;
};

export default function Index(props: Props) {
    const [search, setSearch] = useState(props.search ?? '');
    const [openDialog, setOpenDialog] = useState<'create' | 'edit' | 'delete' | null>(null);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const { data, setData, post, processing, errors } = useForm({
        name: selectedUser?.name ?? '',
        email: selectedUser?.email ?? '',
        password: '',
        role: '',
    });

    const openModal = (type: 'edit' | 'delete', user: User) => {
        setSelectedUser(user);
        setData({
            name: user.name ?? '',
            email: user.email ?? '',
            password: '',
            role: user.roles.length ? user.roles[0].name : '',
        });
        setOpenDialog(type);
    };

    const closeModal = () => {
        setOpenDialog(null);
        setSelectedUser(null);
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/users', { search }, { preserveScroll: true });
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this user?')) {
            router.delete(`/users/${id}`);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        userService.createUser(data, () => {
            closeModal();
            setData({ name: '', email: '', password: '', role: '' });
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="User Users" />
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
                            <Button onClick={() => setOpenDialog('create')}>Add New User</Button>
                        </div>
                        <div className="bg-background overflow-x-auto rounded-lg border">
                            <Table>
                                <TableCaption>A list of all users.</TableCaption>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[80px]">#</TableHead>
                                        <TableHead>User Name</TableHead>
                                        <TableHead className="text-center">Email</TableHead>
                                        <TableHead className="text-center">Role</TableHead>
                                        <TableHead className="text-center">Created At</TableHead>
                                        <TableHead className="text-center">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {props.users.data.length > 0 ? (
                                        props.users.data.map((user, index) => (
                                            <TableRow key={user.id}>
                                                <TableCell className="font-medium">{index + 1 + (props.users.current_page - 1) * 10}</TableCell>
                                                <TableCell>{user.name}</TableCell>
                                                <TableCell className="text-center">{user.email}</TableCell>
                                                <TableCell className="text-center">
                                                    {user.roles.map((role) => role.name.charAt(0).toUpperCase() + role.name.slice(1))}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    {new Date(user.created_at).toLocaleDateString('en-GB', {
                                                        day: 'numeric',
                                                        month: 'long',
                                                        year: 'numeric',
                                                    })}
                                                </TableCell>

                                                <TableCell className="space-x-2 text-center">
                                                    <Button size="icon" variant="ghost" onClick={() => openModal('edit', user)}>
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                    <Button size="icon" variant="ghost" onClick={() => openModal('delete', user)}>
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
                            {props.users.links.map((link, idx) => (
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
                                        {openDialog === 'create' && 'Create User'}
                                        {openDialog === 'edit' && 'Edit User'}
                                        {openDialog === 'delete' && 'Delete User'}
                                    </DialogTitle>
                                    <DialogDescription>
                                        {openDialog === 'create' && 'Add a new user.'}
                                        {openDialog === 'edit' && 'Make changes to the user and save.'}
                                        {openDialog === 'delete' && 'Are you sure you want to delete this user?'}
                                    </DialogDescription>
                                </DialogHeader>
                                {openDialog === 'create' && (
                                    <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="newUserName" className="text-right">
                                                Name
                                            </Label>
                                            <Input
                                                id="newUserName"
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                                className="col-span-3"
                                                required
                                                autoComplete="off"
                                            />
                                            <InputError className="mt-1" message={errors.name} />
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="newUserEmail" className="text-right">
                                                Email
                                            </Label>
                                            <Input
                                                type="email"
                                                id="newUserEmail"
                                                value={data.email}
                                                onChange={(e) => setData('email', e.target.value)}
                                                className="col-span-3"
                                                required
                                                autoComplete="off"
                                            />
                                            <InputError className="mt-1" message={errors.email} />
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="newUserName" className="text-right">
                                                Password
                                            </Label>
                                            <Input
                                                type="password"
                                                id="password"
                                                value={data.password}
                                                onChange={(e) => setData('password', e.target.value)}
                                                className="col-span-3"
                                                required
                                                autoComplete="off"
                                            />
                                            <InputError className="col-span-4 mt-1 text-right" message={errors.password} />
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="newUserRole" className="text-right">
                                                Role
                                            </Label>
                                            <Select value={data.role} onValueChange={(value) => setData('role', value)}>
                                                <SelectTrigger className="col-span-3">
                                                    <SelectValue placeholder="Select a role" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {props.roles.map((role) => (
                                                        <SelectItem key={role.id} value={role.name}>
                                                            {role.name.charAt(0).toUpperCase() + role.name.slice(1)}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <InputError className="mt-1" message={errors.role} />
                                        </div>
                                        <DialogFooter>
                                            <Button type="submit" disabled={processing}>
                                                {processing ? 'Creating...' : 'Create User'}
                                            </Button>
                                        </DialogFooter>
                                    </form>
                                )}

                                {openDialog === 'edit' && selectedUser && (
                                    <form onSubmit={(e) => {
                                            e.preventDefault();
                                            userService.updateUser(selectedUser.id, data, () => {
                                                closeModal();
                                                setData({ name: '', email: '', password: '', role: '' });
                                            });
                                        }}
                                        className="grid gap-4 py-4"
                                    >
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="name" className="text-right">
                                                Name
                                            </Label>
                                            <Input
                                                id="name"
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                                className="col-span-3"
                                                required
                                                autoComplete="name"
                                            />
                                            <InputError className="col-span-4 mt-1 text-right" message={errors.name} />
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="name" className="text-right">
                                                Email
                                            </Label>
                                            <Input
                                                id="email"
                                                value={data.email}
                                                onChange={(e) => setData('email', e.target.value)}
                                                className="col-span-3"
                                                required
                                                autoComplete="email"
                                            />
                                            <InputError className="col-span-4 mt-1 text-right" message={errors.email} />
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="editUserRole" className="text-right">Role</Label>
                                            <Select
                                                value={data.role}
                                                onValueChange={(value) => setData('role', value)}
                                            >
                                                <SelectTrigger className="col-span-3">
                                                    <SelectValue placeholder="Select a role" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {props.roles.map((role) => (
                                                        <SelectItem key={role.id} value={role.name}>
                                                            {role.name.charAt(0).toUpperCase() + role.name.slice(1)}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <InputError className="col-span-4 mt-1 text-right" message={errors.role} />
                                        </div>
                                        <DialogFooter>
                                            <Button type="submit">Save changes</Button>
                                        </DialogFooter>
                                    </form>
                                )}

                                {openDialog === 'delete' && selectedUser && (
                                    <DialogFooter>
                                        <Button
                                            variant="destructive"
                                            onClick={() => {
                                                handleDelete(selectedUser.id);
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
