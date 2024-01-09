import { Definable } from "./definables";
import { addEntitySprite, createSprite, getCurrentTime } from "pixel-pigeon";
import { state } from "./state";

export interface ChestOptions {
  readonly entityID: string;
}
export class Chest extends Definable {
  private _openedAt: number | null = null;
  private readonly _options: ChestOptions;
  public constructor(options: ChestOptions) {
    super(options.entityID);
    this._options = options;
    const spriteID: string = createSprite({
      animationID: (): string =>
        this._openedAt !== null ? "opened" : "closed",
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
          id: "closed",
        },
        {
          frames: [
            {
              height: 24,
              sourceHeight: 24,
              sourceWidth: 24,
              sourceX: 24,
              sourceY: 0,
              width: 24,
            },
          ],
          id: "opened",
        },
      ],
      imagePath: "chest",
    });
    addEntitySprite(this._options.entityID, {
      spriteID,
    });
  }

  public close(): void {
    this._openedAt = null;
    state.setValues({ openChestID: null });
  }

  public isOpen(): boolean {
    return this._openedAt !== null;
  }

  public open(): void {
    this._openedAt = getCurrentTime();
    state.setValues({ openChestID: this._options.entityID });
  }
}
