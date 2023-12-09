import { Character } from "./characters";
import { Chest } from "./chests";
import { Definable, getDefinable, getDefinables } from "./definables";
import {
  EntityPosition,
  createEntity,
  createLabel,
  createQuadrilateral,
  goToLevel,
  lockCameraToEntity,
  removeLabel,
  removeQuadrilateral,
  setEntityLevel,
  setEntityPosition,
} from "pixel-pigeon";
import { Ingredient } from "./ingredients";
import { MonsterInstance } from "./monsterInstances";
import { Weapon } from "./weapons";
import { getRandomModeID } from "./functions/getRandomModeID";
import { getUniqueRandomModeID } from "./functions/getUniqueRandomModeID";
import { playerMaxHP } from "./constants/playerMaxHP";
import { state } from "./state";

interface StageOptions {
  readonly ingredientID: string;
  readonly nextStageID: string | null;
  readonly playerStartLevelID: string;
  readonly playerStartPosition: EntityPosition;
  readonly weaponIDs: string[];
}

export class Stage extends Definable {
  private readonly _labelIDs: string[] = [];
  private readonly _options: StageOptions;
  private readonly _quadrilateralIDs: string[] = [];
  public constructor(id: string, options: StageOptions) {
    super(id);
    this._options = options;
  }

  public get ingredient(): Ingredient {
    return getDefinable(Ingredient, this._options.ingredientID);
  }

  public get weapons(): Weapon[] {
    return this._options.weaponIDs.map(
      (weaponID: string): Weapon => getDefinable(Weapon, weaponID),
    );
  }

  public goToNext(): void {
    if (this._options.nextStageID !== null) {
      this.removeHUD();
      getDefinable(Stage, this._options.nextStageID).start();
    } else {
      console.log("you beat the game");
    }
  }

  public start(): void {
    state.setValues({ stageID: this._id });
    goToLevel(this._options.playerStartLevelID);
    if (state.values.playerCharacterID === null) {
      const playerEntityID: string = createEntity({
        height: 24,
        layerID: "characters",
        levelID: this._options.playerStartLevelID,
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
      const playerCharacter: Character = getDefinable(
        Character,
        state.values.playerCharacterID,
      );
      playerCharacter.reset();
      setEntityLevel(
        playerCharacter.entityID,
        this._options.playerStartLevelID,
      );
      setEntityPosition(
        playerCharacter.entityID,
        this._options.playerStartPosition,
      );
    }
    for (const monsterInstance of getDefinables(MonsterInstance).values()) {
      monsterInstance.reset();
    }
    for (const chest of getDefinables(Chest).values()) {
      chest.close();
    }
    const modeID: string = getRandomModeID();
    state.setValues({
      attackingMonsterInstancesIDs: [],
      attackingWeaponsIDs: [],
      modeID,
      movingMonsterInstancesIDs: [],
      nextModeID: getUniqueRandomModeID(modeID),
      turn: 0,
      turnPart: null,
    });
    this.createHUD();
  }

  private createHUD(): void {
    this._quadrilateralIDs.push(
      createQuadrilateral({
        color: "#000000",
        coordinates: {
          x: 480 - 92,
          y: 2,
        },
        height: 3 + this._options.weaponIDs.length * 10,
        opacity: 0.625,
        width: 92,
      }),
    );
    this._options.weaponIDs.forEach(
      (weaponID: string, weaponIndex: number): void => {
        const weapon: Weapon = getDefinable(Weapon, weaponID);
        this._labelIDs.push(
          createLabel({
            color: "#ffffff",
            coordinates: {
              x: 480 - 89,
              y: 5 + weaponIndex * 10,
            },
            horizontalAlignment: "left",
            text: weapon.name,
          }),
        );
        this._labelIDs.push(
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
          }),
        );
      },
    );
  }

  private removeHUD(): void {
    for (const labelID of this._labelIDs) {
      removeLabel(labelID);
    }
    for (const quadrilateralID of this._quadrilateralIDs) {
      removeQuadrilateral(quadrilateralID);
    }
  }
}
new Stage("tutorial", {
  ingredientID: "bread",
  nextStageID: "crystals",
  playerStartLevelID: "tutorial_1",
  playerStartPosition: {
    x: 264,
    y: 168,
  },
  weaponIDs: ["up", "left", "right", "down"],
});
new Stage("crystals", {
  ingredientID: "meat",
  nextStageID: "cheese",
  playerStartLevelID: "crystals_1",
  playerStartPosition: {
    x: 240,
    y: 144,
  },
  weaponIDs: ["up", "left", "right", "down"],
});
new Stage("cheese", {
  ingredientID: "cheese",
  nextStageID: "ruins",
  playerStartLevelID: "cheese_1",
  playerStartPosition: {
    x: 240,
    y: 144,
  },
  weaponIDs: ["up", "left", "right", "down"],
});
new Stage("ruins", {
  ingredientID: "lettuce",
  nextStageID: "frozen",
  playerStartLevelID: "ruins_1",
  playerStartPosition: {
    x: 240,
    y: 144,
  },
  weaponIDs: ["up", "left", "right", "down"],
});
new Stage("frozen", {
  ingredientID: "tomato",
  nextStageID: null,
  playerStartLevelID: "frozen_1",
  playerStartPosition: {
    x: 240,
    y: 144,
  },
  weaponIDs: ["up", "left", "right", "down"],
});
