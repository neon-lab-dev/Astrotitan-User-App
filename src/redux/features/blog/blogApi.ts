import { baseApi } from "../../api/baseApi";

export const blogApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    getBlogs: builder.query({
      query: (params = {}) => {
        const cleanedParams = Object.fromEntries(
          Object.entries({
            keyword: params?.keyword,
            category: params?.category,
            skip: params?.skip ?? 0,
            limit: params?.limit ?? 10,
          }).filter(
            ([_, value]) =>
              value !== undefined && value !== null && value !== "",
          ),
        );

        return {
          url: `/blog`,
          method: "GET",
          params: cleanedParams,
        };
      },


      serializeQueryArgs: ({ endpointName, queryArgs }) => {
        return JSON.stringify({
          endpointName,
          keyword: queryArgs?.keyword,
          category: queryArgs?.category,
        });
      },

      merge: (currentCache, newItems, { arg }) => {
        const incomingBlogs = newItems?.data?.blogs || [];
        if (arg?.skip === 0) {
          currentCache.data = newItems.data;

          return;
        }
        const existingIds = new Set(
          (currentCache?.data?.blogs || []).map((item: any) => item._id),
        );
        const filtered = incomingBlogs.filter(
          (item: any) => !existingIds.has(item._id),
        );
        currentCache.data = {
          ...newItems.data,

          blogs: [...(currentCache?.data?.blogs || []), ...filtered],
        };
      },

      forceRefetch({ currentArg, previousArg }) {
        return JSON.stringify(currentArg) !== JSON.stringify(previousArg);
      },
      providesTags: ["blogs"],
    }),

    /* ---------------- GET BLOG BY ID ---------------- */

    getBlogById: builder.query({
      query: (id) => ({
        url: `/blog/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [
        {
          type: "blogs",
          id,
        },
      ],
    }),
  }),
});

export const {
  useGetBlogsQuery,
  useLazyGetBlogsQuery,
  useGetBlogByIdQuery,
} = blogApi;
