import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';

import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';

import UserForm from './components/form';
import UserSearch from './components/search';
import UserTable from './components/table';

import userService from '@/services/user-service';
import { type BreadcrumbItem } from '@/types';

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

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'Users', href: '/users' },
];

type DialogType = 'create' | 'edit' | 'delete' | null;

export default function Index({ users, roles, search: initialSearch }: Props) {
  const [search, setSearch] = useState(initialSearch ?? '');
  const [openDialog, setOpenDialog] = useState<DialogType>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null); // Success message state

  const { data, setData, post, processing, errors, reset } = useForm<{
    name: string;
    email: string;
    password: string;
    role: string;
  }>({
    name: '',
    email: '',
    password: '',
    role: '',
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    userService.getUsers(search);
  };

  const openModal = (type: DialogType, user: User | null = null) => {
    setSelectedUser(user);
    if (user) {
      setData({
        name: user.name,
        email: user.email,
        password: '',
        role: user.roles[0]?.name || '',
      });
    } else {
      reset();
    }
    setOpenDialog(type);
  };

  const closeModal = () => {
    setOpenDialog(null);
    setSelectedUser(null);
    reset();
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    userService.createUser(data, () => {
      setSuccessMessage('User created successfully');
      closeModal();
    });
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    userService.updateUser(selectedUser.id, data, () => {
      setSuccessMessage('User updated successfully');
      closeModal();
    });
  };

  const handleDelete = () => {
    if (!selectedUser) return;
    userService.deleteUser(selectedUser.id, () => {
         setSuccessMessage('User deleted successfully');
      closeModal();
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
            {successMessage && (
              <div className="bg-green-100 text-green-800 p-4 rounded-lg mb-4">
                {successMessage}
              </div>
            )}

            <UserSearch
              search={search}
              onSearchChange={(e: any) => setSearch(e.target.value)}
              onSubmit={handleSearch}
            />

            <div className="flex justify-end">
              <Button onClick={() => openModal('create')}>
                Add New User
              </Button>
            </div>

            <UserTable
              users={users}
              onEdit={(user: any) => openModal('edit', user)}
              onDelete={(user: any) => openModal('delete', user)}
            />

            <Dialog open={!!openDialog} onOpenChange={closeModal}>
              <DialogContent className="sm:max-w-[425px]">
                {openDialog !== 'delete' && (
                  <>
                    <DialogHeader>
                      <DialogTitle>
                        {openDialog === 'create' ? 'Create User' : 'Edit User'}
                      </DialogTitle>
                      <DialogDescription>
                        {openDialog === 'create' ? 'Add a new user.' : 'Update user details.'}
                      </DialogDescription>
                    </DialogHeader>

                    <UserForm
                      data={data}
                      roles={roles}
                      errors={errors}
                      processing={processing}
                      submitLabel={openDialog === 'create' ? 'Create User' : 'Save Changes'}
                      onChange={(field, value) => setData(field, value)}
                      onSubmit={openDialog === 'create' ? handleCreate : handleUpdate}
                    />
                  </>
                )}

                {openDialog === 'delete' && selectedUser && (
                  <>
                    <DialogHeader>
                      <DialogTitle>Delete User</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to delete this user?
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
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
