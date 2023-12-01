import {
  EntityPosition,
  getActiveLevelID,
  getEntityCalculatedPath,
  getEntityIDs,
  getEntityPosition,
  setEntityPosition,
} from "pixel-pigeon";
import { getUniqueRandomModeID } from "./getUniqueRandomModeID";
import { state } from "../state";
import { turnsPerMode } from "../constants/turnsPerMode";

export const doTurn = (): void => {
  if (state.values.playerEntityID === null) {
    throw new Error("Attempted to do turn with no player entity.");
  }
  const levelID: string | null = getActiveLevelID();
  if (levelID === null) {
    throw new Error("Attempted to do turn with no active level.");
  }
  for (const entityID of getEntityIDs({
    layerID: "monsters",
    levelID,
  })) {
    const position: EntityPosition = getEntityPosition(
      state.values.playerEntityID,
    );
    const path: EntityPosition[] = getEntityCalculatedPath(entityID, {
      collisionLayers: ["monsters", "transports"],
      x: position.x,
      y: position.y,
    });
    if (path.length > 2) {
      setEntityPosition(entityID, path[1]);
    } else {
      // TODO: Attack player
    }
  }
  state.setValues({
    turnsUntilNextMode: state.values.turnsUntilNextMode - 1,
  });
  if (state.values.turnsUntilNextMode === 0) {
    const modeID: string = state.values.nextModeID;
    state.setValues({
      modeID,
      nextModeID: getUniqueRandomModeID(modeID),
      turnsUntilNextMode: turnsPerMode,
    });
  }
};
