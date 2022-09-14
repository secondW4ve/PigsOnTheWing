import axios from 'axios';

class RestService {

  public async doGet<T>(url: string, params: any = {}): Promise<T> {
    const resp = await axios.get(url, {
      params
    });

    return resp ? resp.data : null;
  }
}

export const restService = new RestService()