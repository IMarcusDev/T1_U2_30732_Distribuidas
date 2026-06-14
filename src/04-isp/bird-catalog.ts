import { CanEat, CanFly, CanSwim } from './bird';

export class Toucan implements CanEat, CanFly {
    eat(): void { console.log('El Tucán está comiendo'); }
    fly(): void { console.log('El Tucán vuela'); }
}

export class Hummingbird implements CanEat, CanFly {
    eat(): void { console.log('El Colibrí busca néctar'); }
    fly(): void { console.log('El Colibrí aletea'); }
}

export class Ostrich implements CanEat, CanSwim {
    eat(): void { console.log('El Avestruz come hierbas'); }
    swim(): void { console.log('El Avestruz puede nadar'); }
}
