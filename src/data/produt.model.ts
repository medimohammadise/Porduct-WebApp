// import { Moment } from "moment";
export const enum Currency {
  EUR = "EUR",
  USD = "USD",
  AUD = "AUD",
  CAD = "CAD"
}

export interface IProduct {
  id?: number;
  code?: string;
  description?: string;
  price?: number;
  currency?: Currency;
  // createdAt?: Moment;
  productCategoryId?: number;
}

export const defaultValue: Readonly<IProduct> = {};
