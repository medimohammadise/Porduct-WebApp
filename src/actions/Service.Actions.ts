interface IServiceInit {
  status: "init";
}

interface IServiceLoading {
  status: "loading";
}

interface IServiceLoaded<T> {
  status: "loaded";
  payload: T;
}

interface IServiceError {
  status: "error";
  error: Error;
}

export type Service<T> =
  | IServiceInit
  | IServiceLoading
  | IServiceLoaded<T>
  | IServiceError;

export const enum RestOperation {
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE"
}
