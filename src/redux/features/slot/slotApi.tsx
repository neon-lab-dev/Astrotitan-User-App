import { baseApi } from "../../api/baseApi";

const slotApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        getAllSlotsByAstrologerId: builder.query({
            query: ({ id, date }) => ({
                url: `/slot/${id}/${date}`,
                method: "GET",
                credentials: "include",
            }),
            providesTags: ["astrologers"],
        }),
    }),
});

export const {
    useGetAllSlotsByAstrologerIdQuery
} = slotApi;