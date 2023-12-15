import { Definable } from "./definables";

export enum MonsterMovementBehavior {
  Cart = "cart",
  Chase = "chase",
  Horizontal = "horizontal",
  Statue = "statue",
}
interface MonsterOptions {
  readonly attackImagePath: string;
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

  public get attackImagePath(): string {
    return this._options.attackImagePath;
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
  attackImagePath: "monster-attacks/bite-2",
  damage: 18,
  imagePath: "monsters/rat",
  maxHP: 50,
  movementBehavior: MonsterMovementBehavior.Chase,
});
new Monster("cart-rat", {
  attackImagePath: "monster-attacks/bite-2",
  damage: 24,
  imagePath: "monsters/cart-rat",
  maxHP: 50,
  movementBehavior: MonsterMovementBehavior.Cart,
});
new Monster("duck", {
  attackImagePath: "monster-attacks/bite-2",
  damage: 20,
  imagePath: "monsters/duck",
  maxHP: 50,
  movementBehavior: MonsterMovementBehavior.Chase,
});
new Monster("crab", {
  attackImagePath: "monster-attacks/bite-1",
  damage: 24,
  imagePath: "monsters/crab",
  maxHP: 50,
  movementBehavior: MonsterMovementBehavior.Horizontal,
});
new Monster("golem", {
  attackImagePath: "monster-attacks/bite-1",
  damage: 16,
  imagePath: "monsters/golem",
  maxHP: 75,
  movementBehavior: MonsterMovementBehavior.Chase,
});
new Monster("golem-2", {
  attackImagePath: "monster-attacks/bite-1",
  damage: 24,
  imagePath: "monsters/golem-2",
  maxHP: 100,
  movementBehavior: MonsterMovementBehavior.Statue,
});
new Monster("hambo", {
  attackImagePath: "monster-attacks/bite-1",
  damage: 26,
  imagePath: "monsters/hambo",
  maxHP: 100,
  movementBehavior: MonsterMovementBehavior.Statue,
});
new Monster("marsh", {
  attackImagePath: "monster-attacks/bite-1",
  damage: 22,
  imagePath: "monsters/marsh",
  maxHP: 50,
  movementBehavior: MonsterMovementBehavior.Chase,
});
new Monster("rabbit", {
  attackImagePath: "monster-attacks/bite-1",
  damage: 18,
  imagePath: "monsters/rabbit",
  maxHP: 75,
  movementBehavior: MonsterMovementBehavior.Chase,
});
