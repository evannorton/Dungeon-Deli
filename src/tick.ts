import { doTurn } from "./functions/doTurn";
import { getCurrentTime, setEntityPosition } from "pixel-pigeon";
import { state } from "./state";
import { walkDuration } from "./constants/walkDuration";

export const tick = (): void => {
  if (
    state.values.playerEntityID !== null &&
    state.values.playerMove !== null
  ) {
    const { endPosition, startPosition, time } = state.values.playerMove;
    const currentTime: number = getCurrentTime();
    if (currentTime <= time + walkDuration) {
      const divisor: number = currentTime - time;
      const percent: number = Math.min(divisor / walkDuration, 1);
      const offset: number = Math.floor(24 * percent);
      if (endPosition.x > startPosition.x) {
        setEntityPosition(state.values.playerEntityID, {
          x: startPosition.x + offset,
          y: startPosition.y,
        });
      } else if (endPosition.x < startPosition.x) {
        setEntityPosition(state.values.playerEntityID, {
          x: startPosition.x - offset,
          y: startPosition.y,
        });
      } else if (endPosition.y > startPosition.y) {
        setEntityPosition(state.values.playerEntityID, {
          x: startPosition.x,
          y: startPosition.y + offset,
        });
      } else if (endPosition.y < startPosition.y) {
        setEntityPosition(state.values.playerEntityID, {
          x: startPosition.x,
          y: startPosition.y - offset,
        });
      }
    } else {
      setEntityPosition(state.values.playerEntityID, endPosition);
      state.setValues({ playerMove: null });
      doTurn();
    }
  }
};
