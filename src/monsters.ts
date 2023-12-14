import { Definable } from "./definables";

export enum MonsterMovementBehavior {
  Cart = "cart",
  Chase = "chase",
  Horizontal = "horizontal",
  Statue = "statue",
}
interface MonsterOptions {
  readonly movementBehavior: MonsterMovementBehavior;
  readonly damage: number;
  readonly imagePath: string;
  readonly maxHP: number;
}

export class Monster extends Definable {
  private readonly _options: MonsterOptions;
  public constructor(id: string, options: MonsterOptions) {
    super(id);
    this._options = options;
  }

  public get damage(): number {
    return this._options.damage;
  }

  public get imagePath(): string {
    return this._options.imagePath;
  }

  public get maxHP(): number {
    return this._options.maxHP;
  }

  public get movementBehavior(): MonsterMovementBehavior {
    return this._options.movementBehavior;
  }
}
new Monster("rat", {
  damage: 18,
  imagePath: "monsters/rat",
  maxHP: 50,
  movementBehavior: MonsterMovementBehavior.Chase,
});
new Monster("cart-rat", {
  damage: 24,
  imagePath: "monsters/cart-rat",
  maxHP: 50,
  movementBehavior: MonsterMovementBehavior.Cart,
});
new Monster("duck", {
  damage: 20,
  imagePath: "monsters/duck",
  maxHP: 50,
  movementBehavior: MonsterMovementBehavior.Chase,
});
new Monster("crab", {
  damage: 24,
  imagePath: "monsters/crab",
  maxHP: 50,
  movementBehavior: MonsterMovementBehavior.Horizontal,
});
new Monster("golem", {
  damage: 16,
  imagePath: "monsters/golem",
  maxHP: 75,
  movementBehavior: MonsterMovementBehavior.Chase,
});
new Monster("golem-2", {
  damage: 24,
  imagePath: "monsters/golem-2",
  maxHP: 100,
  movementBehavior: MonsterMovementBehavior.Statue,
});
new Monster("hambo", {
  damage: 26,
  imagePath: "monsters/hambo",
  maxHP: 100,
  movementBehavior: MonsterMovementBehavior.Statue,
});
new Monster("marsh", {
  damage: 22,
  imagePath: "monsters/marsh",
  maxHP: 50,
  movementBehavior: MonsterMovementBehavior.Chase,
});
new Monster("rabbit", {
  damage: 18,
  imagePath: "monsters/rabbit",
  maxHP: 75,
  movementBehavior: MonsterMovementBehavior.Chase,
});
