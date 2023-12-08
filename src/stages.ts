import { Character } from "./characters";
import { Definable, getDefinable } from "./definables";
import {
  EntityPosition,
  createEntity,
  createLabel,
  createQuadrilateral,
  goToLevel,
  lockCameraToEntity,
  setEntityPosition,
} from "pixel-pigeon";
import { Mode } from "./modes";
import { Weapon } from "./weapons";
import { playerMaxHP } from "./constants/playerMaxHP";
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

  public get weapons(): Weapon[] {
    return this._options.weaponIDs.map(
      (weaponID: string): Weapon => getDefinable(Weapon, weaponID),
    );
  }

  public start(): void {
    state.setValues({ stageID: this._id });
    goToLevel(this._options.levelID);
    if (state.values.playerCharacterID === null) {
      const playerEntityID: string = createEntity({
        height: 24,
        layerID: "characters",
        position: this._options.playerStartPosition,
        width: 24,
        zIndex: 0,
      });
      const character: Character = new Character({
        entityID: playerEntityID,
        imagePath: "player",
        maxHP: playerMaxHP,
      });
      lockCameraToEntity(character.entityID);
      state.setValues({
        playerCharacterID: character.id,
      });
    } else {
      const character: Character = getDefinable(
        Character,
        state.values.playerCharacterID,
      );
      setEntityPosition(character.entityID, this._options.playerStartPosition);
    }
    this.createHUD();
    console.log("create hud");
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
      opacity: 0.625,
      width: 118,
    });
    createLabel({
      color: "#ffffff",
      coordinates: {
        x: 5,
        y: 270 - 32,
      },
      horizontalAlignment: "left",
      text: "Mode:",
      verticalAlignment: "top",
    });
    createLabel({
      color: "#ffffff",
      coordinates: {
        x: 117,
        y: 270 - 32,
      },
      horizontalAlignment: "right",
      text: (): string => getDefinable(Mode, state.values.modeID).name,
      verticalAlignment: "top",
    });
    createLabel({
      color: "#ffffff",
      coordinates: {
        x: 5,
        y: 270 - 22,
      },
      horizontalAlignment: "left",
      text: "Next mode:",
      verticalAlignment: "top",
    });
    createLabel({
      color: "#ffffff",
      coordinates: {
        x: 117,
        y: 270 - 22,
      },
      horizontalAlignment: "right",
      text: (): string => getDefinable(Mode, state.values.nextModeID).name,
      verticalAlignment: "top",
    });
    createLabel({
      color: "#ffffff",
      coordinates: {
        x: 5,
        y: 270 - 12,
      },
      horizontalAlignment: "left",
      text: "Until next:",
      verticalAlignment: "top",
    });
    createLabel({
      color: "#ffffff",
      coordinates: {
        x: 117,
        y: 270 - 12,
      },
      horizontalAlignment: "right",
      text: (): string =>
        String(turnsPerMode - (state.values.turn % turnsPerMode)),
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
      opacity: 0.625,
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
          horizontalAlignment: "left",
          text: weapon.name,
          verticalAlignment: "top",
        });
        createLabel({
          color: "#ffffff",
          coordinates: {
            x: 480 - 5,
            y: 5 + weaponIndex * 10,
          },
          horizontalAlignment: "right",
          text: (): string =>
            String(
              weapon.stepsPerAttack -
                (state.values.turn % weapon.stepsPerAttack),
            ),
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
