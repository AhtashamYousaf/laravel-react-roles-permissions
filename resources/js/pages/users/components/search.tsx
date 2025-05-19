import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type Role = {
    id: number;
    name: string;
};

interface UserSearchProps {
    search: string;
    roleId: string;
    roles: Role[];
    onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    onRoleChange: (roleId: string) => void;
}

export default function UserSearch({ search, roleId, roles, onSearchChange, onRoleChange, onSubmit }: UserSearchProps) {
    return (
        <form onSubmit={onSubmit} className="flex gap-2">
            <Input value={search} onChange={onSearchChange} placeholder="Search users..." className="input max-w-sm" />
            <Select value={roleId} onValueChange={onRoleChange}>
                <SelectTrigger className="col-span-3 w-[200px]">
                    <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                    {roles.map((role) => (
                        <SelectItem key={role.id} value={String(role.id)}>
                            {role.name.charAt(0).toUpperCase() + role.name.slice(1)}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <Button type="submit" className="btn">
                Search
            </Button>
        </form>
    );
}
