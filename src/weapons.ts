import {
  CollisionData,
  EntityCollidable,
  EntityPosition,
  despawnEntity,
  getEntityPosition,
} from "pixel-pigeon";
import { Definable } from "./definables";
import { getRectangleCollisionData } from "pixel-pigeon/api/functions/getRectangleCollisionData";
import { state } from "./state";

interface WeaponOptionsProjectileMove {
  readonly x?: number;
  readonly y?: number;
}
interface WeaponOptionsProjectile {
  readonly moves: WeaponOptionsProjectileMove[];
}
interface WeaponOptions {
  readonly name: string;
  readonly projectile?: WeaponOptionsProjectile;
  readonly stepsPerAttack: number;
}

export class Weapon extends Definable {
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

  public doTurn(): void {
    if (state.values.playerEntityID === null) {
      throw new Error(
        `Weapon "${this._id}" attemped to do turn with no player entity.`,
      );
    }
    if (state.values.turn % this._options.stepsPerAttack === 0) {
      if (typeof this._options.projectile !== "undefined") {
        const position: EntityPosition = getEntityPosition(
          state.values.playerEntityID,
        );
        let entityID: string | null = null;
        outerLoop: while (entityID === null) {
          for (const move of this._options.projectile.moves) {
            position.x += (move.x ?? 0) * 24;
            position.y += (move.y ?? 0) * 24;
            const collisionData: CollisionData = getRectangleCollisionData(
              {
                height: 24,
                width: 24,
                x: position.x,
                y: position.y,
              },
              ["monsters"],
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
        if (entityID !== null) {
          despawnEntity(entityID);
        }
      }
    }
  }
}
new Weapon("left", {
  name: "Shoot left",
  projectile: {
    moves: [{ x: -1 }],
  },
  stepsPerAttack: 5,
});
new Weapon("right", {
  name: "Shoot right",
  projectile: {
    moves: [{ x: 1 }],
  },
  stepsPerAttack: 3,
});
new Weapon("down", {
  name: "Shoot down",
  projectile: {
    moves: [{ y: 1 }],
  },
  stepsPerAttack: 7,
});
new Weapon("up", {
  name: "Shoot up",
  projectile: {
    moves: [{ y: -1 }],
  },
  stepsPerAttack: 9,
});
