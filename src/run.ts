import { createChestHUD } from "./functions/createChestHUD";
import { createChests } from "./functions/createChests";
import { createDeathHUD } from "./functions/createDeathHUD";
import { createInstructionsHUD } from "./functions/createInstructionsHUD";
import { createModeHUD } from "./functions/createModeHUD";
import { createMonsterInstances } from "./functions/createMonsterInstances";
import { createTitleHUD } from "./functions/createTitleHUD";
import { musicVolumeChannelID } from "./volumeChannels";
import { playAudioSource } from "pixel-pigeon";

export const run = (): void => {
  playAudioSource("main-theme", {
    loopPoint: 0,
    volumeChannelID: musicVolumeChannelID,
  });
  createInstructionsHUD();
  createModeHUD();
  createTitleHUD();
  createDeathHUD();
  createChestHUD();
  createMonsterInstances();
  createChests();
};
