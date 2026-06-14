export interface Post {
    id: number;
    title: string;
    body: string;
}

export interface DatabaseProvider {
    getPosts(): Promise<Post[]>;
}

export class LocalDatabaseService implements DatabaseProvider {
    async getPosts(): Promise<Post[]> {
        return [
            { id: 1, title: 'Avistamiento de Jaguar', body: 'Se reportó un jaguar cerca del río.' },
            { id: 2, title: 'Nuevas Orquídeas', body: 'Han florecido las especies raras en el jardín botánico.' }
        ];
    }
}

export class JsonDatabaseService implements DatabaseProvider {
    async getPosts(): Promise<Post[]> {
        return [
            { id: 1, title: 'JSON Post 1', body: 'Contenido desde JSON' }
        ];
    }
}
