interface IPaymentPassenger {
    _id: string;
    name: string;
    phoneNumber: string;
    profileImage: string;
}

interface IPayment {
    _id: string;
    rideId: string;
    passengerId: IPaymentPassenger;
    driverId: string;
    totalFare: number;
    amount: number;
    tip: number;
    promo: string | null;
    promoDiscount: number;
    paymentMethod: string;
    paymentStatus: string;
    stripePaymentIntentId: string;
    transactionId: string;
    adminCommission: number;
    driverEarning: number;
    estimatedFare: number;
    paidAt: string;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
}
