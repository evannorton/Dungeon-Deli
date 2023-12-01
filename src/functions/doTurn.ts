import {
  EntityPosition,
  getActiveLevelID,
  getEntityCalculatedPath,
  getEntityIDs,
  getEntityPosition,
  setEntityPosition,
} from "pixel-pigeon";
import { Stage } from "../stages";
import { getDefinable } from "../definables";
import { getUniqueRandomModeID } from "./getUniqueRandomModeID";
import { state } from "../state";
import { turnsPerMode } from "../constants/turnsPerMode";

export const doTurn = (): void => {
  if (state.values.playerEntityID === null) {
    throw new Error("Attempted to do turn with no player entity.");
  }
  if (state.values.stageID === null) {
    throw new Error("Attempted to do turn with no active stage.");
  }
  const levelID: string | null = getActiveLevelID();
  if (levelID === null) {
    throw new Error("Attempted to do turn with no active level.");
  }
  state.setValues({
    turn: state.values.turn + 1,
  });
  getDefinable(Stage, state.values.stageID).doTurn();
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
  if (state.values.turn % turnsPerMode === 0) {
    const modeID: string = state.values.nextModeID;
    state.setValues({
      modeID,
      nextModeID: getUniqueRandomModeID(modeID),
    });
  }
};
