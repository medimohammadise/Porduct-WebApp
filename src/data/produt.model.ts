// import { Moment } from "moment";
export enum Currency {
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
  productCategoryId?: string;
  convertedValue?: number;
  excahngeRate?: number;
}

export const defaultValue: Readonly<IProduct> = {};
