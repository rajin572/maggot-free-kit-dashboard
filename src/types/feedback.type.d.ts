interface IFeedbackUser {
  _id: string;
  name: string;
  role: string;
  profileImage: string;
}

interface IFeedback {
  _id: string;
  userId: IFeedbackUser;
  rating: number;
  text: string;
  adminVerified: "verified" | "pending" | "rejected";
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

type IFeedbackResponse = IApiResponse<IFeedback>;
