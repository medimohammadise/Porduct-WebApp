export interface IProductCategory {
  id?: number;
  code?: string;
  name?: string;
  productCategoryId?: string;
  productCategoryIds?: IProductCategory[];
}

export const defaultValue: Readonly<IProductCategory> = {};
