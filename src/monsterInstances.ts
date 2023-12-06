import { Character } from "./characters";
import { Definable, getDefinable } from "./definables";
import { EntityPosition, getEntityCalculatedPath } from "pixel-pigeon";
import { Monster } from "./monsters";
import { state } from "./state";

interface MonsterInstanceOptions {
  readonly entityID: string;
  readonly monsterID: string;
}

export class MonsterInstance extends Definable {
  private readonly _characterID: string;
  private readonly _options: MonsterInstanceOptions;
  public constructor(options: MonsterInstanceOptions) {
    super(options.entityID);
    this._options = options;
    const character: Character = new Character({
      entityID: options.entityID,
      imagePath: this.monster.imagePath,
    });
    this._characterID = character.id;
  }

  private get character(): Character {
    return getDefinable(Character, this._characterID);
  }

  private get monster(): Monster {
    return getDefinable(Monster, this._options.monsterID);
  }

  public doTurn(): void {
    if (state.values.playerCharacterID === null) {
      throw new Error(
        `Attempted to do MonsterInstance "${this._id}" turn with no player character.`,
      );
    }
    const character: Character = getDefinable(
      Character,
      state.values.playerCharacterID,
    );
    const position: EntityPosition = character.getEntityPosition();
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
      this.character.startMovement(path[1]);
    } else {
      // TODO: Attack player
    }
  }

  public updateMovement(): void {
    this.character.updateMovement();
  }

  public isMoving(): boolean {
    return this.character.isMoving();
  }
}
