import { NumLock, createInputCollection } from "pixel-pigeon";

export const passInputCollectionID: string = createInputCollection({
  gamepadButtons: [0],
  keyboardButtons: [
    {
      value: "Space",
    },
    {
      numLock: NumLock.Without,
      value: "Numpad5"
    },
  ],
  mouseButtons: [0],
  name: "Pass turn / advance menu",
});
export const screenshotInputCollectionID: string = createInputCollection({
  keyboardButtons: [{ value: "KeyP" }],
  name: "Take screenshot",
});
export const moveLeftInputCollectionID: string = createInputCollection({
  gamepadButtons: [14],
  keyboardButtons: [
    { value: "ArrowLeft" },
    { value: "KeyA" },
    {
      value: "Numpad4",
      numLock: NumLock.Without
    },
  ],
  name: "Move left",
});
export const moveRightInputCollectionID: string = createInputCollection({
  gamepadButtons: [15],
  keyboardButtons: [
    { value: "ArrowRight" },
    { value: "KeyD" },
    {
      value: "Numpad6",
      numLock: NumLock.Without
    },
  ],
  name: "Move right",
});
export const moveUpInputCollectionID: string = createInputCollection({
  gamepadButtons: [12],
  keyboardButtons: [
    { value: "ArrowUp" },
    { value: "KeyW" },
    {
      value: "Numpad8",
      numLock: NumLock.Without
    },
  ],
  name: "Move up",
});
export const moveDownInputCollectionID: string = createInputCollection({
  gamepadButtons: [13],
  keyboardButtons: [
    { value: "ArrowDown" },
    { value: "KeyS" },
    {
      value: "Numpad2",
      numLock: NumLock.Without
    },
  ],
  name: "Move down",
});
