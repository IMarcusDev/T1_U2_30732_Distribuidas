export interface Product {
    id: number;
    name: string;
}

export class ProductRepository {

    private products: Product[] = [];

    load(id: number): Product | undefined {
        console.log(`Cargando producto con ID: ${id} desde el inventario del parque...`);
        return this.products.find(p => p.id === id);
    }

    save(product: Product): void {
        console.log(`Guardando el producto ${product.name} en la base de datos de la reserva...`);
        this.products.push(product);
    }

    remove(id: number): void {
        console.log(`eliminando producto con ID ${id} del inventario...`);
        this.products = this.products.filter(p => p.id !== id);
    }
}
