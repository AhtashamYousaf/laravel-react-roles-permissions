import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import React, { useMemo } from 'react';

type RoleFormProps = {
    type: 'create' | 'edit';
    data: {
        name: string;
        permissions: number[];
    };
    onChange: (key: 'name' | 'permissions', value: string | number[]) => void;
    errors: Record<string, string>;
    processing: boolean;
    permissions: {
        id: number;
        name: string;
    }[];
    onSubmit: (e: React.FormEvent) => void;
    onClose: () => void;
    togglePermission: (id: number) => void;
};

export default function RoleForm({ type, data, onChange, errors, processing, permissions, onSubmit, onClose, togglePermission }: RoleFormProps) {
    const groupedPermissions = useMemo(() => {
        return permissions.reduce(
            (acc, perm) => {
                const [group] = perm.name.split('.');
                acc[group] = acc[group] || [];
                acc[group].push(perm);
                return acc;
            },
            {} as Record<string, { id: number; name: string }[]>,
        );
    }, [permissions]);
    const getGroupIds = (group: string) => groupedPermissions[group].map((p) => p.id);

    const isGroupChecked = (group: string) => {
        const ids = getGroupIds(group);
        return ids.every((id) => data.permissions.includes(id));
    };

    const isGroupIndeterminate = (group: string) => {
        const ids = getGroupIds(group);
        const selected = ids.filter((id) => data.permissions.includes(id));
        return selected.length > 0 && selected.length < ids.length;
    };

    const handleToggleGroup = (group: string) => {
        const ids = getGroupIds(group);
        const allSelected = ids.every((id) => data.permissions.includes(id));

        const updated = allSelected ? data.permissions.filter((id) => !ids.includes(id)) : [...new Set([...data.permissions, ...ids])];

        onChange('permissions', updated);
    };

    return (
        <form onSubmit={onSubmit} className="grid gap-4 py-4">
            {/* Name Field */}
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                    Name
                </Label>
                <Input
                    id="name"
                    value={data.name}
                    onChange={(e) => onChange('name', e.target.value)}
                    className="col-span-3"
                    required
                    autoComplete="off"
                />
            </div>
            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}

            {/* Permissions */}
            <div>
                <Label className="mb-2 block">Assign Permissions</Label>
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
                                                checked={data.permissions.includes(perm.id)}
                                                onChange={() => togglePermission(perm.id)}
                                            />
                                            <span className="capitalize">{action.replaceAll('_', ' ')}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
                {errors.permissions && <p className="text-sm text-red-500">{errors.permissions}</p>}
            </div>

            {/* Buttons */}
            <DialogFooter>
                <Button type="submit" disabled={processing}>
                    {type === 'create' ? 'Create Role' : 'Save Changes'}
                </Button>
                <Button type="button" variant="outline" onClick={onClose}>
                    Cancel
                </Button>
            </DialogFooter>
        </form>
    );
}
