import { baseApi } from "../../api/baseApi";

const kundliRequestApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getMyKundliRequests: builder.query({
            query: ({
                keyword,
                page,
            }: {
                keyword?: string;
                page?: number;
            }) => {
                const params = new URLSearchParams();

                if (keyword) params.append("keyword", keyword);
                if (page) params.append("page", page.toString());

                return {
                    url: `/kundli-request/my-requests${params.toString() ? `?${params.toString()}` : ""}`,
                    method: "GET",
                    credentials: "include",
                };
            },
            providesTags: ["kundliRequest"],
        }),

        getSingleKundliRequest: builder.query({
            query: (id) => ({
                url: `/kundli-request/${id}`,
                method: "GET",
                credentials: "include",
            }),
            providesTags: ["kundliRequest"],
        }),

        sendKundliRequest: builder.mutation({
            query: (data) => ({
                url: `/kundli-request`,
                method: "POST",
                body: data,
                credentials: "include",
            }),
            invalidatesTags: ["kundliRequest"],
        }),
    }),
});

export const {
    useGetMyKundliRequestsQuery,
    useGetSingleKundliRequestQuery,
    useSendKundliRequestMutation,
} = kundliRequestApi;