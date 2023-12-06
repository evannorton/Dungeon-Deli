import { Definable, getToken } from "./definables";
import { Direction } from "./types/Direction";
import {
  EntityPosition,
  createSprite,
  createSpriteInstance,
  getCurrentTime,
  getEntityPosition,
  lockCameraToEntity,
  setEntityLevel,
  setEntityPosition,
  setEntitySpriteInstance,
} from "pixel-pigeon";
import { Move } from "./types/Move";
import { Step } from "./types/Step";
import { walkDuration } from "./constants/walkDuration";

interface CharacterOptions {
  readonly entityID: string;
  readonly imagePath: string;
}

export class Character extends Definable {
  private readonly _options: CharacterOptions;
  private readonly _spriteInstanceID: string;
  private _direction: Direction = Direction.Down;
  private _move: Move | null = null;
  private _step: Step = Step.Left;
  public constructor(options: CharacterOptions) {
    super(getToken());
    this._options = options;
    const walkFrameDuration: number = Math.round(walkDuration / 2);
    const spriteID: string = createSprite({
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
          id: "idle-down",
        },
        {
          frames: [
            {
              height: 24,
              sourceHeight: 24,
              sourceWidth: 24,
              sourceX: 0,
              sourceY: 24,
              width: 24,
            },
          ],
          id: "idle-right",
        },
        {
          frames: [
            {
              height: 24,
              sourceHeight: 24,
              sourceWidth: 24,
              sourceX: 0,
              sourceY: 48,
              width: 24,
            },
          ],
          id: "idle-left",
        },
        {
          frames: [
            {
              height: 24,
              sourceHeight: 24,
              sourceWidth: 24,
              sourceX: 0,
              sourceY: 72,
              width: 24,
            },
          ],
          id: "idle-up",
        },
        {
          frames: [
            {
              duration: walkFrameDuration,
              height: 24,
              sourceHeight: 24,
              sourceWidth: 24,
              sourceX: 24,
              sourceY: 0,
              width: 24,
            },
            {
              height: 24,
              sourceHeight: 24,
              sourceWidth: 24,
              sourceX: 0,
              sourceY: 0,
              width: 24,
            },
          ],
          id: "walk-down-step-right",
        },
        {
          frames: [
            {
              duration: walkFrameDuration,
              height: 24,
              sourceHeight: 24,
              sourceWidth: 24,
              sourceX: 48,
              sourceY: 0,
              width: 24,
            },
            {
              height: 24,
              sourceHeight: 24,
              sourceWidth: 24,
              sourceX: 0,
              sourceY: 0,
              width: 24,
            },
          ],
          id: "walk-down-step-left",
        },
        {
          frames: [
            {
              duration: walkFrameDuration,
              height: 24,
              sourceHeight: 24,
              sourceWidth: 24,
              sourceX: 24,
              sourceY: 24,
              width: 24,
            },
            {
              height: 24,
              sourceHeight: 24,
              sourceWidth: 24,
              sourceX: 0,
              sourceY: 24,
              width: 24,
            },
          ],
          id: "walk-right-step-right",
        },
        {
          frames: [
            {
              duration: walkFrameDuration,
              height: 24,
              sourceHeight: 24,
              sourceWidth: 24,
              sourceX: 48,
              sourceY: 24,
              width: 24,
            },
            {
              height: 24,
              sourceHeight: 24,
              sourceWidth: 24,
              sourceX: 0,
              sourceY: 24,
              width: 24,
            },
          ],
          id: "walk-right-step-left",
        },
        {
          frames: [
            {
              duration: walkFrameDuration,
              height: 24,
              sourceHeight: 24,
              sourceWidth: 24,
              sourceX: 24,
              sourceY: 48,
              width: 24,
            },
            {
              height: 24,
              sourceHeight: 24,
              sourceWidth: 24,
              sourceX: 0,
              sourceY: 48,
              width: 24,
            },
          ],
          id: "walk-left-step-right",
        },
        {
          frames: [
            {
              duration: walkFrameDuration,
              height: 24,
              sourceHeight: 24,
              sourceWidth: 24,
              sourceX: 48,
              sourceY: 48,
              width: 24,
            },
            {
              height: 24,
              sourceHeight: 24,
              sourceWidth: 24,
              sourceX: 0,
              sourceY: 48,
              width: 24,
            },
          ],
          id: "walk-left-step-left",
        },
        {
          frames: [
            {
              duration: walkFrameDuration,
              height: 24,
              sourceHeight: 24,
              sourceWidth: 24,
              sourceX: 24,
              sourceY: 72,
              width: 24,
            },
            {
              height: 24,
              sourceHeight: 24,
              sourceWidth: 24,
              sourceX: 0,
              sourceY: 72,
              width: 24,
            },
          ],
          id: "walk-up-step-right",
        },
        {
          frames: [
            {
              duration: walkFrameDuration,
              height: 24,
              sourceHeight: 24,
              sourceWidth: 24,
              sourceX: 48,
              sourceY: 72,
              width: 24,
            },
            {
              height: 24,
              sourceHeight: 24,
              sourceWidth: 24,
              sourceX: 0,
              sourceY: 72,
              width: 24,
            },
          ],
          id: "walk-up-step-left",
        },
      ],
      imagePath: this._options.imagePath,
    });
    this._spriteInstanceID = createSpriteInstance({
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
      spriteID,
    });
    setEntitySpriteInstance(this._options.entityID, this._spriteInstanceID);
  }

  public get direction(): Direction {
    return this._direction;
  }

  public get step(): Step {
    return this._step;
  }

  public set direction(direction: Direction) {
    this._direction = direction;
  }

  public getEntityPosition(): EntityPosition {
    return getEntityPosition(this._options.entityID);
  }

  public lockCameraToEntity(): void {
    lockCameraToEntity(this._options.entityID);
  }

  public setEntityLevel(levelID: string): void {
    setEntityLevel(this._options.entityID, levelID);
  }

  public setEntityPosition(position: EntityPosition): void {
    setEntityPosition(this._options.entityID, position);
  }

  public startMovement(endPosition: EntityPosition): void {
    const startPosition: EntityPosition = getEntityPosition(
      this._options.entityID,
    );
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
  }

  public updateMovement(onEnd?: () => void): void {
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
        onEnd?.();
      }
    }
  }

  public isMoving(): boolean {
    return this._move !== null;
  }
}
