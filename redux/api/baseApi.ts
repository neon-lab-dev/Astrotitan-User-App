import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { clearAuth, setAuth } from "../features/auth/authSlice";
import { RootState } from "../store";

const baseQuery = fetchBaseQuery({
  baseUrl: "https://astrotitan-server.onrender.com/api/v1",
  // baseUrl: "http://localhost:5000/api/v1",
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set("authorization", `${token}`);
    }
    return headers;
  },
});

const baseQueryWithRefreshToken: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    try {
      const res = await fetch(
        "https://astrotitan-server.onrender.com/api/v1/auth/refresh-token",
        {
          method: "POST",
          credentials: "include",
        },
      );

      const data = await res.json();
      if (data?.data?.accessToken) {
        const user = (api.getState() as RootState).auth.user;
        api.dispatch(
          setAuth({
            user,
            token: data.data.accessToken,
          }),
        );
        // Retry the original query with new token
        result = await baseQuery(args, api, extraOptions);
      }
    } catch (error) {
      console.warn("Session expired, logging out user...");
      api.dispatch(clearAuth());
      if (typeof window !== "undefined") {
        window.location.href = "/auth";
      }
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithRefreshToken,
  tagTypes: [
    "users",
    "astrologers",
    "notification",
    "blogs",
    "queries",
    "address",
    "product",
    "puja",
    "category",
    "productCheckout",
  ],
  endpoints: () => ({}),
});
