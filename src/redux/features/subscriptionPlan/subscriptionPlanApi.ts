import { baseApi } from "../../api/baseApi";


const subscriptionPlanApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllSubscriptionPlans: builder.query<
            any,
            {
                skip?: number;
                page?: number;
                limit?: number;
            }
        >({
            query: ({
                page = 1,
                limit = 10,
                skip,
            } = {}) => {
                const params = new URLSearchParams();
                params.append("page", page.toString());
                params.append("limit", limit.toString());
                if (typeof skip === "number") params.append("skip", skip.toString());

                return {
                    url: `/subscription-plan?${params.toString()}`,
                    method: "GET",
                    credentials: "include",
                };
            },
            providesTags: ["subscriptionPlan"],
        }),
    }),
});

export const {
    useGetAllSubscriptionPlansQuery,
} = subscriptionPlanApi;
