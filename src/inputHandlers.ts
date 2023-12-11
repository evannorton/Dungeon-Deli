import { attemptPlayerMove } from "./functions/attemptPlayerMove";
import { createInputPressHandler, takeScreenshot } from "pixel-pigeon";
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
    attemptPlayerMove(-1, 0);
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
    attemptPlayerMove(1, 0);
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
    attemptPlayerMove(0, -1);
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
    attemptPlayerMove(0, 1);
  },
});
createInputPressHandler({
  condition,
  keyboardButtons: [{ value: "KeyP" }],
  onInput: (): void => {
    takeScreenshot();
  },
});
