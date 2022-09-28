import { AxiosRequestHeaders } from 'axios';
import { RequestHeader } from '../interfaces/redux.interfaces';

export const toAxiosHeaders = (
  headers: RequestHeader[],
): AxiosRequestHeaders => {
  const headersMap: Record<string, string> = {};

  headers.forEach(({ name, value }) => {
    headersMap[name] = value;
  });

  return headersMap;
};

export const toHeadersArray = (axiosHeaders: Record<string, string>) => {
  const headersArray: RequestHeader[] = [];

  Object.entries(axiosHeaders).forEach(([name, value]) => {
    headersArray.push({
      name,
      value,
    });
  });

  return headersArray;
};
