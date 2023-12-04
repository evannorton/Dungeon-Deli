import { Direction } from "../types/Direction";
import { EntityPosition, getCurrentTime } from "pixel-pigeon";
import { Step } from "../types/Step";
import { state } from "../state";

export const movePlayer = (
  startPosition: EntityPosition,
  endPosition: EntityPosition,
): void => {
  const getDirection = (): Direction => {
    if (endPosition.x > startPosition.x) {
      return Direction.Right;
    }
    if (endPosition.x < startPosition.x) {
      return Direction.Left;
    }
    if (endPosition.y > startPosition.y) {
      return Direction.Down;
    }
    if (endPosition.y < startPosition.y) {
      return Direction.Up;
    }
    return state.values.direction;
  };
  state.setValues({
    direction: getDirection(),
    playerMove: {
      endPosition,
      startPosition,
      time: getCurrentTime(),
    },
    step: state.values.step === Step.Left ? Step.Right : Step.Left,
  });
};
