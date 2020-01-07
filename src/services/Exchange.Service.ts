import { useState } from "react";
import { Service } from "../actions/Service.Actions";
import { HttpStatusCode } from "./HttpStatusCodes";

const useExchangeCurrenyService = () => {
  const [publishService, setService] = useState<Service<any>>({
    status: "init"
  });

  const exchangeService = (...pathVariables: any[]) => {
    setService({ status: "loading" });

    const headers = new Headers();
    headers.append("Content-Type", "application/json; charset=utf-8");

    return new Promise((resolve, reject) => {
      fetch(
        process.env.REACT_APP_BASE_URL +
          "/currency-exchange/" +
          (pathVariables.length > 0 ? "/" : "") +
          pathVariables.join("/ "),
        {
          method: "GET",
          headers
        }
      )
        .then(response => {
          if (response.status === HttpStatusCode.Accepted) {
            setService({ status: "loaded", payload: response });
            resolve(response);
          }
        })
        .catch(error => {
          setService({ status: "error", error });
          reject(error);
        });
    });
  };

  return {
    publishService,
    exchangeService
  };
};

export default useExchangeCurrenyService;
