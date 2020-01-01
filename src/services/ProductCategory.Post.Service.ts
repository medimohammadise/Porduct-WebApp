import { useState } from "react";
import { IProductCategory } from "src/data/produtCategory.model";
import { Service } from "../actions/Service.Actions";
import { HttpStatusCode } from "./HttpStatusCodes";
export type Product = IProductCategory;

const usePostProductCategoryService = () => {
  const [publishService, setService] = useState<Service<Product>>({
    status: "init"
  });

  const publishProductCategory = (
    restOperation: string,
    product?: Product,
    ...pathVariables: any[]
  ) => {
    setService({ status: "loading" });

    const headers = new Headers();
    headers.append("Content-Type", "application/json; charset=utf-8");

    return new Promise((resolve, reject) => {
      fetch(
        process.env.REACT_APP_BASE_URL +
          "/product-categories" +
          (pathVariables.length > 0 ? "/" : "") +
          pathVariables.join("/ "),
        {
          method: restOperation,
          body: JSON.stringify(product),
          headers
        }
      )
        .then(response =>
          response.status !== HttpStatusCode.NoContent
            ? response.json()
            : response
        )
        .then(response => {
          console.log(response);
          setService({ status: "loaded", payload: response });
          resolve(response);
        })
        .catch(error => {
          console.log(error);
          setService({ status: "error", error });
          reject(error);
        });
    });
  };

  return {
    publishService,
    publishProductCategory
  };
};

export default usePostProductCategoryService;
