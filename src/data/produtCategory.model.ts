export interface IProductCategory {
  id?: number;
  code?: string;
  name?: string;
  productCategoryId?: string;
}

export const defaultValue: Readonly<IProductCategory> = {};
