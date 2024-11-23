import { useMutation, useQueryClient } from '@tanstack/react-query';
import { LoginUserBody, LoginUserResponse, LogoutUserResponse, RegisterUserBody, RegisterUserResponse, UserDetailsResponse } from '@neo/application/auth';
import { api } from '../../_services/api';
import { userQueryKey } from './keys';

export const useLoginMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: LoginUserBody) => api.post<LoginUserResponse>('/auth/login', data),
    onSuccess: (data) => {
      queryClient.setQueryData<UserDetailsResponse>(userQueryKey, data.user);
    },
  });
};

export const useLogoutMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => api.post<LogoutUserResponse>('/auth/logout', null),
    onSuccess: () => {
      queryClient.setQueryData(userQueryKey, null);
    },
  });
};

export const useRegisterMutation = ({ onSuccess }: { onSuccess?: () => void }) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: RegisterUserBody) => api.post<RegisterUserResponse>('/auth/register', data),
    onSuccess: (data) => {
      queryClient.setQueryData(userQueryKey, data);
      onSuccess?.();
    },
  });
};