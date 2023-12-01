import { Definable } from "./definables";

interface WeaponOptionsProjectileMove {
  readonly x?: number;
  readonly y?: number;
}
interface WeaponOptionsProjectile {
  readonly moves: WeaponOptionsProjectileMove[];
}
interface WeaponOptions {
  readonly name: string;
  readonly projectile?: WeaponOptionsProjectile;
  readonly stepsPerAttack: number;
}

export class Weapon extends Definable {
  private readonly _options: WeaponOptions;
  public constructor(id: string, options: WeaponOptions) {
    super(id);
    this._options = options;
    console.log(this._options);
  }

  public get name(): string {
    return this._options.name;
  }

  public get stepsPerAttack(): number {
    return this._options.stepsPerAttack;
  }
}
new Weapon("left", {
  name: "Shoot left",
  projectile: {
    moves: [{ x: -1 }],
  },
  stepsPerAttack: 5,
});
new Weapon("right", {
  name: "Shoot right",
  projectile: {
    moves: [{ x: 1 }],
  },
  stepsPerAttack: 3,
});
new Weapon("down", {
  name: "Shoot down",
  projectile: {
    moves: [{ y: -1 }],
  },
  stepsPerAttack: 7,
});
new Weapon("up", {
  name: "Shoot up",
  projectile: {
    moves: [{ y: 1 }],
  },
  stepsPerAttack: 9,
});
