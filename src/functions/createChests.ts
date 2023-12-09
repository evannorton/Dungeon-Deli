import { Chest } from "../chests";
import { getEntityIDs } from "pixel-pigeon";

export const createChests = (): void => {
  for (const entityID of getEntityIDs({
    layerIDs: ["chests"],
    types: ["chest"],
  })) {
    new Chest({
      entityID,
    });
  }
};
