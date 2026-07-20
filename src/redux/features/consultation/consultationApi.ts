import { baseApi } from "../../api/baseApi";

const consultationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyConsultationBookings: builder.query({
      query: ({
        limit,
        page,
        skip,
        status,
      }: {
        limit?: number;
        page?: number;
        skip?: number;
        status?: string;
      } = {}) => {
        const params = new URLSearchParams();

        if (status && status !== "All") {
          params.append("status", status);
        }
        if (typeof limit === "number") params.append("limit", limit.toString());
        if (typeof page === "number") params.append("page", page.toString());
        if (typeof skip === "number") params.append("skip", skip.toString());

        return {
          url: `/consultation/my-requests?${params.toString()}`,
          method: "GET",
          credentials: "include",
        };
      },
      providesTags: ["consultation"],
    }),

    getSingleConsultationBookings: builder.query({
      query: () => ({
        url: `/consultation/my-requests`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["consultation"],
    }),

    bookConsultation: builder.mutation({
      query: (data) => ({
        url: "/consultation/request",
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["consultation"],
    }),
    endConsultationSession: builder.mutation({
      query: (id) => ({
        url:`/consultation/end-session/${id}`,
        method: "PATCH",
        credentials: "include",
      }),
      invalidatesTags: ["consultation"],
    }),
    startCall: builder.mutation({
      query: (data) => ({
        url: `/consultation/call/start`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["consultation"],
    }),

    acceptCall: builder.mutation({
      query: (data) => ({
        url: `/consultation/call/accept`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["consultation"],
    }),

    rejectCall: builder.mutation({
      query: (data) => ({
        url: `/consultation/call/reject`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["consultation"],
    }),

    endCall: builder.mutation({
      query: (data) => ({
        url: `/consultation/call/end`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["consultation"],
    }),
  }),
});

export const {
  useGetMyConsultationBookingsQuery,
  useGetSingleConsultationBookingsQuery,
  useBookConsultationMutation,
  useEndConsultationSessionMutation,
  useStartCallMutation,
  useAcceptCallMutation,
  useRejectCallMutation,
  useEndCallMutation,
} = consultationApi;
