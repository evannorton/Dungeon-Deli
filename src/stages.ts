import { Definable } from "./definables";
import {
  EntityPosition,
  createSpriteInstance,
  goToLevel,
  lockCameraToEntity,
  setEntityPosition,
  spawnEntity,
} from "pixel-pigeon";
import { playerSpriteID } from "./sprites";
import { state } from "./state";

interface StageOptions {
  readonly levelID: string;
  readonly playerStartPosition: EntityPosition;
}

export class Stage extends Definable {
  private readonly _options: StageOptions;
  public constructor(id: string, options: StageOptions) {
    super(id);
    this._options = options;
  }

  public start(): void {
    goToLevel(this._options.levelID);
    if (state.values.playerEntityID === null) {
      const playerSpriteInstanceID: string = createSpriteInstance({
        getAnimationID: (): string => "default",
        spriteID: playerSpriteID,
      });
      const playerEntityID: string = spawnEntity({
        height: 24,
        layerID: "player",
        position: this._options.playerStartPosition,
        spriteInstanceID: playerSpriteInstanceID,
        width: 24,
        zIndex: 0,
      });
      lockCameraToEntity(playerEntityID);
      state.setValues({
        playerEntityID,
      });
    } else {
      setEntityPosition(
        state.values.playerEntityID,
        this._options.playerStartPosition,
      );
    }
  }
}
new Stage("1", {
  levelID: "test_1",
  playerStartPosition: {
    x: 48,
    y: 48,
  },
});
