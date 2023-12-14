import { attemptPlayerMove } from "./functions/attemptPlayerMove";
import { attemptPlayerPass } from "./functions/attemptPlayerPass";
import {
  createInputPressHandler,
  getCurrentTime,
  takeScreenshot,
} from "pixel-pigeon";
import { reverseModeID } from "./modes";
import { state } from "./state";

const condition = (): boolean => state.values.isMain;
createInputPressHandler({
  condition,
  gamepadButtons: [14],
  keyboardButtons: [
    { value: "ArrowLeft" },
    { value: "KeyA" },
    {
      value: "Numpad4",
      withoutNumlock: true,
    },
  ],
  onInput: (): void => {
    if (state.values.modeID === reverseModeID) {
      attemptPlayerMove(1, 0);
    } else {
      attemptPlayerMove(-1, 0);
    }
  },
});
createInputPressHandler({
  condition,
  gamepadButtons: [15],
  keyboardButtons: [
    { value: "ArrowRight" },
    { value: "KeyD" },
    {
      value: "Numpad6",
      withoutNumlock: true,
    },
  ],
  onInput: (): void => {
    if (state.values.modeID === reverseModeID) {
      attemptPlayerMove(-1, 0);
    } else {
      attemptPlayerMove(1, 0);
    }
  },
});
createInputPressHandler({
  condition,
  gamepadButtons: [12],
  keyboardButtons: [
    { value: "ArrowUp" },
    { value: "KeyW" },
    {
      value: "Numpad8",
      withoutNumlock: true,
    },
  ],
  onInput: (): void => {
    if (state.values.modeID === reverseModeID) {
      attemptPlayerMove(0, 1);
    } else {
      attemptPlayerMove(0, -1);
    }
  },
});
createInputPressHandler({
  condition,
  gamepadButtons: [13],
  keyboardButtons: [
    { value: "ArrowDown" },
    { value: "KeyS" },
    {
      value: "Numpad2",
      withoutNumlock: true,
    },
  ],
  onInput: (): void => {
    if (state.values.modeID === reverseModeID) {
      attemptPlayerMove(0, -1);
    } else {
      attemptPlayerMove(0, 1);
    }
  },
});
createInputPressHandler({
  keyboardButtons: [{ value: "KeyP" }],
  onInput: (): void => {
    takeScreenshot();
  },
});
createInputPressHandler({
  condition,
  gamepadButtons: [0],
  keyboardButtons: [
    {
      value: "Space",
    },
    {
      value: "Numpad5",
      withoutNumlock: true,
    },
  ],
  mouseButtons: [0],
  onInput: (): void => {
    if (
      state.values.stageStartedAt !== null &&
      getCurrentTime() > state.values.stageStartedAt + 3000
    ) {
      state.setValues({ closedInstructions: true });
    }
    attemptPlayerPass();
  },
});
