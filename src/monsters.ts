import { Definable } from "./definables";

enum MonsterMovementBehavior {
  Chase = "chase",
  Horizontal = "horizontal"
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
}
new Monster("rat", {
  damage: 20,
  imagePath: "monsters/rat",
  maxHP: 50,
  movementBehavior: MonsterMovementBehavior.Chase,
});
