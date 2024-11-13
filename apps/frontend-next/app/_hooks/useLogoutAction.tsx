import { useLogoutMutation } from '../account/_api/mutations';
import { useRouter } from 'next/navigation';
import { ROUTE } from '@/_config/routes';
import { useNotifications } from '@/_shared/notifications';

export const useLogout = () => {
  const logoutMutation = useLogoutMutation();
  const router = useRouter();
  const addNotification = useNotifications(n => n.addNotification);

  const logout = async () => {
    await logoutMutation.mutateAsync();
    addNotification({
      type: 'success',
      title: 'Logged out',
      message: 'You have been logged out successfully.',
    });

    router.push(ROUTE.Home);

  };

  return logout;
};
