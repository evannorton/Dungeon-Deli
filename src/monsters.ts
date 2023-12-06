import { Definable } from "./definables";

interface MonsterOptions {
  readonly imagePath: string;
}

export class Monster extends Definable {
  private readonly _options: MonsterOptions;
  public constructor(id: string, options: MonsterOptions) {
    super(id);
    this._options = options;
  }

  public get imagePath(): string {
    return this._options.imagePath;
  }
}
new Monster("rat", { imagePath: "monsters/rat" });
