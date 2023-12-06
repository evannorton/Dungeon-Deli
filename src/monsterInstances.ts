import { Definable, getDefinable } from "./definables";
import { Direction } from "./types/Direction";
import {
  EntityPosition,
  createSpriteInstance,
  getCurrentTime,
  getEntityCalculatedPath,
  getEntityPosition,
  setEntityPosition,
  setEntitySpriteInstance,
} from "pixel-pigeon";
import { Monster } from "./monsters";
import { Move } from "./types/Move";
import { Step } from "./types/Step";
import { state } from "./state";
import { walkDuration } from "./constants/walkDuration";

interface MonsterInstanceOptions {
  readonly entityID: string;
  readonly monsterID: string;
}

export class MonsterInstance extends Definable {
  private _direction: Direction = Direction.Down;
  private readonly _options: MonsterInstanceOptions;
  private _move: Move | null = null;
  private _step: Step = Step.Left;
  public constructor(options: MonsterInstanceOptions) {
    super(options.entityID);
    this._options = options;
    const spriteInstanceID: string = createSpriteInstance({
      getAnimationID: (): string => {
        const step: string = this._step;
        const direction: string = this._direction;
        if (this._move !== null) {
          const { endPosition, startPosition, time } = this._move;
          if (getCurrentTime() <= time + walkDuration) {
            if (endPosition.x > startPosition.x) {
              return `walk-${direction}-step-${step}`;
            }
            if (endPosition.x < startPosition.x) {
              return `walk-${direction}-step-${step}`;
            }
            if (endPosition.y > startPosition.y) {
              return `walk-${direction}-step-${step}`;
            }
            if (endPosition.y < startPosition.y) {
              return `walk-${direction}-step-${step}`;
            }
          }
          if (endPosition.x > startPosition.x) {
            return `idle-${direction}`;
          }
          if (endPosition.x < startPosition.x) {
            return `idle-${direction}`;
          }
          if (endPosition.y > startPosition.y) {
            return `idle-${direction}`;
          }
          if (endPosition.y < startPosition.y) {
            return `idle-${direction}`;
          }
        }
        return `idle-${direction}`;
      },
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
      const startPosition: EntityPosition = getEntityPosition(
        this._options.entityID,
      );
      const endPosition: EntityPosition = path[1];
      const getDirection = (): Direction => {
        if (endPosition.y > startPosition.y) {
          return Direction.Down;
        }
        if (endPosition.y < startPosition.y) {
          return Direction.Up;
        }
        if (endPosition.x > startPosition.x) {
          return Direction.Right;
        }
        if (endPosition.x < startPosition.x) {
          return Direction.Left;
        }
        return this._direction;
      };
      this._direction = getDirection();
      this._step = this._step === Step.Left ? Step.Right : Step.Left;
      this._move = {
        endPosition,
        startPosition,
        time: getCurrentTime(),
      };
    } else {
      // TODO: Attack player
    }
  }

  public updateMovement(): void {
    if (this._move !== null) {
      const { endPosition, startPosition, time } = this._move;
      const currentTime: number = getCurrentTime();
      if (currentTime <= time + walkDuration) {
        const divisor: number = currentTime - time;
        const percent: number = Math.min(divisor / walkDuration, 1);
        const offset: number = Math.floor(24 * percent);
        let xOffset: number = 0;
        let yOffset: number = 0;
        if (endPosition.x > startPosition.x) {
          xOffset = offset;
        }
        if (endPosition.x < startPosition.x) {
          xOffset = -offset;
        }
        if (endPosition.y > startPosition.y) {
          yOffset = offset;
        }
        if (endPosition.y < startPosition.y) {
          yOffset = -offset;
        }
        setEntityPosition(this._options.entityID, {
          x: startPosition.x + xOffset,
          y: startPosition.y + yOffset,
        });
      } else {
        setEntityPosition(this._options.entityID, endPosition);
        this._move = null;
      }
    }
  }

  public isMoving(): boolean {
    return this._move !== null;
  }
}
