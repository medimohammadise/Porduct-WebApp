import { useState } from "react";
import { IProduct } from "src/data/produt.model";
import { Service } from "../actions/Service.Actions";
export type Product = IProduct;

const usePostStarshipService = () => {
  const [publishService, setService] = useState<Service<Product>>({
    status: "init"
  });

  const publishProduct = (product: Product, restOperation: string) => {
    setService({ status: "loading" });

    const headers = new Headers();
    headers.append("Content-Type", "application/json; charset=utf-8");

    return new Promise((resolve, reject) => {
      fetch(process.env.REACT_APP_BASE_URL + "/products", {
        method: restOperation,
        body: JSON.stringify(product),
        headers
      })
        .then(response => response.json())
        .then(response => {
          setService({ status: "loaded", payload: response });
          resolve(response);
        })
        .catch(error => {
          setService({ status: "error", error });
          reject(error);
        });
    });
  };

  return {
    publishService,
    publishProduct
  };
};

export default usePostStarshipService;
