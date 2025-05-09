import { Pencil, Trash2 } from 'lucide-react';

export default function UserTable({ users, onEdit, onDelete }: any) {
    return (
        <div className="overflow-x-auto rounded-lg border">
            <table className="table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th className="text-center">Email</th>
                        <th className="text-center">Role</th>
                        <th className="text-center">Created</th>
                        <th className="text-center">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.data.length > 0 ? (
                        users.data.map((user: any, index: number) => (
                            <tr key={user.id}>
                                <td>{index + 1 + (users.current_page - 1) * 10}</td>
                                <td>{user.name}</td>
                                <td className="text-center">{user.email}</td>
                                <td className="text-center">{user.roles.map((r: any) => r.name).join(', ')}</td>
                                <td className="text-center">{new Date(user.created_at).toLocaleDateString()}</td>
                                <td className="text-center space-x-2">
                                    <button onClick={() => onEdit(user)}><Pencil size={16} /></button>
                                    <button onClick={() => onDelete(user)}><Trash2 size={16} className="text-red-600" /></button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={6} className="text-center text-muted">No users found.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
