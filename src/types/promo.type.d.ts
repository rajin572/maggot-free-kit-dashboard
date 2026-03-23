interface IPromo {
  _id: string;
  title: string;
  description: string;
  discount: number;
  minimumSpend: number;
  expirationDate: string;
  status: "ACTIVE" | "INACTIVE";
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

type IPromoListResponse = IApiListResponse<IPromo>;
