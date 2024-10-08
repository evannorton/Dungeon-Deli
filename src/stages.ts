import { Character } from "./characters";
import { Chest } from "./chests";
import {
  CreateLabelOptionsText,
  EntityPosition,
  createEntity,
  createLabel,
  createQuadrilateral,
  getCurrentTime,
  goToLevel,
  lockCameraToEntity,
  playAudioSource,
  removeLabel,
  removeQuadrilateral,
  setEntityLevel,
  setEntityPosition,
  stopAudioSource,
  unlockAchievement,
} from "pixel-pigeon";
import { Definable, getDefinable, getDefinables } from "definables";
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
  burstAreaWeaponID,
  burstRingWeaponID,
  diagonalBottomLeftWeaponID,
  diagonalBottomRightWeaponID,
  diagonalTopLeftWeaponID,
  diagonalTopRightWeaponID,
  downWeaponID,
  leftWeaponID,
  rightWeaponID,
  upWeaponID,
} from "./weapons";
import { clearGameAchievementID } from "./achievements";
import { createVictoryHUD } from "./functions/createVictoryHUD";
import { getUniqueRandomModeID } from "./functions/getUniqueRandomModeID";
import { musicVolumeChannelID } from "./volumeChannels";
import { playerMaxHP } from "./constants/playerMaxHP";
import { state } from "./state";

interface WeaponGroup {
  name: string;
  weaponIDs: string[];
}
interface StageOptions {
  readonly audioSourceID: string;
  readonly ingredientID: string;
  readonly loopPoint: number;
  readonly modeIDs: string[];
  readonly nextStageID: string | null;
  readonly onStart?: () => void;
  readonly parSteps: number;
  readonly playerStartLevelID: string;
  readonly playerStartPosition: EntityPosition;
  readonly weapons: (string | WeaponGroup)[];
}

export class Stage extends Definable {
  private _achievedParSteps: boolean = false;
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

  public get parSteps(): number {
    return this._options.parSteps;
  }

  public get playerStartLevelID(): string {
    return this._options.playerStartLevelID;
  }

  public get weapons(): WeaponGroup[] {
    return this._options.weapons.map(
      (weapon: string | WeaponGroup): WeaponGroup =>
        typeof weapon === "string"
          ? {
              name: getDefinable(Weapon, weapon).name,
              weaponIDs: [weapon],
            }
          : weapon,
    );
  }

  public goToNext(): void {
    if (state.values.turn <= this.parSteps) {
      this._achievedParSteps = true;
    }
    if (this._options.nextStageID !== null) {
      this.removeHUD();
      getDefinable(Stage, this._options.nextStageID).start();
    } else {
      if (state.values.musicAudioSourceID !== null) {
        stopAudioSource(state.values.musicAudioSourceID);
      }
      state.setValues({
        isMain: false,
        isVictory: true,
        victoryStartedAt: getCurrentTime(),
      });
      playAudioSource("main-theme", {
        volumeChannelID: musicVolumeChannelID,
      });
      createVictoryHUD();
      unlockAchievement(clearGameAchievementID);
      if (
        Array.from(getDefinables(Stage)).every(
          ([, stage]: [unknown, Stage]): boolean => stage._achievedParSteps,
        )
      ) {
        unlockAchievement("par-times");
      }
    }
  }

  public start(): void {
    if (this._options.audioSourceID !== state.values.musicAudioSourceID) {
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
    }
    state.setValues({
      instructionsOpen: false,
      stageID: this._id,
      stageStartedAt: getCurrentTime(),
    });
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
    const modeID: string | undefined = this._options.modeIDs[0];
    if (typeof modeID === "undefined") {
      throw new Error("No mode found.");
    }
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
    const height: number = 3 + this._options.weapons.length * 10 + 14;
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
        text: { value: "Power cooldowns" },
      }),
    );
    this.weapons.forEach(
      (weaponGroup: WeaponGroup, weaponIndex: number): void => {
        if (typeof weaponGroup.weaponIDs[0] === "undefined") {
          throw new Error("No weapon");
        }
        const weapon: Weapon = getDefinable(Weapon, weaponGroup.weaponIDs[0]);
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
            text: { value: `${weaponGroup.name}:` },
          }),
        );
        this._labelIDs.push(
          createLabel({
            color: untilNextColor,
            coordinates: {
              condition,
              x: 2 + width - 2,
              y: y + 5 + weaponIndex * 10 + 12,
            },
            horizontalAlignment: "right",
            text: (): CreateLabelOptionsText => {
              const amount: number =
                weapon.stepsPerAttack -
                ((state.values.turn + weapon.stepsOffset) %
                  weapon.stepsPerAttack);
              return { value: `${amount} ${amount === 1 ? "turn" : "turns"}` };
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
  audioSourceID: "level-themes/cavern-theme-base",
  ingredientID: "bread",
  loopPoint: 64000,
  modeIDs: [normalModeID],
  nextStageID: "2",
  onStart: (): void => {
    state.setValues({ instructionsOpen: true });
  },
  parSteps: 40,
  playerStartLevelID: "tutorial_1",
  playerStartPosition: {
    x: 11 * 24,
    y: 8 * 24,
  },
  weapons: [leftWeaponID, downWeaponID, rightWeaponID, upWeaponID],
});
new Stage("2", {
  audioSourceID: "level-themes/cavern-theme-base",
  ingredientID: "lettuce",
  loopPoint: 64000,
  modeIDs: [
    normalModeID,
    lifestealModeID,
    slipperyModeID,
    knockbackModeID,
    reverseModeID,
  ],
  nextStageID: "3",
  parSteps: 120,
  playerStartLevelID: "crystals_1",
  playerStartPosition: {
    x: 14 * 24,
    y: 15 * 24,
  },
  weapons: [leftWeaponID, downWeaponID, rightWeaponID, upWeaponID],
});
new Stage("3", {
  audioSourceID: "level-themes/cheese-cave-base",
  ingredientID: "cheese",
  loopPoint: 65300,
  modeIDs: [
    normalModeID,
    lifestealModeID,
    slipperyModeID,
    knockbackModeID,
    reverseModeID,
  ],
  nextStageID: "4",
  parSteps: 80,
  playerStartLevelID: "cheese_1",
  playerStartPosition: {
    x: 24 * 24,
    y: 16 * 24,
  },
  weapons: [
    burstAreaWeaponID,
    leftWeaponID,
    downWeaponID,
    rightWeaponID,
    upWeaponID,
  ],
});
new Stage("4", {
  audioSourceID: "level-themes/ruins-base",
  ingredientID: "tomato",
  loopPoint: 50080,
  modeIDs: [
    normalModeID,
    lifestealModeID,
    slipperyModeID,
    knockbackModeID,
    reverseModeID,
  ],
  nextStageID: "5",
  parSteps: 160,
  playerStartLevelID: "ruins_1",
  playerStartPosition: {
    x: 28 * 24,
    y: 30 * 24,
  },
  weapons: [
    burstAreaWeaponID,
    leftWeaponID,
    downWeaponID,
    rightWeaponID,
    upWeaponID,
    {
      name: "Shoot diag",
      weaponIDs: [
        diagonalBottomLeftWeaponID,
        diagonalBottomRightWeaponID,
        diagonalTopRightWeaponID,
        diagonalTopLeftWeaponID,
      ],
    },
  ],
});
new Stage("5", {
  audioSourceID: "level-themes/ice-cave-base",
  ingredientID: "meat",
  loopPoint: 49870,
  modeIDs: [
    normalModeID,
    lifestealModeID,
    slipperyModeID,
    knockbackModeID,
    reverseModeID,
  ],
  nextStageID: null,
  parSteps: 120,
  playerStartLevelID: "frozen_1",
  playerStartPosition: {
    x: 18 * 24,
    y: 17 * 24,
  },
  weapons: [
    burstAreaWeaponID,
    burstRingWeaponID,
    leftWeaponID,
    downWeaponID,
    rightWeaponID,
    upWeaponID,
    {
      name: "Shoot diag",
      weaponIDs: [
        diagonalBottomLeftWeaponID,
        diagonalBottomRightWeaponID,
        diagonalTopRightWeaponID,
        diagonalTopLeftWeaponID,
      ],
    },
  ],
});
