export abstract class Vehicle {
    constructor(public model: string) {}

    abstract describe(): string;
}

export class Tesla extends Vehicle {
    describe(): string {
        return `Tesla Model: ${this.model} - Carga eléctrica al 100%`;
    }
}

export class Audi extends Vehicle {
    describe(): string {
        return `Audi Model: ${this.model} - Tracción Quattro activada`;
    }
}

export class Toyota extends Vehicle {
    describe(): string {
        return `Toyota Model: ${this.model} - Motor híbrido listo`;
    }
}

export class Honda extends Vehicle {
    describe(): string {
        return `Honda Model: ${this.model} - VTEC activado`;
    }
}

export class Ford extends Vehicle {
    describe(): string {
        return `Ford Model: ${this.model} - Built Tough`;
    }
}
