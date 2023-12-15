import { Character } from "./characters";
import {
  CollisionData,
  EntityCollidable,
  EntityPosition,
  createEntity,
  createSprite,
  getActiveLevelID,
  getCurrentTime,
  getEntityPosition,
  getRectangleCollisionData,
  playAudioSource,
  removeEntity,
  setEntityPosition,
  unlockAchievement,
} from "pixel-pigeon";
import { Definable, getDefinable, getDefinables, getToken } from "./definables";
import { MonsterInstance } from "./monsterInstances";
import { MonsterMovementBehavior } from "./monsters";
import { TurnPart } from "./types/TurnPart";
import { aoeDuration } from "./constants/aoeDuration";
import { goToNextMode } from "./functions/goToNextMode";
import {
  knockbackModeAchievementID,
  lifestealModeAchievementID,
} from "./achievements";
import { knockbackModeID, lifestealModeID } from "./modes";
import { projectileDuration } from "./constants/projectileDuration";
import { sfxVolumeChannelID } from "./volumeChannels";
import { startMonsterInstancesMovement } from "./functions/startMonsterInstancesMovement";
import { state } from "./state";

export interface WeaponAOEAttack {
  readonly aoeEntityIDs: string[];
  readonly monsterEntityIDs: string[];
  readonly positions: EntityPosition[];
  readonly time: number;
}
export interface WeaponProjectileAttack {
  readonly monsterEntityID: string | null;
  readonly positions: EntityPosition[];
  readonly projectileEntityID: string;
  readonly time: number;
}
interface WeaponOptionsProjectileMove {
  readonly x?: number;
  readonly y?: number;
}
interface WeaponOptionsAOEOffset {
  readonly x?: number;
  readonly y?: number;
}
interface WeaponOptionsProjectile {
  readonly moves: WeaponOptionsProjectileMove[];
}
interface WeaponOptionsAOE {
  readonly offsets: WeaponOptionsAOEOffset[];
}
interface WeaponOptions {
  readonly aoe?: WeaponOptionsAOE;
  readonly damage: number;
  readonly name: string;
  readonly projectile?: WeaponOptionsProjectile;
  readonly stepsOffset: number;
  readonly stepsPerAttack: number;
}

export class Weapon extends Definable {
  private _aoeAttack: WeaponAOEAttack | null = null;
  private _projectileAttack: WeaponProjectileAttack | null = null;
  private readonly _options: WeaponOptions;
  public constructor(options: WeaponOptions) {
    super(getToken());
    this._options = options;
  }

  public get name(): string {
    return this._options.name;
  }

  public get stepsOffset(): number {
    return this._options.stepsOffset;
  }

  public get stepsPerAttack(): number {
    return this._options.stepsPerAttack;
  }

  public attack(): void {
    if (state.values.playerCharacterID === null) {
      throw new Error(
        `Attempted to do Weapon "${this._id}" attack with no player character.`,
      );
    }
    const levelID: string | null = getActiveLevelID();
    if (levelID === null) {
      throw new Error(
        `Attempted to do Weapon "${this._id}" attack with no active level.`,
      );
    }
    const playerCharacter: Character = getDefinable(
      Character,
      state.values.playerCharacterID,
    );
    const playerEntityPosition: EntityPosition = getEntityPosition(
      playerCharacter.entityID,
    );
    if (typeof this._options.projectile !== "undefined") {
      const duration: number = projectileDuration;
      const projectileSpriteID: string = createSprite({
        animationID: "default",
        animations: [
          {
            frames: [
              {
                duration,
                height: 24,
                sourceHeight: 24,
                sourceWidth: 24,
                sourceX: 0,
                sourceY: 0,
                width: 24,
              },
              {
                duration,
                height: 24,
                sourceHeight: 24,
                sourceWidth: 24,
                sourceX: 24,
                sourceY: 0,
                width: 24,
              },
              {
                duration,
                height: 24,
                sourceHeight: 24,
                sourceWidth: 24,
                sourceX: 48,
                sourceY: 0,
                width: 24,
              },
              {
                duration,
                height: 24,
                sourceHeight: 24,
                sourceWidth: 24,
                sourceX: 72,
                sourceY: 0,
                width: 24,
              },
              {
                duration,
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
        imagePath: "projectile",
      });
      const projectileEntityID: string = createEntity({
        height: 24,
        layerID: "projectiles",
        levelID,
        position: playerEntityPosition,
        sprites: [
          {
            spriteID: projectileSpriteID,
          },
        ],
        width: 24,
      });
      const positions: EntityPosition[] = [playerEntityPosition];
      let entityID: string | null = null;
      outerLoop: while (entityID === null) {
        for (const move of this._options.projectile.moves) {
          positions.push({
            x: positions[positions.length - 1].x + (move.x ?? 0) * 24,
            y: positions[positions.length - 1].y + (move.y ?? 0) * 24,
          });
          const collisionData: CollisionData = getRectangleCollisionData(
            {
              height: 24,
              width: 24,
              x: positions[positions.length - 1].x,
              y: positions[positions.length - 1].y,
            },
            ["chest", "monster", "transport"],
          );
          if (collisionData.map === true) {
            break outerLoop;
          }
          if (collisionData.entityCollidables.length > 0) {
            const entityCollidable: EntityCollidable =
              collisionData.entityCollidables[0];
            if (entityCollidable.type === "monster") {
              entityID = entityCollidable.entityID;
            }
            break outerLoop;
          }
        }
      }
      this._projectileAttack = {
        monsterEntityID: entityID,
        positions,
        projectileEntityID,
        time: getCurrentTime(),
      };
      playAudioSource("projectile-shoot", {
        volumeChannelID: sfxVolumeChannelID,
      });
    } else if (typeof this._options.aoe !== "undefined") {
      const areaEntityIDs: string[] = [];
      const monsterEntityIDs: string[] = [];
      const positions: EntityPosition[] = [];
      for (const offset of this._options.aoe.offsets) {
        const position: EntityPosition = {
          x: playerEntityPosition.x + (offset.x ?? 0) * 24,
          y: playerEntityPosition.y + (offset.y ?? 0) * 24,
        };
        const collisionData: CollisionData = getRectangleCollisionData(
          {
            height: 24,
            width: 24,
            x: position.x,
            y: position.y,
          },
          ["chest"],
        );
        const monsterCollisionData: CollisionData = getRectangleCollisionData(
          {
            height: 24,
            width: 24,
            x: position.x,
            y: position.y,
          },
          ["monster"],
        );
        if (
          monsterCollisionData.map === false &&
          collisionData.entityCollidables.length === 0
        ) {
          const duration: number = aoeDuration / 5;
          const spriteID: string = createSprite({
            animationID: "default",
            animations: [
              {
                frames: [
                  {
                    duration,
                    height: 24,
                    sourceHeight: 24,
                    sourceWidth: 24,
                    sourceX: 0,
                    sourceY: 0,
                    width: 24,
                  },
                  {
                    duration,
                    height: 24,
                    sourceHeight: 24,
                    sourceWidth: 24,
                    sourceX: 24,
                    sourceY: 0,
                    width: 24,
                  },
                  {
                    duration,
                    height: 24,
                    sourceHeight: 24,
                    sourceWidth: 24,
                    sourceX: 48,
                    sourceY: 0,
                    width: 24,
                  },
                  {
                    duration,
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
            imagePath: "aoe",
          });
          areaEntityIDs.push(
            createEntity({
              height: 24,
              layerID: "areas",
              levelID,
              position: {
                x: position.x,
                y: position.y,
              },
              sprites: [
                {
                  spriteID,
                },
              ],
              width: 24,
            }),
          );
          positions.push(position);
          if (monsterCollisionData.entityCollidables.length > 0) {
            monsterEntityIDs.push(
              monsterCollisionData.entityCollidables[0].entityID,
            );
          }
        }
      }
      this._aoeAttack = {
        aoeEntityIDs: areaEntityIDs,
        monsterEntityIDs,
        positions,
        time: getCurrentTime(),
      };
    }
  }

  public isAttacking(): boolean {
    return this._projectileAttack !== null || this._aoeAttack !== null;
  }

  public updateAttack(): void {
    if (state.values.playerCharacterID === null) {
      throw new Error(
        `Attempted to update MonsterInstance "${this._id}" attack with no player character.`,
      );
    }
    if (this._projectileAttack !== null) {
      const { time } = this._projectileAttack;
      const currentTime: number = getCurrentTime();
      const positionsIndex: number = Math.min(
        Math.floor((currentTime - time) / projectileDuration),
        this._projectileAttack.positions.length - 1,
      );
      const percentage: number =
        ((currentTime - time) / projectileDuration) % 1;
      const position: EntityPosition =
        this._projectileAttack.positions[positionsIndex];
      const nextPosition: EntityPosition =
        this._projectileAttack.positions[positionsIndex + 1];
      if (
        typeof position !== "undefined" &&
        typeof nextPosition !== "undefined"
      ) {
        const projectilePosition: EntityPosition = {
          ...position,
        };
        let xOffset: number = 0;
        let yOffset: number = 0;
        if (nextPosition.x > position.x) {
          xOffset += 24 * percentage;
        } else if (nextPosition.x < position.x) {
          xOffset -= 24 * percentage;
        }
        if (nextPosition.y > position.y) {
          yOffset += 24 * percentage;
        } else if (nextPosition.y < position.y) {
          yOffset -= 24 * percentage;
        }
        projectilePosition.x += xOffset;
        projectilePosition.y += yOffset;
        setEntityPosition(
          this._projectileAttack.projectileEntityID,
          projectilePosition,
        );
      } else {
        if (this._projectileAttack.monsterEntityID !== null) {
          const monsterInstance: MonsterInstance = getDefinable(
            MonsterInstance,
            this._projectileAttack.monsterEntityID,
          );
          monsterInstance.character.takeDamage(this._options.damage);
          const playerCharacter: Character = getDefinable(
            Character,
            state.values.playerCharacterID,
          );
          if (state.values.modeID === lifestealModeID) {
            if (playerCharacter.isFullyRestored() === false) {
              playerCharacter.restoreHealth(this._options.damage);
              if (playerCharacter.isFullyRestored()) {
                unlockAchievement(lifestealModeAchievementID);
              }
            }
          }
          if (monsterInstance.character.isAlive() === false) {
            removeEntity(this._projectileAttack.monsterEntityID);
            state.setValues({
              knockbackCharacterIDs: state.values.knockbackCharacterIDs.filter(
                (id: string): boolean => id !== monsterInstance.character.id,
              ),
            });
          } else {
            if (state.values.modeID === knockbackModeID) {
              state.setValues({
                knockbackCharacterIDs: [
                  ...state.values.knockbackCharacterIDs,
                  monsterInstance.character.id,
                ],
              });
            }
          }
        }
        state.setValues({
          attackingWeaponsIDs: state.values.attackingWeaponsIDs.filter(
            (weaponID: string): boolean => weaponID !== this._id,
          ),
        });
        removeEntity(this._projectileAttack.projectileEntityID);
        this._projectileAttack = null;
        playAudioSource("projectile-hit", {
          volumeChannelID: sfxVolumeChannelID,
        });
      }
    } else if (this._aoeAttack !== null) {
      const { time } = this._aoeAttack;
      const currentTime: number = getCurrentTime();
      if (currentTime > time + aoeDuration) {
        for (const monsterInstanceID of this._aoeAttack.monsterEntityIDs) {
          const monsterInstance: MonsterInstance = getDefinable(
            MonsterInstance,
            monsterInstanceID,
          );
          monsterInstance.character.takeDamage(this._options.damage);
          const playerCharacter: Character = getDefinable(
            Character,
            state.values.playerCharacterID,
          );
          if (state.values.modeID === lifestealModeID) {
            playerCharacter.restoreHealth(this._options.damage);
          }
          if (monsterInstance.character.isAlive() === false) {
            removeEntity(monsterInstanceID);
            state.setValues({
              knockbackCharacterIDs: state.values.knockbackCharacterIDs.filter(
                (id: string): boolean => id !== monsterInstance.character.id,
              ),
            });
          } else {
            if (state.values.modeID === knockbackModeID) {
              state.setValues({
                knockbackCharacterIDs: [
                  ...state.values.knockbackCharacterIDs,
                  monsterInstance.character.id,
                ],
              });
            }
          }
        }
        state.setValues({
          attackingWeaponsIDs: state.values.attackingWeaponsIDs.filter(
            (weaponID: string): boolean => weaponID !== this._id,
          ),
        });
        for (const areaEntityID of this._aoeAttack.aoeEntityIDs) {
          removeEntity(areaEntityID);
        }
        this._aoeAttack = null;
      }
    }
    if (state.values.attackingWeaponsIDs.length === 0) {
      const playerCharacter: Character = getDefinable(
        Character,
        state.values.playerCharacterID,
      );
      if (state.values.knockbackCharacterIDs.length > 0) {
        for (const characterID of state.values.knockbackCharacterIDs) {
          const character: Character = getDefinable(Character, characterID);
          const playerPosition: EntityPosition = getEntityPosition(
            playerCharacter.entityID,
          );
          if (playerPosition !== null) {
            const entityPosition: EntityPosition = getEntityPosition(
              character.entityID,
            );
            const endPosition: EntityPosition = { ...entityPosition };
            const endHalfPosition: EntityPosition = { ...entityPosition };
            let xOffset: number = 0;
            let yOffset: number = 0;
            if (playerPosition.x > endPosition.x) {
              endPosition.x -= 24;
            } else if (playerPosition.x < endPosition.x) {
              endPosition.x += 24;
            }
            if (playerPosition.y > endPosition.y) {
              endPosition.y -= 24;
            } else if (playerPosition.y < endPosition.y) {
              endPosition.y += 24;
            }
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
            endHalfPosition.x += xOffset * 12;
            endHalfPosition.y += yOffset * 12;
            const collisionData: CollisionData = getRectangleCollisionData(
              {
                height: 24,
                width: 24,
                x: endPosition.x,
                y: endPosition.y,
              },
              ["chest", "monster", "player", "transport"],
            );
            const halfCollisionData: CollisionData = getRectangleCollisionData(
              {
                height: 24,
                width: 24,
                x: endHalfPosition.x,
                y: endHalfPosition.y,
              },
              ["chest", "monster", "player", "transport"],
            );
            collisionData.entityCollidables =
              collisionData.entityCollidables.filter(
                (entityCollidable: EntityCollidable): boolean =>
                  entityCollidable.entityID !== character.entityID,
              );
            halfCollisionData.entityCollidables =
              halfCollisionData.entityCollidables.filter(
                (entityCollidable: EntityCollidable): boolean =>
                  entityCollidable.entityID !== character.entityID,
              );
            if (
              !collisionData.map &&
              !halfCollisionData.map &&
              collisionData.entityCollidables.length === 0 &&
              halfCollisionData.entityCollidables.length === 0
            ) {
              for (const monsterInstance of getDefinables(
                MonsterInstance,
              ).values()) {
                if (
                  monsterInstance.character.id === character.id &&
                  monsterInstance.monster.movementBehavior ===
                    MonsterMovementBehavior.Cart &&
                  endPosition.x !== entityPosition.x
                ) {
                  unlockAchievement(knockbackModeAchievementID);
                }
              }
              character.startKnockback(endPosition);
            } else {
              state.setValues({
                knockbackCharacterIDs:
                  state.values.knockbackCharacterIDs.filter(
                    (id: string): boolean => id !== characterID,
                  ),
              });
            }
          } else {
            state.setValues({
              knockbackCharacterIDs: state.values.knockbackCharacterIDs.filter(
                (id: string): boolean => id !== characterID,
              ),
            });
          }
        }
      }
      if (state.values.knockbackCharacterIDs.length > 0) {
        state.setValues({ turnPart: TurnPart.MonstersKnockback });
      } else {
        startMonsterInstancesMovement();
        if (state.values.movingMonsterInstancesIDs.length > 0) {
          state.setValues({ turnPart: TurnPart.MonstersMoving });
        } else if (state.values.attackingMonsterInstancesIDs.length > 0) {
          state.setValues({ turnPart: TurnPart.MonstersAttacking });
        } else {
          state.setValues({ turnPart: null });
          goToNextMode();
        }
      }
    }
  }
}
export const leftWeaponID: string = new Weapon({
  damage: 25,
  name: "Shoot left",
  projectile: {
    moves: [{ x: -1 }],
  },
  stepsOffset: 3,
  stepsPerAttack: 4,
}).id;
export const rightWeaponID: string = new Weapon({
  damage: 25,
  name: "Shoot right",
  projectile: {
    moves: [{ x: 1 }],
  },
  stepsOffset: 1,
  stepsPerAttack: 4,
}).id;
export const downWeaponID: string = new Weapon({
  damage: 25,
  name: "Shoot down",
  projectile: {
    moves: [{ y: 1 }],
  },
  stepsOffset: 2,
  stepsPerAttack: 4,
}).id;
export const upWeaponID: string = new Weapon({
  damage: 25,
  name: "Shoot up",
  projectile: {
    moves: [{ y: -1 }],
  },
  stepsOffset: 0,
  stepsPerAttack: 4,
}).id;
export const diagonalBottomLeftWeaponID: string = new Weapon({
  damage: 25,
  name: "Shoot down left",
  projectile: {
    moves: [
      {
        x: -1,
        y: 1,
      },
    ],
  },
  stepsOffset: 0,
  stepsPerAttack: 7,
}).id;
export const diagonalBottomRightWeaponID: string = new Weapon({
  damage: 25,
  name: "Shoot down right",
  projectile: {
    moves: [
      {
        x: 1,
        y: 1,
      },
    ],
  },
  stepsOffset: 0,
  stepsPerAttack: 7,
}).id;
export const diagonalTopLeftWeaponID: string = new Weapon({
  damage: 25,
  name: "Shoot up left",
  projectile: {
    moves: [
      {
        x: -1,
        y: -1,
      },
    ],
  },
  stepsOffset: 0,
  stepsPerAttack: 7,
}).id;
export const diagonalTopRightWeaponID: string = new Weapon({
  damage: 25,
  name: "Shoot up right",
  projectile: {
    moves: [
      {
        x: 1,
        y: -1,
      },
    ],
  },
  stepsOffset: 0,
  stepsPerAttack: 7,
}).id;
export const burstAreaWeaponID: string = new Weapon({
  aoe: {
    offsets: [
      {
        x: -1,
        y: -1,
      },
      {
        y: -1,
      },
      {
        x: 1,
        y: -1,
      },
      {
        x: -1,
      },
      {
        x: 1,
      },
      {
        x: -1,
        y: 1,
      },
      {
        y: 1,
      },
      {
        x: 1,
        y: 1,
      },
      {
        x: 2,
        y: 0,
      },
      {
        x: -2,
        y: 0,
      },
      {
        x: 0,
        y: 2,
      },
      {
        x: 0,
        y: -2,
      },
    ],
  },
  damage: 25,
  name: "Burst area",
  stepsOffset: 0,
  stepsPerAttack: 5,
}).id;
export const burstRingWeaponID: string = new Weapon({
  aoe: {
    offsets: [
      // Row 1
      {
        x: 0,
        y: -3,
      },
      // Row 2
      {
        x: -2,
        y: -2,
      },
      {
        x: -1,
        y: -2,
      },
      {
        x: 1,
        y: -2,
      },
      {
        x: 2,
        y: -2,
      },
      // Row 3
      {
        x: -2,
        y: -1,
      },
      {
        x: 2,
        y: -1,
      },
      // Row 4
      {
        x: -3,
        y: 0,
      },
      {
        x: 3,
        y: 0,
      },
      // Row 5
      {
        x: -2,
        y: 1,
      },
      {
        x: 2,
        y: 1,
      },
      // Row 6
      {
        x: -2,
        y: 2,
      },
      {
        x: -1,
        y: 2,
      },
      {
        x: 1,
        y: 2,
      },
      {
        x: 2,
        y: 2,
      },
      // Row 7
      {
        x: 0,
        y: 3,
      },
    ],
  },
  damage: 25,
  name: "Burst ring",
  stepsOffset: 0,
  stepsPerAttack: 10,
}).id;
