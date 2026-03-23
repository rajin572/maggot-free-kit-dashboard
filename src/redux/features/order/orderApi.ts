import { baseApi } from "../../api/baseApi";
import { tagTypes } from "../../tagTypes";

const orderApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getOrders: build.query({
      query: (params) => ({
        url: "/orders",
        params,
      }),
      providesTags: [tagTypes.order],
    }),
    updateOrderStatus: build.mutation({
      query: (req) => ({
        url: `/orders/${req.body.id}`,
        method: "PATCH",
        body: { status: req.body.status, ...(req.body.reason ? { reason: req.body.reason } : {}) },
      }),
      invalidatesTags: [tagTypes.order, tagTypes.analytics],
    }),
    deleteOrder: build.mutation({
      query: (req) => ({
        url: `/orders/${req.body.id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.order, tagTypes.analytics],
    }),
    trackOrderById: build.query({
      query: ({ id, t }) => ({
        url: `/orders/track`,
        params: { id, t },
      }),
    }),
    adminTrackOrder: build.query({
      query: (id) => ({
        url: `/orders/admin-track`,
        params: { id },
      }),
    }),
  }),
});

export const {
  useGetOrdersQuery,
  useUpdateOrderStatusMutation,
  useDeleteOrderMutation,
  useLazyTrackOrderByIdQuery,
  useLazyAdminTrackOrderQuery,
} = orderApi;
export default orderApi;
