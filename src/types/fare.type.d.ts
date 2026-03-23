interface IFareVehicle {
  ratePerKm: number;
  bookingFee: number;
  baseFee: number;
  minimumFare: number;
}

interface IFareWaitingCharge {
  enabled: boolean;
  gracePeriod: number;
  rate: number;
}

interface IFareSurcharge {
  enabled: boolean;
  value: number;
}

interface IFare {
  _id: string;
  country: string;
  minoGo: IFareVehicle;
  minoXL: IFareVehicle;
  minoMoto: IFareVehicle;
  waitingCharge: IFareWaitingCharge;
  surcharge: IFareSurcharge;
  platformCommissionPercentage: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

type IFareListResponse = IApiListResponse<IFare>;
