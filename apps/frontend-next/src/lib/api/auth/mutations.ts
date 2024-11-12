import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../client';
import { LoginUserBody, LoginUserResponse, RegisterUserBody, RegisterUserResponse } from '@neo/application/user';

const userQueryKey = [ 'user' ];

export const useLogin = ({ onSuccess }: { onSuccess?: () => void }) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: LoginUserBody) => api.post<LoginUserResponse>('/users/login', data),
    onSuccess: (data) => {
      queryClient.setQueryData(userQueryKey, data);
      onSuccess?.();
    },
  });
};

export const useRegister = ({ onSuccess }: { onSuccess?: () => void }) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: RegisterUserBody) => api.post<RegisterUserResponse>('/users/register', data),
    onSuccess: (data) => {
      queryClient.setQueryData(userQueryKey, data);
      onSuccess?.();
    },
  });
};