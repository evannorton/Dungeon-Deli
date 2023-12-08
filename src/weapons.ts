import { Character } from "./characters";
import { Definable, getDefinable } from "./definables";
import {
  EntityPosition,
  createEntity,
  createSprite,
  getCurrentTime,
  removeEntity,
} from "pixel-pigeon";
import { TurnPart } from "./types/TurnPart";
import { projectileDuration } from "./constants/projectileDuration";
import { startMonsterInstancesMovement } from "./functions/startMonsterInstancesMovement";
import { state } from "./state";

export interface WeaponAttack {
  readonly entityID: string;
  readonly positions: EntityPosition[];
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
    this._attack = {
      entityID: projectileEntityID,
      positions: [playerEntityPosition],
      time: getCurrentTime(),
    };
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
      if (currentTime > time + projectileDuration) {
        state.setValues({
          attackingWeaponsIDs: state.values.attackingWeaponsIDs.filter(
            (weaponID: string): boolean => weaponID !== this._id,
          ),
        });
        removeEntity(this._attack.entityID);
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
