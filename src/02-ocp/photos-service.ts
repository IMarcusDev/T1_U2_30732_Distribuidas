import { Result } from '../shared/result';
import { retry } from '../shared/retry';
import { HttpClient } from './http-client';

export interface Photo {
    id: number;
    title: string;
    url: string;
    thumbnailUrl: string;
}

export class PhotosService {

    constructor(private readonly httpClient: HttpClient) {}

    async getGallery(): Promise<Result<Photo[], Error>> {
        console.log('Obteniendo galería de fotos de la reserva...');
        return retry(() => this.httpClient.get<Photo[]>('https://jsonplaceholder.typicode.com/photos'));
    }
}
