import { api } from '@/_services/api';
import { userQueryKey } from './keys';
import { queryOptions, useQuery } from '@tanstack/react-query';
import { UserDetailsResponse } from '@neo/application/user';

export const getUserDetailsQueryOptions = () => queryOptions({
  queryKey: userQueryKey,
  queryFn: async () => await api.getSilently<UserDetailsResponse>('/users/me'),
});

export const useUser = () => useQuery(getUserDetailsQueryOptions());