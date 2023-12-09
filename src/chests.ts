import { Definable } from "./definables";
import { addEntitySprite, createSprite } from "pixel-pigeon";

export interface ChestOptions {
  readonly entityID: string;
}
export class Chest extends Definable {
  private readonly _options: ChestOptions;
  public constructor(options: ChestOptions) {
    super(options.entityID);
    this._options = options;
    const spriteID: string = createSprite({
      animationID: "default",
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
      imagePath: "chest",
    });
    addEntitySprite(this._options.entityID, {
      spriteID,
    });
  }
}
