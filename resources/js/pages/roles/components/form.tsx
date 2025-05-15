import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type RoleFormProps = {
  type: 'create' | 'edit';
  data: {
    name: string;
    permissions: number[];
  };
  onChange: (key: string, value: string) => void;  // renamed to onChange
  errors: Record<string, string>;
  processing: boolean;
  permissions: {
    id: number;
    name: string;
  }[];
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
  togglePermission: (id: number) => void;  // added togglePermission prop
};

export default function RoleForm({
  type,
  data,
  onChange,
  errors,
  processing,
  permissions,
  onSubmit,
  onClose,
  togglePermission,
}: RoleFormProps) {

  return (
    <form onSubmit={onSubmit} className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="name" className="text-right">Name</Label>
        <Input
          id="name"
          value={data.name}
          onChange={(e) => onChange('name', e.target.value)}
          className="col-span-3"
          required
          autoComplete="off"
        />
      </div>
      {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

      <div>
        <Label className="mb-2 block">Assign Permissions</Label>
        <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border p-2 rounded">
          {permissions.map((perm) => (
            <label key={perm.id} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={data.permissions.includes(perm.id)}
                onChange={() => togglePermission(perm.id)}
              />
              {perm.name}
            </label>
          ))}
        </div>
        {errors.permissions && <p className="text-red-500 text-sm">{errors.permissions}</p>}
      </div>

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
