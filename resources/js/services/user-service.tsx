import { router } from '@inertiajs/react';

 const userService = {
  getUsers: (search: string) => {
    router.get('/users', { search }, { preserveScroll: true });
  },

  createUser: (
    data: { name: string; email: string; password: string; role: string },
    onSuccess: () => void
  ) => {
    router.post('/users', data, {
      onSuccess,
    });
  },

  updateUser: (
    id: number,
    data: { name: string; email: string; password?: string; role?: string },
    onSuccess: () => void
  ) => {
    router.put(`/users/${id}`, data, {
      onSuccess,
    });
  },

  deleteUser: (id: number, onSuccess?: () => void) => {
    router.delete(`/users/${id}`, {
      onSuccess,
    });
  },
};

export default userService;
