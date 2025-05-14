import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface UserSearchProps {
    search: string;
    onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}
export default function UserSearch({ search, onSearchChange, onSubmit }: UserSearchProps) {
    return (
        <form onSubmit={onSubmit} className="flex gap-2">
            <Input
                value={search}
                onChange={(e) => onSearchChange(e)}
                placeholder="Search users..."
                className="input max-w-sm"
            />
            <Button type="submit" className="btn">Search</Button>
        </form>
    );
}