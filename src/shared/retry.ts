import { Result, ok, err } from './result';

export async function retry<T>(
    operation: () => Promise<T>,
    attempts = 3,
    delayMs = 300
): Promise<Result<T, Error>> {
    let lastError: Error = new Error('Operación fallida sin detalle');

    for (let attempt = 1; attempt <= attempts; attempt++) {
        try {
            const value = await operation();
            return ok(value);
        } catch (error) {
            lastError = error instanceof Error ? error : new Error(String(error));
            console.log(`[retry] Intento ${attempt}/${attempts} falló: ${lastError.message}`);

            if (attempt < attempts) {
                await new Promise(resolve => setTimeout(resolve, delayMs));
            }
        }
    }

    return err(lastError);
}
