import { useMutation, useQueryClient } from '@tanstack/react-query';
import { LoginUserBody, LoginUserResponse, LogoutUserResponse, RegisterUserBody, RegisterUserResponse } from '@neo/application/user';
import { api } from '../../_services/api';
import { userQueryKey } from './keys';

export const useLoginMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: LoginUserBody) => api.post<LoginUserResponse>('/users/login', data),
    onSuccess: (data) => {
      queryClient.setQueryData(userQueryKey, data);
    },
  });
};

export const useLogoutMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => api.post<LogoutUserResponse>('/users/logout'),
    onSuccess: () => {
      queryClient.setQueryData(userQueryKey, null);
    },
  });
};

export const useRegisterMutation = ({ onSuccess }: { onSuccess?: () => void }) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: RegisterUserBody) => api.post<RegisterUserResponse>('/users/register', data),
    onSuccess: (data) => {
      queryClient.setQueryData(userQueryKey, data);
      onSuccess?.();
    },
  });
};