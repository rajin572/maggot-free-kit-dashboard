interface IRecentUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  profileImage: string;
  status: string;
  createdAt: string;
}

interface IDashboardStatistics {
  totalUsers: number;
  totalPassengers: number;
  totalDrivers: number;
  totalEarnings: number;
  recentUsers: IRecentUser[];
}

interface IStatisticsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: IDashboardStatistics;
}

interface IMonthlyCount {
  month: number;
  count: number;
}

interface IMonthlyUsersResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    year: number;
    role: string;
    months: IMonthlyCount[];
  };
}

interface IMonthlyEarning {
  month: number;
  totalRevenue: number;
  adminCommission: number;
  driverEarning: number;
  totalTips: number;
  totalRides: number;
}

interface IYearlyEarningsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    year: number;
    months: IMonthlyEarning[];
  };
}
