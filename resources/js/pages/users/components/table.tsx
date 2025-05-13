import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { router } from '@inertiajs/react';
import { Pencil, Trash2 } from 'lucide-react';
export default function UserTable({ users, onEdit, onDelete }: any) {
    return (
        <>
            <div className="bg-background overflow-x-auto rounded-lg border">
                <Table>
                    <TableCaption>A list of all users.</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[80px]">#</TableHead>
                            <TableHead>User Name</TableHead>
                            <TableHead className="text-center">Email</TableHead>
                            <TableHead className="text-center">Role</TableHead>
                            <TableHead className="text-center">Created At</TableHead>
                            <TableHead className="text-center">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.data.length > 0 ? (
                            users.data.map((user: any, index: number) => (
                                <TableRow key={user.id}>
                                    <TableCell className="font-medium">{index + 1 + (users.current_page - 1) * 10}</TableCell>
                                    <TableCell>{user.name}</TableCell>
                                    <TableCell className="text-center">{user.email}</TableCell>
                                    <TableCell className="text-center">
                                        {user.roles.map((role: any) => role.name.charAt(0).toUpperCase() + role.name.slice(1))}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {new Date(user.created_at).toLocaleDateString('en-GB', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric',
                                        })}
                                    </TableCell>

                                    <TableCell className="space-x-2 text-center">
                                        <Button size="icon" variant="ghost" onClick={() => onEdit(user)}>
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button size="icon" variant="ghost" onClick={() => onDelete(user)}>
                                            <Trash2 className="text-destructive h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={3} className="text-muted-foreground py-4 text-center">
                                    No roles found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
                {users.links.map((link: any, idx: number) => (
                    <Button
                        key={idx}
                        variant={link.active ? 'default' : 'outline'}
                        onClick={() => link.url && router.get(link.url)}
                        disabled={!link.url}
                        size="sm"
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                ))}
            </div>
        </>
    );
}
