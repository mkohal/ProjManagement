import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { clearCredentials, setCredentials } from "../features/auth/authSlice";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1",
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.accessToken;

    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

const baseQueryWithAuthHandling = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    const refreshResult = await rawBaseQuery(
      {
        url: "/auth/refresh-token",
        method: "POST",
      },
      api,
      extraOptions,
    );

    const refreshPayload = refreshResult?.data?.data;

    if (refreshPayload?.accessToken) {
      api.dispatch(
        setCredentials({
          user: api.getState().auth.user,
          accessToken: refreshPayload.accessToken,
          refreshToken: refreshPayload.refreshToken ?? null,
        }),
      );

      result = await rawBaseQuery(args, api, extraOptions);
    } else {
      api.dispatch(clearCredentials());
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithAuthHandling,
  tagTypes: [
    "Auth",
    "Project",
    "ProjectMembers",
    "Task",
    "TaskList",
    "Subtask",
    "SubtaskList",
    "Conversation",
    "Message",
  ],
  endpoints: () => ({}),
});
