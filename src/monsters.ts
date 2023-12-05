import { Definable } from "./definables";
import { createSprite } from "pixel-pigeon";

interface MonsterOptions {
  readonly imagePath: string;
}

export class Monster extends Definable {
  private readonly _options: MonsterOptions;
  private readonly _spriteID: string;
  public constructor(id: string, options: MonsterOptions) {
    super(id);
    this._options = options;
    this._spriteID = createSprite({
      animations: [
        {
          frames: [
            {
              height: 24,
              sourceHeight: 24,
              sourceWidth: 24,
              sourceX: 0,
              sourceY: 0,
              width: 24,
            },
          ],
          id: "default",
        },
      ],
      imagePath: this._options.imagePath,
    });
  }

  public get spriteID(): string {
    return this._spriteID;
  }
}
new Monster("rat", { imagePath: "monsters/rat" });
