import { baseApi } from "../../api/baseApi";

type JoinConsultationResponse = {
  provider: "zoom_video_sdk";
  sessionName: string;
  sessionPassword?: string;
  token: string;
  userName: string;
  consultationId: string;
  scheduledAt?: string;
  role: "user" | "astrologer";
};

const consultationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get my consultation requests - User
    getMyConsultationRequestsBookings: builder.query({
      query: ({
        limit,
        page,
        skip,
        status,
        method,
        date,
      }: {
        limit?: number;
        page?: number;
        skip?: number;
        status?: string;
        method?: string;
        date?: string;
      } = {}) => {
        const params = new URLSearchParams();

        if (status && status !== "All") {
          params.append("status", status);
        }

        if (method && method !== "All") {
          params.append("method", method);
        }

        if (date) {
          params.append("date", date);
        }

        if (typeof limit === "number") {
          params.append("limit", limit.toString());
        }

        if (typeof page === "number") {
          params.append("page", page.toString());
        }

        if (typeof skip === "number") {
          params.append("skip", skip.toString());
        }

        return {
          url: `/consultation/my-requests?${params.toString()}`,
          method: "GET",
          credentials: "include",
        };
      },
      providesTags: ["consultation"],
    }),

    // Get single consultation
    getSingleConsultationBookings: builder.query({
      query: (id: string) => ({
        url: `/consultation/${id}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["consultation"],
    }),

    // Book consultation
    bookConsultation: builder.mutation({
      query: (data) => ({
        url: "/consultation/request",
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["consultation"],
    }),

    // Change consultation status - Astrologer
    changeConsultationStatus: builder.mutation({
      query: ({
        consultationId,
        status,
      }: {
        consultationId: string;
        status: "scheduled";
      }) => ({
        url: `/consultation/change-status/${consultationId}`,
        method: "PATCH",
        body: {
          status,
        },
        credentials: "include",
      }),
      invalidatesTags: ["consultation"],
    }),

    // Schedule consultation - Astrologer
    scheduleConsultation: builder.mutation({
      query: (consultationId: string) => ({
        url: `/consultation/schedule/${consultationId}`,
        method: "POST",
        credentials: "include",
      }),
      invalidatesTags: ["consultation"],
    }),

    // Join Zoom consultation
    joinConsultation: builder.query<
  JoinConsultationResponse,
  string
>({
  query: (consultationId) => ({
    url: `/consultation/join/${consultationId}`,
    method: "GET",
    credentials: "include",
  }),
  transformResponse: (response: any) => {
    return response?.data?.data ?? response?.data ?? response;
  },
  providesTags: (_result, _error, consultationId) => [
    {
      type: "consultation",
      id: consultationId,
    },
  ],
}),

    // Start consultation - Astrologer
    startConsultation: builder.mutation({
      query: (consultationId: string) => ({
        url: `/consultation/start/${consultationId}`,
        method: "PATCH",
        credentials: "include",
      }),
      invalidatesTags: ["consultation"],
    }),

    // End consultation session
    endConsultationSession: builder.mutation({
      query: (consultationId: string) => ({
        url: `/consultation/end-session/${consultationId}`,
        method: "PATCH",
        credentials: "include",
      }),
      invalidatesTags: ["consultation"],
    }),

    // Send reschedule request - User
    sendRescheduleRequest: builder.mutation({
      query: ({
        consultationId,
        requestedTime,
        reason,
      }: {
        consultationId: string;
        requestedTime: string;
        reason: string;
      }) => ({
        url: `/consultation/send-reschedule-request/${consultationId}`,
        method: "POST",
        body: {
          requestedTime,
          reason,
        },
        credentials: "include",
      }),
      invalidatesTags: ["consultation"],
    }),

    // Handle reschedule request - Astrologer
    rescheduleConsultation: builder.mutation({
      query: ({
        consultationId,
        action,
      }: {
        consultationId: string;
        action: "accept" | "reject";
      }) => ({
        url: `/consultation/reschedule/${consultationId}`,
        method: "PATCH",
        body: {
          action,
        },
        credentials: "include",
      }),
      invalidatesTags: ["consultation"],
    }),

    // Add review - User
    addConsultationReview: builder.mutation({
      query: ({
        consultationId,
        review,
        rating,
      }: {
        consultationId: string;
        review: string;
        rating: number;
      }) => ({
        url: `/consultation/review/add/${consultationId}`,
        method: "POST",
        body: {
          review,
          rating,
        },
        credentials: "include",
      }),
      invalidatesTags: ["consultation"],
    }),

    // Add recommendations - Astrologer
    addRecommendations: builder.mutation({
      query: ({
        consultationId,
        recommendations,
      }: {
        consultationId: string;
        recommendations: string;
      }) => ({
        url: `/consultation/add-recommendations/${consultationId}`,
        method: "POST",
        body: {
          recommendations,
        },
        credentials: "include",
      }),
      invalidatesTags: ["consultation"],
    }),

    addReview: builder.mutation({
      query: ({ id, data }) => ({
        url: `/consultation/review/add/${id}`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["consultation"],
    }),
  }),
});

export const {
  useGetMyConsultationRequestsBookingsQuery,
  useGetSingleConsultationBookingsQuery,
  useBookConsultationMutation,
  useChangeConsultationStatusMutation,
  useScheduleConsultationMutation,
  useJoinConsultationQuery,
  useLazyJoinConsultationQuery,
  useStartConsultationMutation,
  useEndConsultationSessionMutation,
  useSendRescheduleRequestMutation,
  useRescheduleConsultationMutation,
  useAddConsultationReviewMutation,
  useAddRecommendationsMutation,
   useAddReviewMutation,
} = consultationApi;