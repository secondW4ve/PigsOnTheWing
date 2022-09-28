import { RequestMethods } from '../generated/graphql';

export interface RequestDataState {
  requestInfo: RequestInfoState;
}

export interface RequestInfoState {
  id: string | null;
  name: string;
  description?: string;
  method: RequestMethods;
  url: string;
  body?: string;
  headers: RequestHeader[];
  loading: boolean;
}

export interface ResponseInfoState {
  body: string;
  status: number | null;
  headers: RequestHeader[];
  fetching: boolean;
}

export interface RequestHeader {
  name: string;
  value: string;
}
