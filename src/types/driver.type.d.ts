interface IDriverLocation {
  type: string;
  coordinates: [number, number];
}

interface IDriverHomeAddress {
  address: string;
  location: IDriverLocation;
}

interface IDriverProfile {
  _id: string;
  userId: string;
  driverType: string;
  licenseNumber: string;
  licenseExpiryDate: string;
  licenseImage: string;
  socialSecurityNumber: string;
  vehicleBrand: string;
  vehicleModel: string;
  vehicleColor: string;
  vehicleType: string;
  vehicleImages: string[];
  registrationImage: string;
  roadworthinessCertificate: string;
  address: string;
  currentLocation: IDriverLocation;
  approvalStatus: "verified" | "pending" | "rejected";
  rejectionReason: string | null;
  isOnline: boolean;
  isOnRide: boolean;
  totalEarnings: number;
  totalTrips: number;
  walletBalance: number;
  averageRating: number;
  totalReviews: number;
  createdAt: string;
  updatedAt: string;
}

interface IDriver {
  _id: string;
  name: string;
  email: string;
  countryCode: string;
  phoneNumber: string;
  role: string;
  gender: string;
  dateOfBirth: string;
  profileImage: string;
  homeAddress: IDriverHomeAddress;
  adminVerified: "verified" | "pending" | "rejected";
  driverType: string;
  isDriverProfileCompleted: boolean;
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
  driverProfileId: IDriverProfile | null;
  createdAt: string;
  updatedAt: string;
}
