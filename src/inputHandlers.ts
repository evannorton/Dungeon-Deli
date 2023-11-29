import { createInputPressHandler, takeScreenshot } from "pixel-pigeon";
import { movePlayer } from "./functions/movePlayer";

createInputPressHandler({
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
    movePlayer(-1, 0);
  },
});
createInputPressHandler({
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
    movePlayer(1, 0);
  },
});
createInputPressHandler({
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
    movePlayer(0, -1);
  },
});
createInputPressHandler({
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
    movePlayer(0, 1);
  },
});
createInputPressHandler({
  keyboardButtons: [{ value: "KeyP" }],
  onInput: (): void => {
    takeScreenshot();
  },
});
