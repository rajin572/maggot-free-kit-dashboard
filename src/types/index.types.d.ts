interface IMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

/**
 * Generic API response type.
 *
 * @template TResult  - The type of each item in `data.result`
 * @template TExtra   - Additional fields to merge into `data` (optional)
 *
 * @example Basic usage
 * type IFeedbackResponse = IApiResponse<IFeedback>;
 *
 * @example With extra fields in data
 * type IOrderResponse = IApiResponse<IOrder, { summary: string }>;
 */

interface IApiResponse<TResult, TExtra = Record<never, never>> {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    meta: IMeta;
    result: TResult[];
  } & TExtra;
}

/**
 * Flat list response — meta at root level, data is the array directly.
 *
 * @example
 * type IPromoListResponse = IApiListResponse<IPromo>;
 * // response.meta.total, response.data[0]
 */
interface IApiListResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  meta: IMeta;
  data: T[];
}
