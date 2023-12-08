import { Stage } from "./stages";
import { createDeathHUD } from "./functions/createDeathHUD";
import { createMonsterInstances } from "./functions/createMonsterInstances";
import { getDefinable } from "./definables";
import { musicVolumeChannelID } from "./volumeChannels";
import { playAudioSource } from "pixel-pigeon";
import { stageIDs } from "./constants/stageIDs";

export const run = (): void => {
  if (stageIDs.length === 0) {
    throw new Error("Attempted to run with no stages.");
  }
  createDeathHUD();
  createMonsterInstances();
  getDefinable(Stage, stageIDs[0]).start();
  playAudioSource("cavern-theme-base", {
    loopPoint: 12800,
    volumeChannelID: musicVolumeChannelID,
  });
};
