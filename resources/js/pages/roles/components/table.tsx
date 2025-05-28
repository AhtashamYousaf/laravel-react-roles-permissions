import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { router } from '@inertiajs/react';
import { Pencil, Trash2, Eye } from 'lucide-react';
import CommonFunctions from '@/pages/helpers/common';

type Role = {
  id: number;
  name: string;
  created_at: Date;
  updated_at: Date;
  permissions: { id: number; name: string }[];
  user_count: number;
};

interface Props {
    roles: {
    data: Role[];
    current_page: number;
    last_page: number;
    total: number;
    links: {
      url: string | null;
      label: string;
      active: boolean;
    }[];
  },
    onView: (role: Role) => void;
    onEdit: (role: Role) => void;
    onDelete: (role: Role) => void;
}
export default function RoleTable({ roles, onView, onEdit, onDelete }: Props) {
    const { hasPermission } = CommonFunctions();
    return (
        <>
            <div className="bg-background overflow-x-auto rounded-lg border">
                <Table>
                    <TableCaption>A list of all roles.</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[80px]">#</TableHead>
                            <TableHead>Role Name</TableHead>
                            <TableHead className="text-center">Users</TableHead>
                            <TableHead className="text-center">Created At</TableHead>
                            <TableHead className="text-center">Updated At</TableHead>
                            <TableHead className="text-center">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {roles.data.length > 0 ? (
                            roles.data.map((role: Role, index: number) => (
                                <TableRow key={role.id}>
                                    <TableCell className="font-medium">{index + 1 + (roles.current_page - 1) * 10}</TableCell>
                                    <TableCell>{role.name.charAt(0).toUpperCase() + role.name.slice(1)} 
                                        <span className="block text-xs text-muted-foreground">Total Permissions: {role.permissions.length > 0 ? role.permissions.length : 'No Permissions assigned'}</span>
                                    </TableCell>
                                   <TableCell className="text-center">
                                        {role.user_count > 0 ? role.user_count : 'No users assigned'}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {new Date(role.created_at).toLocaleDateString('en-GB', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric',
                                        })}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {new Date(role.updated_at).toLocaleDateString('en-GB', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric',
                                        })}
                                    </TableCell>
                                    <TableCell className="space-x-2 text-center">
                                        <Button size="icon" variant="ghost" onClick={() => onView(role)}>
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                        {hasPermission('role.update') && (
                                            <Button size="icon" variant="ghost" onClick={() => onEdit(role)}>
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                        )}
                                        {hasPermission('role.delete') && (
                                            <Button size="icon" variant="ghost" onClick={() => onDelete(role)}>
                                                <Trash2 className="text-destructive h-4 w-4" />
                                            </Button>
                                        )}
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
                {roles.links.map((link: { url: string | null; label: string; active: boolean }, idx: number) => (
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
