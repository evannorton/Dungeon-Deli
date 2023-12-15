import {
  CreateSpriteOptionsAnimation,
  EntityPosition,
  addEntityQuadrilateral,
  addEntitySprite,
  createQuadrilateral,
  createSprite,
  getCurrentTime,
  getEntityPosition,
  setEntityBlockingPosition,
  setEntityPosition,
} from "pixel-pigeon";
import { Definable, getDefinables, getToken } from "./definables";
import { Direction } from "./types/Direction";
import { Mode, normalModeID } from "./modes";
import { Move } from "./types/Move";
import { Step } from "./types/Step";
import { monsterAttackDuration } from "./constants/monsterAttackDuration";
import { state } from "./state";
import { walkDuration } from "./constants/walkDuration";

interface Knockback {
  readonly endPosition: EntityPosition;
  readonly startPosition: EntityPosition;
  readonly time: number;
}
interface CharacterOptions {
  readonly entityID: string;
  readonly imagePath: string;
  readonly maxHP: number;
}

export class Character extends Definable {
  private readonly _options: CharacterOptions;
  private _attackedAt: number | null = null;
  private _direction: Direction = Direction.Down;
  private _hp: number;
  private _knockback: Knockback | null = null;
  private _move: Move | null = null;
  private _lastPosition: EntityPosition | null = null;
  private _step: Step = Step.Left;
  public constructor(options: CharacterOptions) {
    super(getToken());
    this._options = options;
    this._hp = options.maxHP;
    const walkFrameDuration: number = Math.round(walkDuration / 2);
    const spriteID: string = createSprite({
      animationID: (): string => {
        if (this.hp === 0) {
          return "dead";
        }
        const step: Step = this._step;
        const altStep: Step = this._step === Step.Left ? Step.Right : Step.Left;
        const direction: string = this._direction;
        if (
          this._attackedAt !== null &&
          getCurrentTime() <= this._attackedAt + monsterAttackDuration
        ) {
          return `attack-${direction}`;
        }
        if (this._move !== null) {
          const diff: number = getCurrentTime() - this._move.time;
          const mod: number = diff % (walkDuration * 3);
          if (mod <= walkDuration) {
            return `walk-${direction}-step-${step}`;
          }
          if (mod <= walkDuration * 1.5) {
            return `idle-${direction}`;
          }
          if (mod <= walkDuration * 2) {
            return `walk-${direction}-step-${altStep}`;
          }
          return `idle-${direction}`;
        }
        return `idle-${direction}`;
      },
      animations: [
        {
          frames: [
            {
              height: 24,
              sourceHeight: 24,
              sourceWidth: 24,
              sourceX: 96,
              sourceY: 0,
              width: 24,
            },
          ],
          id: "dead",
        },
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
        {
          frames: [
            {
              height: 24,
              sourceHeight: 24,
              sourceWidth: 24,
              sourceX: 96,
              sourceY: 0,
              width: 24,
            },
          ],
          id: "attack-down",
        },
        {
          frames: [
            {
              height: 24,
              sourceHeight: 24,
              sourceWidth: 24,
              sourceX: 96,
              sourceY: 24,
              width: 24,
            },
          ],
          id: "attack-right",
        },
        {
          frames: [
            {
              height: 24,
              sourceHeight: 24,
              sourceWidth: 24,
              sourceX: 96,
              sourceY: 48,
              width: 24,
            },
          ],
          id: "attack-left",
        },
        {
          frames: [
            {
              height: 24,
              sourceHeight: 24,
              sourceWidth: 24,
              sourceX: 96,
              sourceY: 72,
              width: 24,
            },
          ],
          id: "attack-up",
        },
      ],
      imagePath: this._options.imagePath,
    });
    const animations: CreateSpriteOptionsAnimation[] = [
      {
        frames: [],
        id: "empty",
      },
    ];
    const modeAnimationDuration: number = 250;
    for (const mode of getDefinables(Mode).values()) {
      animations.push({
        frames: [
          {
            duration: modeAnimationDuration,
            height: 24,
            sourceHeight: 24,
            sourceWidth: 24,
            sourceX: 0,
            sourceY: mode.sourceY,
            width: 24,
          },
          {
            duration: modeAnimationDuration,
            height: 24,
            sourceHeight: 24,
            sourceWidth: 24,
            sourceX: 24,
            sourceY: mode.sourceY,
            width: 24,
          },
          {
            duration: modeAnimationDuration,
            height: 24,
            sourceHeight: 24,
            sourceWidth: 24,
            sourceX: 48,
            sourceY: mode.sourceY,
            width: 24,
          },
        ],
        id: mode.id,
      });
    }
    const modeSpriteID: string = createSprite({
      animationID: (): string => {
        if (state.values.modeID === null || this.isAlive() === false) {
          return normalModeID;
        }
        return state.values.modeID;
      },
      animations,
      imagePath: "mode-effects",
    });
    addEntitySprite(this._options.entityID, {
      spriteID: modeSpriteID,
    });
    addEntitySprite(this._options.entityID, {
      spriteID,
    });
    const hpBackQuadrilateralID: string = createQuadrilateral({
      color: "#000000",
      height: 2,
      width: 16,
    });
    addEntityQuadrilateral(this._options.entityID, {
      quadrilateralID: hpBackQuadrilateralID,
      x: 4,
      y: -3,
    });
    const hpFrontQuadrilateralID: string = createQuadrilateral({
      color: "#e03c28",
      height: 2,
      width: (): number => Math.ceil(16 * (this._hp / this._options.maxHP)),
    });
    addEntityQuadrilateral(this._options.entityID, {
      quadrilateralID: hpFrontQuadrilateralID,
      x: 4,
      y: -3,
    });
  }

  public get direction(): Direction {
    return this._direction;
  }

  public get entityID(): string {
    return this._options.entityID;
  }

  public get hp(): number {
    return this._hp;
  }

  public get lastPosition(): EntityPosition | null {
    return this._lastPosition;
  }

  public get step(): Step {
    return this._step;
  }

  public set direction(direction: Direction) {
    this._direction = direction;
  }

  public isAlive(): boolean {
    return this._hp > 0;
  }

  public isFullyRestored(): boolean {
    return this._hp === this._options.maxHP;
  }

  public reset(): void {
    this._hp = this._options.maxHP;
    this._direction = Direction.Down;
    this._step = Step.Left;
  }

  public restoreHealth(health: number): void {
    this._hp = Math.min(this._hp + health, this._options.maxHP);
  }

  public startAttackAnimation(): void {
    this._attackedAt = getCurrentTime();
  }

  public startKnockback(endPosition: EntityPosition): void {
    const startPosition: EntityPosition = getEntityPosition(
      this._options.entityID,
    );
    this._knockback = {
      endPosition,
      startPosition,
      time: getCurrentTime(),
    };
    setEntityBlockingPosition(this._options.entityID, endPosition);
    this._lastPosition = startPosition;
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
    setEntityBlockingPosition(this._options.entityID, endPosition);
    this._lastPosition = startPosition;
  }

  public takeDamage(damage: number): void {
    this._hp = Math.max(this._hp - damage, 0);
  }

  public updateKnockback(onEnd?: () => void): void {
    if (this._knockback !== null) {
      const { endPosition, startPosition, time } = this._knockback;
      const currentTime: number = getCurrentTime();
      const xDiff: number = Math.abs(endPosition.x - startPosition.x);
      const yDiff: number = Math.abs(endPosition.y - startPosition.y);
      const maxDiff: number = Math.max(xDiff, yDiff);
      const totalDuration: number = (maxDiff / 24) * walkDuration;
      if (currentTime <= time + totalDuration) {
        const divisor: number = currentTime - time;
        const percent: number = Math.min(divisor / totalDuration, 1);
        let xOffset: number = Math.floor(xDiff * percent);
        let yOffset: number = Math.floor(yDiff * percent);
        if (endPosition.x < startPosition.x) {
          xOffset = -xOffset;
        }
        if (endPosition.y < startPosition.y) {
          yOffset = -yOffset;
        }
        setEntityPosition(this._options.entityID, {
          x: startPosition.x + xOffset,
          y: startPosition.y + yOffset,
        });
      } else {
        setEntityPosition(this._options.entityID, endPosition);
        this._knockback = null;
        onEnd?.();
      }
    }
  }

  public updateMovement(onEnd?: () => void): void {
    if (this._move !== null) {
      const { endPosition, startPosition, time } = this._move;
      const currentTime: number = getCurrentTime();
      const xDiff: number = Math.abs(endPosition.x - startPosition.x);
      const yDiff: number = Math.abs(endPosition.y - startPosition.y);
      const maxDiff: number = Math.max(xDiff, yDiff);
      const totalDuration: number = (maxDiff / 24) * walkDuration;
      if (currentTime <= time + totalDuration) {
        const divisor: number = currentTime - time;
        const percent: number = Math.min(divisor / totalDuration, 1);
        let xOffset: number = Math.floor(xDiff * percent);
        let yOffset: number = Math.floor(yDiff * percent);
        if (endPosition.x < startPosition.x) {
          xOffset = -xOffset;
        }
        if (endPosition.y < startPosition.y) {
          yOffset = -yOffset;
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
}
