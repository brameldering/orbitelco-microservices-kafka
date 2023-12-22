import {
  API_ACCESS_URL,
  IApiAccess,
  IApiAccessCreate,
} from '@orbitelco/common';

import apiSlice from './apiSlice';

export const apiAccessApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createApiAccess: builder.mutation<IApiAccess, IApiAccessCreate>({
      query: (data) => ({
        url: API_ACCESS_URL,
        method: 'POST',
        body: data,
      }),
    }),
    getApiAccessById: builder.query<IApiAccess, string>({
      query: (id) => ({
        url: `${API_ACCESS_URL}/${id}`,
      }),
    }),
    updateApiAccess: builder.mutation<IApiAccess, IApiAccess>({
      query: (data) => ({
        url: `${API_ACCESS_URL}/${data.id}`,
        method: 'PUT',
        body: data,
      }),
    }),
    deleteApiAccess: builder.mutation<void, string>({
      query: (id) => ({
        url: `${API_ACCESS_URL}/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetApiAccessByIdQuery,
  useCreateApiAccessMutation,
  useUpdateApiAccessMutation,
  useDeleteApiAccessMutation,
} = apiAccessApiSlice;