import './style.css'

import { ProductRepository } from './01-srp/product-repository';
import { ConsoleEmailNotifier } from './01-srp/notification-service';
import { ProductService } from './01-srp/product-service';

import { AxiosHttpClient } from './02-ocp/http-client';
import { NewsService } from './02-ocp/news-service';
import { PhotosService } from './02-ocp/photos-service';

import { Vehicle, Tesla, Audi, Toyota, Honda, Ford } from './03-lsp/vehicle';
import { VehicleManager } from './03-lsp/vehicle-manager';

import { Toucan, Hummingbird, Ostrich } from './04-isp/bird-catalog';
import { feedBird, letItFly, letItSwim } from './04-isp/bird';

import { LocalDatabaseService, JsonDatabaseService } from './data/local-database';
import { PostService } from './05-dip/post-service';

const app = document.querySelector<HTMLDivElement>('#app')!

app.innerHTML = `
  <h1>CleanCode y SOLID</h1>
  <span>Revisar la consola de JavaScript</span>
`

function demoSrp(): void {
    console.log('\n===01. SRP: Registro de productos===');
    const productService = new ProductService(new ProductRepository(), new ConsoleEmailNotifier());

    const registered = productService.registerProduct({ id: 1, name: 'Taza de la Reserva' }, 'visitante@reserva.com');
    console.log(registered.ok ? `Producto registrado: ${registered.value.name}` : `Error: ${registered.error.message}`);

    const rejected = productService.registerProduct({ id: 2, name: 'Gorra de la Reserva' }, 'correo-invalido');
    console.log(rejected.ok ? `Producto registrado: ${rejected.value.name}` : `Rollback aplicado: ${rejected.error.message}`);
}

async function demoOcp(): Promise<void> {
    console.log('\n===02. OCP: Noticias y fotos de la reserva===');
    const httpClient = new AxiosHttpClient();

    const news = await new NewsService(httpClient).getLatestNews();
    console.log(news.ok ? `Noticias recibidas: ${news.value.length}` : `Error obteniendo noticias: ${news.error.message}`);

    const photos = await new PhotosService(httpClient).getGallery();
    console.log(photos.ok ? `Fotos recibidas: ${photos.value.length}` : `Error obteniendo fotos: ${photos.error.message}`);
}

function demoLsp(): void {
    console.log('\n===03. LSP: Flota de vehículos===');
    const vehicles: Vehicle[] = [
        new Tesla('Model S'),
        new Audi('Q5'),
        new Toyota('Corolla'),
        new Honda('Civic'),
        new Ford('F-150'),
    ];

    VehicleManager.printVehicleDetails(vehicles);
}

function demoIsp(): void {
    console.log('\n===04. ISP: Catálogo de aves===');
    const toucan = new Toucan();
    const hummingbird = new Hummingbird();
    const ostrich = new Ostrich();

    feedBird(toucan);
    letItFly(toucan);

    feedBird(hummingbird);
    letItFly(hummingbird);

    feedBird(ostrich);
    letItSwim(ostrich);
}

async function demoDip(): Promise<void> {
    console.log('\n===05. DIP: Publicaciones de la reserva===');
    const postService = new PostService(new LocalDatabaseService(), new JsonDatabaseService());

    const posts = await postService.getPosts();
    console.log(posts.ok ? `Publicaciones obtenidas: ${posts.value.length}` : `Error obteniendo publicaciones: ${posts.error.message}`);
}

async function main(): Promise<void> {
    demoSrp();
    await demoOcp();
    demoLsp();
    demoIsp();
    await demoDip();
}

main();
