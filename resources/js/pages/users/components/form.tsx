import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import React from 'react';

interface Props {
    data: {
        name: string;
        email: string;
        password: string;
        roleIds: number[];
    };
    roles: { id: number; name: string }[];
    errors: {
        name?: string;
        email?: string;
        password?: string;
        roleIds?: string;
    };
    processing?: boolean;
    onChange: (field: 'name' | 'email' | 'password' | 'roleIds', value: string  | number[]) => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    submitLabel: string;
}

export default function UserForm({ data, roles, errors, processing, onChange, onSubmit, submitLabel }: Props) {
    return (
        <form onSubmit={onSubmit} className="grid gap-4 py-4">
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
                <InputError className="col-span-4 mt-1 text-center" message={errors.name} />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                    Email
                </Label>
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

            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="password" className="text-right">
                    Password
                </Label>
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

           <div className="grid grid-cols-4 items-start gap-4">
                <Label className="text-right pt-2">Roles</Label>
                <div className="col-span-3 grid gap-2">
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
                            {role.name.charAt(0).toUpperCase() + role.name.slice(1)}
                        </div>
                    ))}
                </div>
                <InputError className="col-span-4 mt-1 text-center" message={errors.roleIds} />
            </div>


            <DialogFooter>
                <Button type="submit" disabled={processing}>
                    {processing ? 'Processing...' : submitLabel}
                </Button>
            </DialogFooter>
        </form>
    );
}
