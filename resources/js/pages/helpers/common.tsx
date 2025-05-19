import { usePage } from '@inertiajs/react';
import { type SharedData } from '@/types';

export default function CommonFunctions() {

  const { auth } = usePage<SharedData>().props;
  const permissions: string[] = auth?.permissions ?? [];

  const hasPermission = (perm: string): boolean => permissions.includes(perm);

  return {
    hasPermission,
  };
}
