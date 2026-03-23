import { baseApi } from "../../api/baseApi";
import { tagTypes } from "../../tagTypes";

const analyticsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getDashboardCards: build.query({
      query: () => "/analytics/dashboard-cards",
      providesTags: [tagTypes.analytics],
    }),
    getVisitsAndOrders: build.query({
      query: (year) => `/analytics/visits-orders-monthly?year=${year}`,
      providesTags: [tagTypes.analytics],
    }),
    getOrdersByMonth: build.query({
      query: (year) => `/analytics/orders-monthly?year=${year}`,
      providesTags: [tagTypes.analytics],
    }),
    getOrderStatusDistribution: build.query({
      query: () => "/analytics/order-status-distribution",
      providesTags: [tagTypes.analytics],
    }),
    getOrdersByDistrict: build.query({
      query: (year?) => `/analytics/orders-by-district${year ? `?year=${year}` : ""}`,
      providesTags: [tagTypes.analytics],
    }),
    getRevenueByMonth: build.query({
      query: (year) => `/analytics/revenue-monthly?year=${year}`,
      providesTags: [tagTypes.analytics],
    }),
    getRevenueStats: build.query({
      query: () => "/analytics/revenue-stats",
      providesTags: [tagTypes.analytics],
    }),
  }),
});

export const {
  useGetDashboardCardsQuery,
  useGetVisitsAndOrdersQuery,
  useGetOrdersByMonthQuery,
  useGetOrderStatusDistributionQuery,
  useGetOrdersByDistrictQuery,
  useGetRevenueByMonthQuery,
  useGetRevenueStatsQuery,
} = analyticsApi;
export default analyticsApi;
