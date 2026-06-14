import { Result, ok, err } from '../shared/result';
import { Product, ProductRepository } from './product-repository';
import { NotificationService } from './notification-service';

export class ProductService {

    constructor(
        private readonly repository: ProductRepository,
        private readonly notifier: NotificationService,
    ) {}

    registerProduct(product: Product, customerEmail: string): Result<Product, Error> {
        this.repository.save(product);

        try {
            this.notifier.notify(customerEmail, `El producto "${product.name}" ya está disponible en la tienda de la reserva.`);
        } catch (error) {
            this.repository.remove(product.id);
            return err(error instanceof Error ? error : new Error(String(error)));
        }

        return ok(product);
    }

    loadProduct(id: number): Product | undefined {
        return this.repository.load(id);
    }
}
