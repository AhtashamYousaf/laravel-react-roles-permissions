import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
export default function UserSearch({ search, onSearchChange, onSubmit }: any) {
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