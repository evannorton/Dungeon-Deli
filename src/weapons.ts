import { Definable } from "./definables";

interface WeaponOptionsProjectileMove {
  readonly x?: number;
  readonly y?: number;
}
interface WeaponOptionsProjectile {
  readonly moves: WeaponOptionsProjectileMove[];
}
interface WeaponOptions {
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
}
new Weapon("left", {
  projectile: { moves: [{ x: -1 }] },
  stepsPerAttack: 3,
});
new Weapon("right", {
  projectile: { moves: [{ x: 1 }] },
  stepsPerAttack: 3,
});
new Weapon("down", {
  projectile: { moves: [{ y: -1 }] },
  stepsPerAttack: 3,
});
new Weapon("up", {
  projectile: { moves: [{ y: 1 }] },
  stepsPerAttack: 3,
});
