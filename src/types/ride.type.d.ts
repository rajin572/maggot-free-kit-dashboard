interface IRidePassenger {
    _id: string;
    name: string;
    profileImage: string;
}

interface IRideDriver {
    _id: string;
}

interface IRideLocation {
    location: {
        type: string;
        coordinates: [number, number];
    };
    address: string;
}

interface IRideStatusHistory {
    _id: string;
    status: string;
    changedAt: string;
}

interface IRideReview {
    rating: number;
    comment: string;
    givenAt: string;
}

interface IRide {
    _id: string;
    rideId: string;
    country: string;
    passenger: IRidePassenger;
    driver: IRideDriver;
    serviceType: string;
    vehicleCategory: string;
    pickupLocation: IRideLocation;
    dropoffLocation: IRideLocation;
    actualDropoffLocation: IRideLocation | null;
    status: string;
    paymentMethod: string;
    paymentStatus: string;
    distanceKm: number;
    durationMin: number;
    estimatedFare: number;
    totalFare: number;
    driverEarning: number;
    adminCommission: number;
    promoDiscount: number;
    tip: number;
    pickupType: string;
    scheduledAt: string | null;
    parcelDetails: unknown | null;
    driverAcceptedAt: string | null;
    statusHistory: IRideStatusHistory[];
    isDeleted: boolean;
    cancellations: unknown[];
    createdAt: string;
    updatedAt: string;
    isDriverReviewed: boolean;
    isPassengerReviewed: boolean;
    passengerReview: IRideReview | null;
    driverReview: IRideReview | null;
}
