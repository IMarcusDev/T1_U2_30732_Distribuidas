import axios from 'axios';

export interface HttpClient {
    get<T>(url: string): Promise<T>;
}

export class AxiosHttpClient implements HttpClient {
    async get<T>(url: string): Promise<T> {
        const response = await axios.get<T>(url);
        return response.data;
    }
}
