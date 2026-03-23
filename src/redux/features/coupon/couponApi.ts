import { baseApi } from "../../api/baseApi";
import { tagTypes } from "../../tagTypes";

const couponApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getCoupons: build.query({
      query: (params?: { page?: number; limit?: number }) => ({
        url: "/coupons",
        params,
      }),
      providesTags: [tagTypes.coupon],
    }),
    createCoupon: build.mutation({
      query: (req) => ({
        url: "/coupons",
        method: "POST",
        body: req.body,
      }),
      invalidatesTags: [tagTypes.coupon],
    }),
    toggleCoupon: build.mutation({
      query: (req) => ({
        url: `/coupons/${req.body.id}/toggle`,
        method: "PATCH",
      }),
      invalidatesTags: [tagTypes.coupon],
    }),
    deleteCoupon: build.mutation({
      query: (req) => ({
        url: `/coupons/${req.body.id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.coupon],
    }),
  }),
});

export const {
  useGetCouponsQuery,
  useCreateCouponMutation,
  useToggleCouponMutation,
  useDeleteCouponMutation,
} = couponApi;
export default couponApi;
