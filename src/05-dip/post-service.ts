import { Result, ok, err } from '../shared/result';
import { DatabaseProvider, Post } from '../data/local-database';

export class PostService {

    constructor(
        private readonly primaryProvider: DatabaseProvider,
        private readonly fallbackProvider: DatabaseProvider,
    ) {}

    async getPosts(): Promise<Result<Post[], Error>> {
        try {
            const posts = await this.primaryProvider.getPosts();
            return ok(posts);
        } catch (error) {
            console.log(`El Proveedor principal falló: ${error instanceof Error ? error.message : error}. Usando proveedor de respaldo...`);

            try {
                const posts = await this.fallbackProvider.getPosts();
                return ok(posts);
            } catch (fallbackError) {
                return err(fallbackError instanceof Error ? fallbackError : new Error(String(fallbackError)));
            }
        }
    }
}
