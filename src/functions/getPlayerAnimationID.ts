import { getCurrentTime } from "pixel-pigeon";
import { state } from "../state";
import { walkDuration } from "../constants/walkDuration";

export const getPlayerAnimationID = (): string => {
  const step: string = state.values.step;
  const direction: string = state.values.direction;
  if (state.values.playerMove !== null) {
    const { endPosition, startPosition, time } = state.values.playerMove;
    if (getCurrentTime() <= time + walkDuration) {
      if (endPosition.x > startPosition.x) {
        return `walk-${direction}-step-${step}`;
      }
      if (endPosition.x < startPosition.x) {
        return `walk-${direction}-step-${step}`;
      }
      if (endPosition.y > startPosition.y) {
        return `walk-${direction}-step-${step}`;
      }
      if (endPosition.y < startPosition.y) {
        return `walk-${direction}-step-${step}`;
      }
    }
    if (endPosition.x > startPosition.x) {
      return `idle-${direction}`;
    }
    if (endPosition.x < startPosition.x) {
      return `idle-${direction}`;
    }
    if (endPosition.y > startPosition.y) {
      return `idle-${direction}`;
    }
    if (endPosition.y < startPosition.y) {
      return `idle-${direction}`;
    }
  }
  return `idle-${direction}`;
};
