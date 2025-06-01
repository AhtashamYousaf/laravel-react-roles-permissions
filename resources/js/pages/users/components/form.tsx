import React from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Props {
    data: {
        name: string;
        email: string;
        password: string;
        roleIds: number[];
        permissionIds: number[];
    };
    roles: { id: number; name: string }[];
    permissions: { id: number; name: string }[];
    errors: {
        name?: string;
        email?: string;
        password?: string;
        roleIds?: string;
        permissionIds?: string;
    };
    processing?: boolean;
    onChange: (field: 'name' | 'email' | 'password' | 'roleIds' | 'permissionIds', value: string | number[]) => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    submitLabel: string;
}

export default function UserForm({
    data,
    roles,
    permissions,
    errors,
    processing,
    onChange,
    onSubmit,
    submitLabel
}: Props) {
    const groupedPermissions = permissions.reduce((acc: Record<string, typeof permissions>, perm) => {
        const [group] = perm.name.split('.');
        if (!acc[group]) acc[group] = [];
        acc[group].push(perm);
        return acc;
    }, {});

    const isGroupChecked = (group: string) =>
        groupedPermissions[group].every((perm) => data.permissionIds.includes(perm.id));

    const isGroupIndeterminate = (group: string) => {
        const perms = groupedPermissions[group];
        const selected = perms.filter((perm) => data.permissionIds.includes(perm.id));
        return selected.length > 0 && selected.length < perms.length;
    };

    const handleToggleGroup = (group: string) => {
        const perms = groupedPermissions[group];
        const allChecked = isGroupChecked(group);
        const newIds = allChecked
            ? data.permissionIds.filter((id) => !perms.some((perm) => perm.id === id))
            : [...new Set([...data.permissionIds, ...perms.map((perm) => perm.id)])];
        onChange('permissionIds', newIds);
    };

    return (
        <form onSubmit={onSubmit} className="grid gap-4 py-4">
            {/* Name */}
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input
                    id="name"
                    value={data.name}
                    onChange={(e) => onChange('name', e.target.value)}
                    className="col-span-3"
                    required
                    autoComplete="off"
                />
                <InputError className="col-span-4 mt-1 text-center" message={errors.name} />
            </div>

            {/* Email */}
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">Email</Label>
                <Input
                    type="email"
                    id="email"
                    value={data.email}
                    onChange={(e) => onChange('email', e.target.value)}
                    className="col-span-3"
                    required
                    autoComplete="off"
                />
                <InputError className="col-span-4 mt-1 text-center" message={errors.email} />
            </div>

            {/* Password */}
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="password" className="text-right">Password</Label>
                <Input
                    type="password"
                    id="password"
                    value={data.password}
                    onChange={(e) => onChange('password', e.target.value)}
                    className="col-span-3"
                    autoComplete="off"
                    placeholder={submitLabel.toLowerCase().includes('save') ? "Leave blank if you don't want to change the password" : ''}
                    required={!submitLabel.toLowerCase().includes('save')}
                />
                <InputError className="col-span-4 mt-1 text-center" message={errors.password} />
            </div>

            {/* Roles */}
            <div className="grid grid-cols-4 items-start gap-4">
                <Label className="text-right pt-2">Roles</Label>
                <div className="col-span-3 flex flex-wrap gap-4">
                    {roles.map((role) => (
                        <div key={role.id} className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                value={role.id}
                                checked={data.roleIds.includes(role.id)}
                                onChange={(e) => {
                                    const updatedRoleIds = e.target.checked
                                        ? [...data.roleIds, role.id]
                                        : data.roleIds.filter((id) => id !== role.id);
                                    onChange('roleIds', updatedRoleIds);
                                }}
                            />
                            <span className="capitalize">{role.name}</span>
                        </div>
                    ))}
                </div>
                <InputError className="col-span-4 mt-1 text-center" message={errors.roleIds} />
            </div>

            {/* Permissions */}
            <div>
                <Label className="mb-2 block">Assign Direct Permissions</Label>
                <div className="max-h-72 space-y-4 overflow-y-auto rounded border p-3">
                    {Object.entries(groupedPermissions).map(([group, perms]) => (
                        <div key={group}>
                            <div className="mb-2 flex items-center gap-2 font-semibold capitalize">
                                <input
                                    type="checkbox"
                                    checked={isGroupChecked(group)}
                                    ref={(el) => {
                                        if (el) el.indeterminate = isGroupIndeterminate(group);
                                    }}
                                    onChange={() => handleToggleGroup(group)}
                                />
                                <span>{group}</span>
                            </div>
                            <div className="ml-5 grid grid-cols-2 gap-2 md:grid-cols-3">
                                {perms.map((perm) => {
                                    const [, action] = perm.name.split('.');
                                    return (
                                        <div key={perm.id} className="flex items-center gap-2 text-sm">
                                            <input
                                                type="checkbox"
                                                checked={data.permissionIds.includes(perm.id)}
                                                onChange={() => {
                                                    const updated = data.permissionIds.includes(perm.id)
                                                        ? data.permissionIds.filter((id) => id !== perm.id)
                                                        : [...data.permissionIds, perm.id];
                                                    onChange('permissionIds', updated);
                                                }}
                                            />
                                            <span className="capitalize">{action.replaceAll('_', ' ')}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
                {errors.permissionIds && <p className="text-sm text-red-500">{errors.permissionIds}</p>}
            </div>

            <DialogFooter>
                <Button type="submit" disabled={processing}>
                    {processing ? 'Processing...' : submitLabel}
                </Button>
            </DialogFooter>
        </form>
    );
}
