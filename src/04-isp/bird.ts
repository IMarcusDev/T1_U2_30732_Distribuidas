export interface CanEat {
    eat(): void;
}

export interface CanFly {
    fly(): void;
}

export interface CanSwim {
    swim(): void;
}

export function feedBird(bird: CanEat): void {
    bird.eat();
}

export function letItFly(bird: CanFly): void {
    bird.fly();
}

export function letItSwim(bird: CanSwim): void {
    bird.swim();
}
