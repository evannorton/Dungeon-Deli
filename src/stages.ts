import { Definable, getDefinable } from "./definables";
import {
  EntityPosition,
  createLabel,
  createQuadrilateral,
  createSpriteInstance,
  goToLevel,
  lockCameraToEntity,
  setEntityPosition,
  spawnEntity,
} from "pixel-pigeon";
import { Mode } from "./modes";
import { Weapon } from "./weapons";
import { playerSpriteID } from "./sprites";
import { state } from "./state";
import { turnsPerMode } from "./constants/turnsPerMode";

interface StageOptions {
  readonly levelID: string;
  readonly playerStartPosition: EntityPosition;
  readonly weaponIDs: string[];
}

export class Stage extends Definable {
  private readonly _options: StageOptions;
  public constructor(id: string, options: StageOptions) {
    super(id);
    this._options = options;
  }

  public start(): void {
    state.setValues({ stageID: this._id });
    goToLevel(this._options.levelID);
    if (state.values.playerEntityID === null) {
      const playerSpriteInstanceID: string = createSpriteInstance({
        getAnimationID: (): string => "default",
        spriteID: playerSpriteID,
      });
      const playerEntityID: string = spawnEntity({
        height: 24,
        layerID: "player",
        position: this._options.playerStartPosition,
        spriteInstanceID: playerSpriteInstanceID,
        width: 24,
        zIndex: 0,
      });
      lockCameraToEntity(playerEntityID);
      state.setValues({
        playerEntityID,
      });
    } else {
      setEntityPosition(
        state.values.playerEntityID,
        this._options.playerStartPosition,
      );
    }
    this.createHUD();
  }

  public doTurn(): void {
    for (const weaponID of this._options.weaponIDs) {
      const weapon: Weapon = getDefinable(Weapon, weaponID);
      weapon.doTurn();
    }
  }

  private createHUD(): void {
    // Bottom left
    createQuadrilateral({
      color: "#000000",
      coordinates: {
        x: 2,
        y: 145,
      },
      height: 33,
      opacity: 0.5,
      width: 118,
    });
    createLabel({
      color: "#ffffff",
      coordinates: {
        x: 5,
        y: 148,
      },
      getText: (): string => "Mode:",
      horizontalAlignment: "left",
      verticalAlignment: "top",
    });
    createLabel({
      color: "#ffffff",
      coordinates: {
        x: 117,
        y: 148,
      },
      getText: (): string => getDefinable(Mode, state.values.modeID).name,
      horizontalAlignment: "right",
      verticalAlignment: "top",
    });
    createLabel({
      color: "#ffffff",
      coordinates: {
        x: 5,
        y: 158,
      },
      getText: (): string => "Next mode:",
      horizontalAlignment: "left",
      verticalAlignment: "top",
    });
    createLabel({
      color: "#ffffff",
      coordinates: {
        x: 117,
        y: 158,
      },
      getText: (): string => getDefinable(Mode, state.values.nextModeID).name,
      horizontalAlignment: "right",
      verticalAlignment: "top",
    });
    createLabel({
      color: "#ffffff",
      coordinates: {
        x: 5,
        y: 168,
      },
      getText: (): string => "Until next:",
      horizontalAlignment: "left",
      verticalAlignment: "top",
    });
    createLabel({
      color: "#ffffff",
      coordinates: {
        x: 117,
        y: 168,
      },
      getText: (): string =>
        String(turnsPerMode - (state.values.turn % turnsPerMode)),
      horizontalAlignment: "right",
      verticalAlignment: "top",
    });
    // Top right
    createQuadrilateral({
      color: "#000000",
      coordinates: {
        x: 228,
        y: 2,
      },
      height: 3 + this._options.weaponIDs.length * 10,
      opacity: 0.5,
      width: 92,
    });
    this._options.weaponIDs.forEach(
      (weaponID: string, weaponIndex: number): void => {
        const weapon: Weapon = getDefinable(Weapon, weaponID);
        createLabel({
          color: "#ffffff",
          coordinates: {
            x: 231,
            y: 5 + weaponIndex * 10,
          },
          getText: (): string => `${weapon.name}:`,
          horizontalAlignment: "left",
          verticalAlignment: "top",
        });
        createLabel({
          color: "#ffffff",
          coordinates: {
            x: 315,
            y: 5 + weaponIndex * 10,
          },
          getText: (): string =>
            String(
              weapon.stepsPerAttack -
                (state.values.turn % weapon.stepsPerAttack),
            ),
          horizontalAlignment: "right",
          verticalAlignment: "top",
        });
      },
    );
  }
}
new Stage("1", {
  levelID: "test_1",
  playerStartPosition: {
    x: 48,
    y: 48,
  },
  weaponIDs: ["up", "left", "right", "down"],
});
