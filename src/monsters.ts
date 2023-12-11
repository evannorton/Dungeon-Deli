import { Definable } from "./definables";

export enum MonsterMovementBehavior {
  Chase = "chase",
  Horizontal = "horizontal",
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
  damage: 20,
  imagePath: "monsters/rat",
  maxHP: 50,
  movementBehavior: MonsterMovementBehavior.Chase,
});
new Monster("duck", {
  damage: 15,
  imagePath: "monsters/duck",
  maxHP: 75,
  movementBehavior: MonsterMovementBehavior.Chase,
});
new Monster("crab", {
  damage: 25,
  imagePath: "monsters/crab",
  maxHP: 50,
  movementBehavior: MonsterMovementBehavior.Horizontal,
});
