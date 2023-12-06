import { Character } from "./characters";
import { Definable, getDefinable } from "./definables";
import {
  EntityPosition,
  createLabel,
  createQuadrilateral,
  goToLevel,
  spawnEntity,
} from "pixel-pigeon";
import { Mode } from "./modes";
import { Weapon } from "./weapons";
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
    if (state.values.playerCharacterID === null) {
      const playerEntityID: string = spawnEntity({
        height: 24,
        layerID: "player",
        position: this._options.playerStartPosition,
        width: 24,
        zIndex: 0,
      });
      const character: Character = new Character({
        entityID: playerEntityID,
        imagePath: "player",
      });
      character.lockCameraToEntity();
      state.setValues({
        playerCharacterID: character.id,
      });
    } else {
      const character: Character = getDefinable(
        Character,
        state.values.playerCharacterID,
      );
      character.setEntityPosition(this._options.playerStartPosition);
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
        y: 270 - 35,
      },
      height: 33,
      opacity: 0.5,
      width: 118,
    });
    createLabel({
      color: "#ffffff",
      coordinates: {
        x: 5,
        y: 270 - 32,
      },
      getText: (): string => "Mode:",
      horizontalAlignment: "left",
      verticalAlignment: "top",
    });
    createLabel({
      color: "#ffffff",
      coordinates: {
        x: 117,
        y: 270 - 32,
      },
      getText: (): string => getDefinable(Mode, state.values.modeID).name,
      horizontalAlignment: "right",
      verticalAlignment: "top",
    });
    createLabel({
      color: "#ffffff",
      coordinates: {
        x: 5,
        y: 270 - 22,
      },
      getText: (): string => "Next mode:",
      horizontalAlignment: "left",
      verticalAlignment: "top",
    });
    createLabel({
      color: "#ffffff",
      coordinates: {
        x: 117,
        y: 270 - 22,
      },
      getText: (): string => getDefinable(Mode, state.values.nextModeID).name,
      horizontalAlignment: "right",
      verticalAlignment: "top",
    });
    createLabel({
      color: "#ffffff",
      coordinates: {
        x: 5,
        y: 270 - 12,
      },
      getText: (): string => "Until next:",
      horizontalAlignment: "left",
      verticalAlignment: "top",
    });
    createLabel({
      color: "#ffffff",
      coordinates: {
        x: 117,
        y: 270 - 12,
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
        x: 480 - 92,
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
            x: 480 - 89,
            y: 5 + weaponIndex * 10,
          },
          getText: (): string => `${weapon.name}:`,
          horizontalAlignment: "left",
          verticalAlignment: "top",
        });
        createLabel({
          color: "#ffffff",
          coordinates: {
            x: 480 - 5,
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
