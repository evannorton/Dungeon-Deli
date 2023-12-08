import { Character } from "./characters";
import {
  CollisionData,
  EntityPosition,
  createEntity,
  createSprite,
  getCurrentTime,
  removeEntity,
  setEntityPosition,
} from "pixel-pigeon";
import { Definable, getDefinable } from "./definables";
import { EntityCollidable } from "pixel-pigeon/api/types/World";
import { MonsterInstance } from "./monsterInstances";
import { TurnPart } from "./types/TurnPart";
import { getRectangleCollisionData } from "pixel-pigeon/api/functions/getRectangleCollisionData";
import { projectileDuration } from "./constants/projectileDuration";
import { startMonsterInstancesMovement } from "./functions/startMonsterInstancesMovement";
import { state } from "./state";

export interface WeaponAttack {
  readonly monsterEntityID: string | null;
  readonly positions: EntityPosition[];
  readonly projectileEntityID: string;
  readonly time: number;
}
interface WeaponOptionsProjectileMove {
  readonly x?: number;
  readonly y?: number;
}
interface WeaponOptionsProjectile {
  readonly moves: WeaponOptionsProjectileMove[];
}
interface WeaponOptions {
  readonly damage: number;
  readonly name: string;
  readonly projectile?: WeaponOptionsProjectile;
  readonly stepsPerAttack: number;
}

export class Weapon extends Definable {
  private _attack: WeaponAttack | null = null;
  private readonly _options: WeaponOptions;
  public constructor(id: string, options: WeaponOptions) {
    super(id);
    this._options = options;
  }

  public get name(): string {
    return this._options.name;
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
    const playerCharacter: Character = getDefinable(
      Character,
      state.values.playerCharacterID,
    );
    const playerEntityPosition: EntityPosition =
      playerCharacter.getEntityPosition();
    const projectileSpriteID: string = createSprite({
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
      imagePath: "projectile",
    });
    const projectileEntityID: string = createEntity({
      height: 24,
      layerID: "projectiles",
      position: playerEntityPosition,
      sprites: [
        {
          spriteID: projectileSpriteID,
        },
      ],
      width: 24,
    });
    if (typeof this._options.projectile !== "undefined") {
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
            ["monster"],
          );
          if (collisionData.map === true) {
            break outerLoop;
          }
          if (collisionData.entityCollidables.length > 0) {
            const entityCollidable: EntityCollidable =
              collisionData.entityCollidables[0];
            entityID = entityCollidable.entityID;
          }
        }
      }
      this._attack = {
        monsterEntityID: entityID,
        positions,
        projectileEntityID,
        time: getCurrentTime(),
      };
    }
  }

  public isAttacking(): boolean {
    return this._attack !== null;
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
      const positionsIndex: number = Math.min(
        Math.floor((currentTime - time) / projectileDuration),
        this._attack.positions.length - 1,
      );
      const percentage: number =
        ((currentTime - time) / projectileDuration) % 1;
      const position: EntityPosition = this._attack.positions[positionsIndex];
      const nextPosition: EntityPosition =
        this._attack.positions[positionsIndex + 1];
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
        setEntityPosition(this._attack.projectileEntityID, projectilePosition);
      } else {
        if (this._attack.monsterEntityID !== null) {
          const monsterInstance: MonsterInstance = getDefinable(
            MonsterInstance,
            this._attack.monsterEntityID,
          );
          monsterInstance.character.takeDamage(this._options.damage);
          if (monsterInstance.character.isAlive() === false) {
            removeEntity(this._attack.monsterEntityID);
          }
        }
        state.setValues({
          attackingWeaponsIDs: state.values.attackingWeaponsIDs.filter(
            (weaponID: string): boolean => weaponID !== this._id,
          ),
        });
        removeEntity(this._attack.projectileEntityID);
        this._attack = null;
        if (state.values.attackingWeaponsIDs.length === 0) {
          startMonsterInstancesMovement();
          if (state.values.movingMonsterInstancesIDs.length > 0) {
            state.setValues({ turnPart: TurnPart.MonstersMoving });
          } else if (state.values.attackingMonsterInstancesIDs.length > 0) {
            state.setValues({ turnPart: TurnPart.MonstersAttacking });
          } else {
            state.setValues({ turnPart: null });
          }
        }
      }
    }
  }
}
new Weapon("left", {
  damage: 25,
  name: "Shoot left",
  projectile: {
    moves: [{ x: -1 }],
  },
  stepsPerAttack: 5,
});
new Weapon("right", {
  damage: 25,
  name: "Shoot right",
  projectile: {
    moves: [{ x: 1 }],
  },
  stepsPerAttack: 3,
});
new Weapon("down", {
  damage: 25,
  name: "Shoot down",
  projectile: {
    moves: [{ y: 1 }],
  },
  stepsPerAttack: 7,
});
new Weapon("up", {
  damage: 25,
  name: "Shoot up",
  projectile: {
    moves: [{ y: -1 }],
  },
  stepsPerAttack: 9,
});
