export default function UserSearch({ search, onSearchChange, onSubmit }: any) {
    return (
        <form onSubmit={onSubmit} className="flex gap-2">
            <input
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search users..."
                className="input max-w-sm"
            />
            <button type="submit" className="btn">Search</button>
        </form>
    );
}