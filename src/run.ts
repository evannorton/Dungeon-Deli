import { Stage } from "./stages";
import { createMonsterSpriteInstances } from "./functions/createMonsterSpriteInstances";
import { getDefinable } from "./definables";
import { musicVolumeChannelID } from "./volumeChannels";
import { playAudioSource } from "pixel-pigeon";
import { stageIDs } from "./constants/stageIDs";

export const run = (): void => {
  if (stageIDs.length === 0) {
    throw new Error("Attempted to run with no stages.");
  }
  createMonsterSpriteInstances();
  getDefinable(Stage, stageIDs[0]).start();
  playAudioSource("cavern-theme-base", {
    loopPoint: 12800,
    volumeChannelID: musicVolumeChannelID,
  });
};
