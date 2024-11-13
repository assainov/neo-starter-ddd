import { useUser } from '@/account/_api/queries';

export const useAuth = () => {
  const { isSuccess, data: user, isLoading } = useUser();

  const isAuthenticated = isSuccess && user;
  const isLoggingIn = isLoading;

  return { isAuthenticated, user, isLoggingIn };
};