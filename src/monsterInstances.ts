import { Definable, getDefinable } from "./definables";
import {
  EntityPosition,
  createSpriteInstance,
  getEntityCalculatedPath,
  getEntityPosition,
  setEntityPosition,
  setEntitySpriteInstance,
} from "pixel-pigeon";
import { Monster } from "./monsters";
import { state } from "./state";

interface MonsterInstanceOptions {
  readonly entityID: string;
  readonly monsterID: string;
}

export class MonsterInstance extends Definable {
  private readonly _options: MonsterInstanceOptions;
  public constructor(options: MonsterInstanceOptions) {
    super(options.entityID);
    this._options = options;
    const spriteInstanceID: string = createSpriteInstance({
      getAnimationID: (): string => "default",
      spriteID: this.monster.spriteID,
    });
    setEntitySpriteInstance(this._options.entityID, spriteInstanceID);
  }

  private get monster(): Monster {
    return getDefinable(Monster, this._options.monsterID);
  }

  public doTurn(): void {
    if (state.values.playerEntityID === null) {
      throw new Error(
        `Attempted to do MonsterInstance "${this._id}" turn with no player entity.`,
      );
    }
    const position: EntityPosition = getEntityPosition(
      state.values.playerEntityID,
    );
    const path: EntityPosition[] = getEntityCalculatedPath(
      this._options.entityID,
      {
        collisionLayers: ["monsters", "transports"],
        excludedPositions: [position],
        x: position.x,
        y: position.y,
      },
    );
    if (path.length > 2) {
      setEntityPosition(this._options.entityID, path[1]);
    } else {
      // TODO: Attack player
    }
  }
}
