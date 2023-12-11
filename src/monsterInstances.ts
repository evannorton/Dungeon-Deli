import { Character } from "./characters";
import {
  CollisionData,
  EntityPosition,
  addEntitySprite,
  createEntity,
  createSprite,
  getCurrentTime,
  getEntityCalculatedPath,
  getEntityLevelID,
  getEntityPosition,
  getRectangleCollisionData,
  removeEntity,
  removeEntitySprite,
} from "pixel-pigeon";
import { Definable, getDefinable } from "./definables";
import { Direction } from "./types/Direction";
import { Monster } from "./monsters";
import { beginTurn } from "./functions/beginTurn";
import { goToNextMode } from "./functions/goToNextMode";
import { lifestealModeID, slipperyModeID } from "./modes";
import { monsterAttackDuration } from "./constants/monsterAttackDuration";
import { playerIsBlocked } from "./functions/playerIsBlocked";
import { state } from "./state";

export interface MonsterInstanceAttack {
  readonly spriteID: string;
  readonly time: number;
}
export interface MonsterInstanceOptions {
  readonly entityID: string;
  readonly monsterID: string;
}
export class MonsterInstance extends Definable {
  private _attack: MonsterInstanceAttack | null = null;
  private readonly _characterID: string;
  private readonly _options: MonsterInstanceOptions;
  private readonly _startLevelID: string;
  private readonly _startPosition: EntityPosition;
  public constructor(options: MonsterInstanceOptions) {
    super(options.entityID);
    this._options = options;
    const character: Character = new Character({
      entityID: options.entityID,
      imagePath: this.monster.imagePath,
      maxHP: this.monster.maxHP,
    });
    this._characterID = character.id;
    this._startLevelID = getEntityLevelID(options.entityID);
    this._startPosition = getEntityPosition(options.entityID);
  }

  public get character(): Character {
    return getDefinable(Character, this._characterID);
  }

  public get monster(): Monster {
    return getDefinable(Monster, this._options.monsterID);
  }

  public isAttacking(): boolean {
    return this._attack !== null;
  }

  public reset(): void {
    if (this.character.isAlive()) {
      removeEntity(this._options.entityID);
    }
    const entityID: string = createEntity({
      height: 24,
      layerID: "characters",
      levelID: this._startLevelID,
      position: this._startPosition,
      type: "monster",
      width: 24,
    });
    new MonsterInstance({
      ...this._options,
      entityID,
    });
    this.character.remove();
    this.remove();
  }

  public startAttack(): void {
    if (state.values.playerCharacterID === null) {
      throw new Error(
        `Attempted to do MonsterInstance "${this._id}" attack with no player character.`,
      );
    }
    const playerCharacter: Character = getDefinable(
      Character,
      state.values.playerCharacterID,
    );
    const playerEntityPosition: EntityPosition = getEntityPosition(
      playerCharacter.entityID,
    );
    if (playerCharacter.isAlive()) {
      const entityPosition: EntityPosition = getEntityPosition(
        this.character.entityID,
      );
      if (entityPosition.y > playerEntityPosition.y) {
        this.character.direction = Direction.Up;
      } else if (entityPosition.y < playerEntityPosition.y) {
        this.character.direction = Direction.Down;
      } else if (entityPosition.x > playerEntityPosition.x) {
        this.character.direction = Direction.Left;
      } else if (entityPosition.x < playerEntityPosition.x) {
        this.character.direction = Direction.Right;
      }
      const attackFrameDuration: number = Math.round(monsterAttackDuration / 5);
      const attackSpriteID: string = createSprite({
        animationID: "default",
        animations: [
          {
            frames: [
              {
                duration: attackFrameDuration,
                height: 24,
                sourceHeight: 24,
                sourceWidth: 24,
                sourceX: 0,
                sourceY: 0,
                width: 24,
              },
              {
                duration: attackFrameDuration,
                height: 24,
                sourceHeight: 24,
                sourceWidth: 24,
                sourceX: 24,
                sourceY: 0,
                width: 24,
              },
              {
                duration: attackFrameDuration,
                height: 24,
                sourceHeight: 24,
                sourceWidth: 24,
                sourceX: 48,
                sourceY: 0,
                width: 24,
              },
              {
                duration: attackFrameDuration,
                height: 24,
                sourceHeight: 24,
                sourceWidth: 24,
                sourceX: 72,
                sourceY: 0,
                width: 24,
              },
              {
                height: 24,
                sourceHeight: 24,
                sourceWidth: 24,
                sourceX: 96,
                sourceY: 0,
                width: 24,
              },
            ],
            id: "default",
          },
        ],
        imagePath: "monster-attack",
      });
      this._attack = {
        spriteID: attackSpriteID,
        time: getCurrentTime(),
      };
      addEntitySprite(playerCharacter.entityID, {
        spriteID: attackSpriteID,
      });
    }
  }

  public startMovement(): void {
    if (state.values.playerCharacterID === null) {
      throw new Error(
        `Attempted to do MonsterInstance "${this._id}" turn with no player character.`,
      );
    }
    const playerCharacter: Character = getDefinable(
      Character,
      state.values.playerCharacterID,
    );
    const entityPosition: EntityPosition = getEntityPosition(
      this._options.entityID,
    );
    const playerEntityPosition: EntityPosition = getEntityPosition(
      playerCharacter.entityID,
    );
    const path: EntityPosition[] = getEntityCalculatedPath(
      this._options.entityID,
      {
        exclusions: [
          {
            entityPosition: playerEntityPosition,
            type: "transport",
          },
        ],
        types: ["chest", "monster", "transport"],
        x: playerEntityPosition.x,
        y: playerEntityPosition.y,
      },
    );
    if (path.length > 2) {
      let endPosition: EntityPosition = path[1];
      if (state.values.modeID === slipperyModeID) {
        let xOffset: number = 0;
        let yOffset: number = 0;
        if (endPosition.x > entityPosition.x) {
          xOffset = 1;
        }
        if (endPosition.x < entityPosition.x) {
          xOffset = -1;
        }
        if (endPosition.y > entityPosition.y) {
          yOffset = 1;
        }
        if (endPosition.y < entityPosition.y) {
          yOffset = -1;
        }
        let hitCollision: boolean = false;
        while (hitCollision === false) {
          const newPosition: EntityPosition = {
            ...endPosition,
          };
          const newHalfPosition: EntityPosition = {
            ...endPosition,
          };
          newPosition.x += xOffset * 24;
          newPosition.y += yOffset * 24;
          newHalfPosition.x += xOffset * 12;
          newHalfPosition.y += yOffset * 12;
          const collisionData: CollisionData = getRectangleCollisionData(
            {
              height: 24,
              width: 24,
              x: newPosition.x,
              y: newPosition.y,
            },
            ["chest", "monster", "player", "transport"],
          );
          const halfCollisionData: CollisionData = getRectangleCollisionData(
            {
              height: 24,
              width: 24,
              x: newHalfPosition.x,
              y: newHalfPosition.y,
            },
            ["chest", "monster", "player", "transport"],
          );
          if (
            collisionData.map ||
            halfCollisionData.map ||
            collisionData.entityCollidables.length > 0 ||
            halfCollisionData.entityCollidables.length > 0
          ) {
            hitCollision = true;
          } else {
            endPosition = newPosition;
          }
        }
      }
      this.character.startMovement(endPosition);
      state.setValues({
        movingMonsterInstancesIDs: [
          ...state.values.movingMonsterInstancesIDs,
          this._id,
        ],
      });
    } else {
      state.setValues({
        attackingMonsterInstancesIDs: [
          ...state.values.attackingMonsterInstancesIDs,
          this._id,
        ],
      });
    }
  }

  public updateAttack(): void {
    if (state.values.playerCharacterID === null) {
      throw new Error(
        `Attempted to update MonsterInstance "${this._id}" attack with no player character.`,
      );
    }
    if (this._attack !== null) {
      const { time } = this._attack;
      const currentTime: number = getCurrentTime();
      if (currentTime > time + monsterAttackDuration) {
        state.setValues({
          attackingMonsterInstancesIDs:
            state.values.attackingMonsterInstancesIDs.filter(
              (monsterInstanceID: string): boolean =>
                monsterInstanceID !== this._id,
            ),
        });
        const playerCharacter: Character = getDefinable(
          Character,
          state.values.playerCharacterID,
        );
        playerCharacter.takeDamage(this.monster.damage);
        if (playerCharacter.hp === 0) {
          state.setValues({ instructionsOpen: false });
        }
        if (state.values.modeID === lifestealModeID) {
          this.character.restoreHealth(this.monster.damage);
        }
        removeEntitySprite(playerCharacter.entityID, this._attack.spriteID);
        this._attack = null;
        state.setValues({
          attackingMonsterInstancesIDs:
            state.values.attackingMonsterInstancesIDs.filter(
              (id: string): boolean => id !== this._id,
            ),
        });
        if (state.values.attackingMonsterInstancesIDs.length === 0) {
          if (
            playerIsBlocked() === false ||
            playerCharacter.isAlive() === false
          ) {
            state.setValues({ turnPart: null });
            goToNextMode();
          } else {
            beginTurn();
          }
        }
      }
    }
  }
}
