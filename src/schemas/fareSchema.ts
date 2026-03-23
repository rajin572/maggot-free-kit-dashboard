import { z } from "zod";

const vehicleSchema = z.object({
  ratePerKm: z.coerce.number().min(0, "Required"),
  bookingFee: z.coerce.number().min(0, "Required"),
  baseFee: z.coerce.number().min(0, "Required"),
  minimumFare: z.coerce.number().min(0, "Required"),
});

export const fareSchema = z.object({
  country: z.string().min(1, "Country is required"),
  minoGo: vehicleSchema,
  minoXL: vehicleSchema,
  minoMoto: vehicleSchema,
  waitingCharge: z.object({
    enabled: z.boolean(),
    gracePeriod: z.coerce.number().min(0),
    rate: z.coerce.number().min(0),
  }).superRefine((data, ctx) => {
    if (data.enabled) {
      if (!data.gracePeriod && data.gracePeriod !== 0)
        ctx.addIssue({ code: "custom", message: "Required", path: ["gracePeriod"] });
      if (data.rate <= 0)
        ctx.addIssue({ code: "custom", message: "Must be greater than 0", path: ["rate"] });
    }
  }),
  surcharge: z.object({
    enabled: z.boolean(),
    value: z.coerce.number().min(0),
  }).superRefine((data, ctx) => {
    if (data.enabled && data.value <= 0)
      ctx.addIssue({ code: "custom", message: "Must be greater than 0", path: ["value"] });
  }),
  platformCommissionPercentage: z.coerce.number().min(0).max(100),
});

type VehicleValues = {
  ratePerKm: number;
  bookingFee: number;
  baseFee: number;
  minimumFare: number;
};

export type FareFormValues = {
  country: string;
  minoGo: VehicleValues;
  minoXL: VehicleValues;
  minoMoto: VehicleValues;
  waitingCharge: { enabled: boolean; gracePeriod: number; rate: number };
  surcharge: { enabled: boolean; value: number };
  platformCommissionPercentage: number;
};

export const fareDefaultValues: FareFormValues = {
  country: "",
  minoGo: { ratePerKm: 0, bookingFee: 0, baseFee: 0, minimumFare: 0 },
  minoXL: { ratePerKm: 0, bookingFee: 0, baseFee: 0, minimumFare: 0 },
  minoMoto: { ratePerKm: 0, bookingFee: 0, baseFee: 0, minimumFare: 0 },
  waitingCharge: { enabled: false, gracePeriod: 0, rate: 0 },
  surcharge: { enabled: false, value: 0 },
  platformCommissionPercentage: 0,
};
