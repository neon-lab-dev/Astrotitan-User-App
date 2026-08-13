import { baseApi } from "../../api/baseApi";

const subscriptionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMySubscription: builder.query({
      query: () => ({
        url: `/subscription/my-subscription`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["subscription"],
    }),

    createRazorpayOrder: builder.mutation({
      query: (data) => ({
        url: "/subscription/create-order",
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["subscription"],
    }),

    purchaseSubscription: builder.mutation({
      query: () => ({
        url: "/subscription/create",
        method: "POST",
        credentials: "include",
      }),
      invalidatesTags: ["subscription"],
    }),

    cancelSubscription: builder.mutation({
      query: (data) => ({
        url: "/subscription/cancel",
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["subscription"],
    }),
  }),
});

export const {
  useGetMySubscriptionQuery,
  useCreateRazorpayOrderMutation,
  usePurchaseSubscriptionMutation,
  useCancelSubscriptionMutation,
} = subscriptionApi;
