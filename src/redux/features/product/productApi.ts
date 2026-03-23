import { baseApi } from "../../api/baseApi";
import { tagTypes } from "../../tagTypes";

const productApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getProduct: build.query({
      query: () => "/product",
      providesTags: [tagTypes.product],
    }),
    updateProduct: build.mutation({
      query: (req) => ({
        url: "/product",
        method: "PATCH",
        body: req.body,
      }),
      invalidatesTags: [tagTypes.product],
    }),
  }),
});

export const { useGetProductQuery, useUpdateProductMutation } = productApi;
export default productApi;
