import axios from 'axios';
import { CALL_TIMEOUT } from '../constants/rest.constants';
import { RequestMethods } from '../generated/graphql';
import { toAxiosHeaders } from '../helpers/headers-array-to-object';
import { RequestHeader } from '../interfaces/redux.interfaces';

class RestCallService {
  public async doCall(
    method: RequestMethods,
    url: string,
    headers: RequestHeader[] = [],
    body?: string,
  ): Promise<any> {
    console.log({
      method,
      url,
      headers: toAxiosHeaders(headers),
      data: body,
      timeout: CALL_TIMEOUT,
    });
    const resp = await axios.request({
      method,
      url,
      headers: toAxiosHeaders(headers),
      data: body,
      timeout: CALL_TIMEOUT,
    });

    return resp || null;
  }
}

export const restCallService = new RestCallService();
