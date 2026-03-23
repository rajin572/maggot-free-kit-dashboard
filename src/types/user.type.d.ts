interface IWarningLog {
  _id: string;
  warnedAt: string;
  warnedBy: string;
  reason?: string;
}

interface IWarnings {
  count: number;
  logs: IWarningLog[];
}

interface IUser {
  _id: string;
  name: string;
  email: string;
  countryCode: string;
  phoneNumber: string;
  role: string;
  gender: string;
  dateOfBirth: string;
  profileImage: string;
  adminVerified: "verified" | "pending" | "rejected";
  rating: number;
  totalReview: number;
  averageRating: number;
  wallet: number;
  status: "active" | "banned" | "inactive";
  warnings: IWarnings;
  banReason: string | null;
  bannedAt: string | null;
  bannedBy: string | null;
  isDeleted: boolean;
  country: string;
  createdAt: string;
  updatedAt: string;
}

type IPassengerListResponse = IApiListResponse<IUser>;
