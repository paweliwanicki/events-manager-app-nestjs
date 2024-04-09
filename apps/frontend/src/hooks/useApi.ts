import { useCallback, useState } from "react";
import { HttpMethod } from "../enums/HttpMethods";

export type ResponseStatus = "Success" | "Error" | undefined;

type RequestOptions = {
  path: string;
  payload?: string;
  contentType?: string;
};

export type ResponseParams = {
  statusCode: number;
  message?: string;
};

type ApiService = {
  isFetching: boolean;
  fetch: <T>(
    method: HttpMethod,
    params: RequestOptions
  ) => Promise<[body: T, resParams: ResponseParams]>;
  fetchWithJwt: <T>(
    method: HttpMethod,
    params: RequestOptions
  ) => Promise<[body: T, resParams: ResponseParams]>;
};

const request = async (
  method: HttpMethod,
  params: RequestOptions,
  customHeaders: Record<string, string> | undefined = undefined
): Promise<[body: any, resParams: ResponseParams]> => {
  let body = null;
  const { path, payload, contentType } = params;

  const headers = {
    "Content-Type": contentType ? contentType : "application/json",
    ...customHeaders,
  };

  const response = await fetch(path, {
    method,
    body: payload,
    headers,
  });

  try {
    body = (await response.json()) as ResponseParams;
  } catch {
    console.error("Error while parsing the response :(");
  }

  return [body, { statusCode: response.status, message: response.statusText }];
};

export const setJwtToken = (token: string) => {
  localStorage.setItem("token", token);
};

export const unsetJwtToken = () => {
  localStorage.removeItem("token");
};

export const getJwtToken = () => {
  return localStorage.getItem("token");
};

export const useApi = (): ApiService => {
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const fetch = useCallback(
    async (method: HttpMethod, params: RequestOptions) => {
      setIsFetching(true);
      const response = await request(method, params).finally(() =>
        setIsFetching(false)
      );
      return response;
    },
    []
  );

  const fetchWithJwt = useCallback(
    async (method: HttpMethod, params: RequestOptions) => {
      const token = getJwtToken();
      const headers = { Authorization: `Bearer ${token}` };

      setIsFetching(true);
      const response = await request(method, params, headers).finally(() =>
        setIsFetching(false)
      );
      return response;
    },
    []
  );

  return {
    isFetching,
    fetch,
    fetchWithJwt,
  };
};
