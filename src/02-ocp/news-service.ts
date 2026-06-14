import { Result } from '../shared/result';
import { retry } from '../shared/retry';
import { HttpClient } from './http-client';

export interface NewsItem {
    id: number;
    title: string;
    body: string;
}

export class NewsService {

    constructor(private readonly httpClient: HttpClient) {}

    async getLatestNews(): Promise<Result<NewsItem[], Error>> {
        console.log('Obteniendo noticias de la reserva...');
        return retry(() => this.httpClient.get<NewsItem[]>('https://jsonplaceholder.typicode.com/posts'));
    }
}
