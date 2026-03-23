import { baseApi } from "../../api/baseApi";
import { tagTypes } from "../../tagTypes";

const adminApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAdmins: build.query({
      query: () => "/admins",
      providesTags: [tagTypes.admin],
    }),
    addAdmin: build.mutation({
      query: (req) => ({
        url: "/admins",
        method: "POST",
        body: req.body,
      }),
      invalidatesTags: [tagTypes.admin],
    }),
    removeAdmin: build.mutation({
      query: (req) => ({
        url: `/admins/${req.body.id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.admin],
    }),
  }),
});

export const {
  useGetAdminsQuery,
  useAddAdminMutation,
  useRemoveAdminMutation,
} = adminApi;
export default adminApi;
