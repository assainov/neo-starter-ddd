import { api } from '@/_services/api';
import { userQueryKey } from './keys';
import { queryOptions, useQuery } from '@tanstack/react-query';
import { UserDetailsResponse } from '@neo/application/auth';

export const getUserDetailsQueryOptions = () => queryOptions({
  queryKey: userQueryKey,
  queryFn: async () => await api.getSilently<UserDetailsResponse>('/auth/my-profile'),
});

export const useUserDetails = () => useQuery(getUserDetailsQueryOptions());