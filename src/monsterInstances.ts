import { Character } from "./characters";
import { Definable, getDefinable } from "./definables";
import { Direction } from "./types/Direction";
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
      maxHP: this.monster.maxHP,
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
    const playerCharacter: Character = getDefinable(
      Character,
      state.values.playerCharacterID,
    );
    const playerEntityPosition: EntityPosition =
      playerCharacter.getEntityPosition();
    const path: EntityPosition[] = getEntityCalculatedPath(
      this._options.entityID,
      {
        exclusions: [
          {
            entityPosition: playerEntityPosition,
            type: "transport",
          },
        ],
        types: ["monster", "transport"],
        x: playerEntityPosition.x,
        y: playerEntityPosition.y,
      },
    );
    if (path.length > 2) {
      this.character.startMovement(path[1]);
    } else {
      const entityPosition: EntityPosition = this.character.getEntityPosition();
      if (entityPosition.y > playerEntityPosition.y) {
        this.character.direction = Direction.Up;
      } else if (entityPosition.y < playerEntityPosition.y) {
        this.character.direction = Direction.Down;
      } else if (entityPosition.x > playerEntityPosition.x) {
        this.character.direction = Direction.Left;
      } else if (entityPosition.x < playerEntityPosition.x) {
        this.character.direction = Direction.Right;
      }
    }
  }

  public takeDamage(damage: number): void {
    this.character.takeDamage(damage);
  }

  public updateMovement(): void {
    this.character.updateMovement();
  }

  public isMoving(): boolean {
    return this.character.isMoving();
  }
}
