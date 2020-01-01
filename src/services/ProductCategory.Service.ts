import { useEffect, useState } from "react";
import { Service } from "../actions/Service.Actions";
console.log(process.env.NODE_ENV);
const apiUrl = process.env.REACT_APP_BASE_URL + "/product-categories";
const useProductsService = (sort?: any, page?: any, size?: any) => {
  const [result, setResult] = useState<Service<any>>({
    status: "loading"
  });

  useEffect(() => {
    fetch(apiUrl)
      .then(response => response.json())
      .then(response =>
        setResult({
          status: "loaded",
          payload: response
        })
      )
      .catch(error => setResult({ status: "error", error }));
  }, []);

  return result;
};

export default useProductsService;
