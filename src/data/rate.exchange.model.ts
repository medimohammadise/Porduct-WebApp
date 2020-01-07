import { Currency } from "./produt.model";
export interface IExchnageRate {
  success?: boolean;
  historical?: boolean;
  fromCurrency?: Currency;
  toCurrency?: Currency;
  exchangeRate?: number;
  valueToConvert?: number;
  convertedValue?: number;
}

export const defaultValue: Readonly<IExchnageRate> = {};
