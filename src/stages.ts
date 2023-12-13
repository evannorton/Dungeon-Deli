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
  playAudioSource,
  removeLabel,
  removeQuadrilateral,
  setEntityLevel,
  setEntityPosition,
  stopAudioSource,
} from "pixel-pigeon";
import { Ingredient } from "./ingredients";
import {
  Mode,
  knockbackModeID,
  lifestealModeID,
  normalModeID,
  reverseModeID,
  slipperyModeID,
} from "./modes";
import { MonsterInstance } from "./monsterInstances";
import {
  Weapon,
  aoeCircleWeaponID,
  downWeaponID,
  leftWeaponID,
  rightWeaponID,
  upWeaponID,
} from "./weapons";
import { getUniqueRandomModeID } from "./functions/getUniqueRandomModeID";
import { musicVolumeChannelID } from "./volumeChannels";
import { playerMaxHP } from "./constants/playerMaxHP";
import { state } from "./state";

interface StageOptions {
  readonly audioSourceID: string;
  readonly ingredientID: string;
  readonly loopPoint: number;
  readonly modeIDs: string[];
  readonly nextStageID: string | null;
  readonly onStart?: () => void;
  readonly playerStartLevelID: string;
  readonly playerStartPosition: EntityPosition;
  readonly weaponIDs: string[];
}

export class Stage extends Definable {
  private _labelIDs: string[] = [];
  private readonly _options: StageOptions;
  private _quadrilateralIDs: string[] = [];
  public constructor(id: string, options: StageOptions) {
    super(id);
    this._options = options;
  }

  public get ingredient(): Ingredient {
    return getDefinable(Ingredient, this._options.ingredientID);
  }

  public get modes(): Mode[] {
    return this._options.modeIDs.map(
      (modeID: string): Mode => getDefinable(Mode, modeID),
    );
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
      state.setValues({
        isMain: false,
        isVictory: true,
      });
    }
  }

  public start(): void {
    if (state.values.musicAudioSourceID !== null) {
      stopAudioSource(state.values.musicAudioSourceID);
    }
    state.setValues({
      musicAudioSourceID: this._options.audioSourceID,
    });
    playAudioSource(this._options.audioSourceID, {
      loopPoint: this._options.loopPoint,
      volumeChannelID: musicVolumeChannelID,
    });
    state.setValues({ stageID: this._id });
    goToLevel(this._options.playerStartLevelID);
    if (state.values.playerCharacterID === null) {
      const playerEntityID: string = createEntity({
        height: 24,
        layerID: "characters",
        levelID: this._options.playerStartLevelID,
        position: this._options.playerStartPosition,
        type: "player",
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
    const modeID: string = this._options.modeIDs[0];
    const mode: Mode = getDefinable(Mode, modeID);
    state.setValues({
      attackingMonsterInstancesIDs: [],
      attackingWeaponsIDs: [],
      modeID,
      movingMonsterInstancesIDs: [],
      nextModeID: getUniqueRandomModeID(modeID),
      turn: 0,
      turnPart: null,
      untilNextMode: mode.turns,
    });
    this.removeHUD();
    this.createHUD();
    this._options.onStart?.();
  }

  private createHUD(): void {
    const width: number = 120;
    const height: number = 3 + this._options.weaponIDs.length * 10 + 14;
    const y: number = 312 - 2 - height;
    const condition = (): boolean => state.values.isMain;
    this._quadrilateralIDs.push(
      createQuadrilateral({
        color: "#000000",
        coordinates: {
          condition,
          x: 2,
          y,
        },
        height,
        opacity: 0.75,
        width,
      }),
    );
    this._labelIDs.push(
      createLabel({
        color: "#a8a8a8",
        coordinates: {
          condition,
          x: Math.round(2 + width / 2),
          y: y + 5,
        },
        horizontalAlignment: "center",
        text: "Power cooldowns",
      }),
    );
    this._options.weaponIDs.forEach(
      (weaponID: string, weaponIndex: number): void => {
        const weapon: Weapon = getDefinable(Weapon, weaponID);
        const untilNextColor = (): string => {
          if (
            weapon.stepsPerAttack -
              ((state.values.turn + weapon.stepsOffset) %
                weapon.stepsPerAttack) ===
            1
          ) {
            return "#58d332";
          }
          return "#a8a8a8";
        };
        this._labelIDs.push(
          createLabel({
            color: untilNextColor,
            coordinates: {
              condition,
              x: 5,
              y: y + 5 + weaponIndex * 10 + 12,
            },
            horizontalAlignment: "left",
            text: `${weapon.name}:`,
          }),
        );
        this._labelIDs.push(
          createLabel({
            color: untilNextColor,
            coordinates: {
              condition,
              x: 2 + width - 1,
              y: y + 5 + weaponIndex * 10 + 12,
            },
            horizontalAlignment: "right",
            text: (): string => {
              const amount: number =
                weapon.stepsPerAttack -
                ((state.values.turn + weapon.stepsOffset) %
                  weapon.stepsPerAttack);
              return `${amount} ${amount === 1 ? "turn" : "turns"}`;
            },
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
    this._labelIDs = [];
    this._quadrilateralIDs = [];
  }
}
new Stage("1", {
  audioSourceID: "cavern-theme-base",
  ingredientID: "bread",
  loopPoint: 12800,
  modeIDs: [normalModeID],
  nextStageID: "2",
  onStart: (): void => {
    state.setValues({ instructionsOpen: true });
  },
  playerStartLevelID: "tutorial_1",
  playerStartPosition: {
    x: 11 * 24,
    y: 8 * 24,
  },
  weaponIDs: [leftWeaponID, downWeaponID, rightWeaponID, upWeaponID],
});
new Stage("2", {
  audioSourceID: "cavern-theme-base",
  ingredientID: "meat",
  loopPoint: 12800,
  modeIDs: [
    normalModeID,
    lifestealModeID,
    slipperyModeID,
    knockbackModeID,
    reverseModeID,
  ],
  nextStageID: "3",
  playerStartLevelID: "crystals_1",
  playerStartPosition: {
    x: 14 * 24,
    y: 15 * 24,
  },
  weaponIDs: [leftWeaponID, downWeaponID, rightWeaponID, upWeaponID],
});
new Stage("3", {
  audioSourceID: "cheese-cave-base",
  ingredientID: "cheese",
  loopPoint: 13060,
  modeIDs: [
    normalModeID,
    lifestealModeID,
    slipperyModeID,
    knockbackModeID,
    reverseModeID,
  ],
  nextStageID: "4",
  playerStartLevelID: "cheese_1",
  playerStartPosition: {
    x: 24 * 24,
    y: 16 * 24,
  },
  weaponIDs: [
    aoeCircleWeaponID,
    leftWeaponID,
    downWeaponID,
    rightWeaponID,
    upWeaponID,
  ],
});
new Stage("4", {
  audioSourceID: "cheese-cave-base",
  ingredientID: "lettuce",
  loopPoint: 13060,
  modeIDs: [
    normalModeID,
    lifestealModeID,
    slipperyModeID,
    knockbackModeID,
    reverseModeID,
  ],
  nextStageID: "5",
  playerStartLevelID: "ruins_1",
  playerStartPosition: {
    x: 28 * 24,
    y: 30 * 24,
  },
  weaponIDs: [
    aoeCircleWeaponID,
    leftWeaponID,
    downWeaponID,
    rightWeaponID,
    upWeaponID,
  ],
});
new Stage("5", {
  audioSourceID: "cheese-cave-base",
  ingredientID: "tomato",
  loopPoint: 13060,
  modeIDs: [
    normalModeID,
    lifestealModeID,
    slipperyModeID,
    knockbackModeID,
    reverseModeID,
  ],
  nextStageID: null,
  playerStartLevelID: "frozen_1",
  playerStartPosition: {
    x: 240,
    y: 144,
  },
  weaponIDs: [],
});
