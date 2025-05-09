// users/components/UserFormDialog.tsx
import { useForm } from '@inertiajs/react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function UserFormDialog({ type, user, roles, onClose }: any) {
    const isCreate = type === 'create';
    const isEdit = type === 'edit';
    const isDelete = type === 'delete';

    const { data, setData, post, put, delete: destroy, processing, errors } = useForm({
        name: user?.name ?? '',
        email: user?.email ?? '',
        password: '',
        role: user?.roles?.[0]?.name ?? '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isCreate) {
            post('/users', { onSuccess: onClose });
        } else if (isEdit) {
            put(`/users/${user.id}`, { onSuccess: onClose });
        } else if (isDelete) {
            destroy(`/users/${user.id}`, { onSuccess: onClose });
        }
    };

    return (
        <Dialog open={!!type} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {isCreate && 'Create User'}
                        {isEdit && 'Edit User'}
                        {isDelete && 'Delete User'}
                    </DialogTitle>
                </DialogHeader>

                {!isDelete ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label>Name</label>
                            <input value={data.name} onChange={(e) => setData('name', e.target.value)} required />
                            <div className="text-red-500">{errors.name}</div>
                        </div>
                        <div>
                            <label>Email</label>
                            <input value={data.email} onChange={(e) => setData('email', e.target.value)} type="email" required />
                            <div className="text-red-500">{errors.email}</div>
                        </div>
                        <div>
                            <label>Password</label>
                            <input value={data.password} onChange={(e) => setData('password', e.target.value)} type="password" />
                            <div className="text-red-500">{errors.password}</div>
                        </div>
                        <div>
                            <label>Role</label>
                            <select value={data.role} onChange={(e) => setData('role', e.target.value)} required>
                                <option value="">Select role</option>
                                {roles.map((r: any) => (
                                    <option key={r.id} value={r.name}>{r.name}</option>
                                ))}
                            </select>
                            <div className="text-red-500">{errors.role}</div>
                        </div>
                        <DialogFooter>
                            <button type="submit" disabled={processing}>
                                {isCreate ? 'Create' : 'Save Changes'}
                            </button>
                        </DialogFooter>
                    </form>
                ) : (
                    <div>
                        <p>Are you sure you want to delete <strong>{user.name}</strong>?</p>
                        <DialogFooter>
                            <button onClick={handleSubmit} className="text-red-600" disabled={processing}>Yes, Delete</button>
                            <button onClick={onClose}>Cancel</button>
                        </DialogFooter>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
