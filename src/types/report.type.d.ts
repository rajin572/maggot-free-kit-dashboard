interface IReportRide {
  _id: string;
  status: string;
  rideId: string;
}

interface IReportUser {
  _id: string;
  name: string;
  email?: string;
  role: string;
  profileImage: string;
}

interface IReport {
  _id: string;
  rideId: IReportRide;
  reportedBy: IReportUser;
  reportedUser: IReportUser;
  reason: string;
  details: string;
  status: "pending" | "resolved";
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

type IReportListResponse = IApiListResponse<IReport>;
