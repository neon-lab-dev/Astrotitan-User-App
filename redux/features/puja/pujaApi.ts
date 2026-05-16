import { baseApi } from "@/redux/api/baseApi";

const pujaApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllPujas: builder.query({
            query: ({
                skip,
                limit,
                keyword,
                category,
            }: {
                keyword?: string;
                limit?: number;
                skip?: number;
                category?: string;
            } = {}) => {
                const params = new URLSearchParams();

                if (keyword) params.append("keyword", keyword);
                if (typeof limit === "number") params.append("limit", limit.toString());
                if (typeof skip === "number") params.append("skip", skip.toString());
                if (category) params.append("category", category);

                return {
                    url: `/puja?${params.toString()}`,
                    method: "GET",
                    credentials: "include",
                };
            },
            providesTags: ["puja"],
        }),

        getSinglePujaById: builder.query({
            query: (id) => ({
                url: `/puja/${id}`,
                method: "GET",
                credentials: "include",
            }),
            providesTags: ["puja"],
        }),

        // Review endpoints
        addPujaReview: builder.mutation<any, any>({
            query: ({ id, data }) => ({
                url: `/puja/add-review/${id}`,
                method: "POST",
                body: data,
                credentials: "include",
            }),
            invalidatesTags: ["puja"],
        }),

        updatePujaReview: builder.mutation<any, any>({
            query: ({ pujaId, reviewId, data }) => ({
                url: `/puja/update-review/${pujaId}/${reviewId}`,
                method: "PATCH",
                body: data,
                credentials: "include",
            }),
            invalidatesTags: ["puja"],
        }),

        deletePujaReview: builder.mutation<any, any>({
            query: ({ pujaId, reviewId }) => ({
                url: `/puja/delete-review/${pujaId}/${reviewId}`,
                method: "DELETE",
                credentials: "include",
            }),
            invalidatesTags: ["puja"],
        }),
    }),
});

export const {
    useGetAllPujasQuery,
    useGetSinglePujaByIdQuery,
    useAddPujaReviewMutation,
    useUpdatePujaReviewMutation,
    useDeletePujaReviewMutation,
} = pujaApi;