import { baseApi } from "./baseApi";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Auth"],
    }),
    register: builder.mutation({
      query: (body) => ({
        url: "/auth/register",
        method: "POST",
        body,
      }),
    }),
    getCurrentUser: builder.query({
      query: () => "/auth/current-user",
      providesTags: ["Auth"],
    }),
    updateCurrentUser: builder.mutation({
      query: (body) => ({
        url: "/auth/current-user",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Auth"],
    }),
    changeCurrentPassword: builder.mutation({
      query: (body) => ({
        url: "/auth/change-password",
        method: "POST",
        body,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["Auth"],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetCurrentUserQuery,
  useUpdateCurrentUserMutation,
  useChangeCurrentPasswordMutation,
  useLogoutMutation,
} = authApi;
