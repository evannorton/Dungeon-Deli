import { createSpriteInstance, playAudioSource } from "pixel-pigeon";
import { musicVolumeChannelID } from "./volumeChannels";
import { pigeonSpriteID } from "./sprites";

export const run = (): void => {
  console.log("run");
  playAudioSource("song", {
    volumeChannelID: musicVolumeChannelID,
  });
  const pigeonSpriteInstanceID: string = createSpriteInstance({
    coordinates: {
      x: 32,
      y: 32,
    },
    getAnimationID: (): string => "idle-down",
    spriteID: pigeonSpriteID,
  });
  console.log(`created pigeon sprite: ${pigeonSpriteInstanceID}`);
};
