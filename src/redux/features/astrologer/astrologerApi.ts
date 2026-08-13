import { baseApi } from "../../api/baseApi";


export const astrologerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAstrologers: builder.query({
      query: (params) => {
        const cleanedParams = Object.fromEntries(
          Object.entries({
            keyword: params?.keyword,
            isIdentityVerified: params?.isIdentityVerified,
            country: params?.country,
            gender: params?.gender,
            skip: params?.skip ?? 0,
            limit: params?.limit ?? 10,
            areaOfPractice: params?.areaOfPractice,
            consultLanguages: params?.consultLanguages,
          }).filter(
            ([_, value]) =>
              value !== undefined && value !== null && value !== "",
          ),
        );

        return {
          url: `/astrologer`,
          method: "GET",
          params: cleanedParams,
        };
      },

      serializeQueryArgs: ({ endpointName, queryArgs }) => {
        return JSON.stringify({
          endpointName,
          keyword: queryArgs?.keyword,
          country: queryArgs?.country,
          gender: queryArgs?.gender,
          areaOfPractice: queryArgs?.areaOfPractice,
          consultLanguages: queryArgs?.consultLanguages,
          isIdentityVerified: queryArgs?.isIdentityVerified,
        });
      },

      merge: (currentCache, newItems, { arg }) => {
        if (arg?.skip === 0) {
          currentCache.data = newItems.data;

          return;
        }
        const existingIds = new Set(
          currentCache.data.map((item: any) => item._id),
        );
        const filtered = newItems.data.filter(
          (item: any) => !existingIds.has(item._id),
        );
        currentCache.data = [...currentCache.data, ...filtered];
      },

      forceRefetch({ currentArg, previousArg }) {
        return JSON.stringify(currentArg) !== JSON.stringify(previousArg);
      },

      providesTags: ["astrologers"],
    }),

    getAstrologerById: builder.query({
      query: (id) => ({
        url: `/astrologer/${id}`,
        method: "GET",
      }),

      providesTags: (result, error, id) => [
        {
          type: "astrologers",
          id,
        },
      ],
    }),
  }),
});

export const {
  useGetAstrologersQuery,
  useLazyGetAstrologersQuery,
  useGetAstrologerByIdQuery,
} = astrologerApi;
