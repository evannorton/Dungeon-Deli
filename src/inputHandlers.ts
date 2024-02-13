import { attemptPlayerMove } from "./functions/attemptPlayerMove";
import { attemptPlayerPass } from "./functions/attemptPlayerPass";
import { createInputPressHandler, takeScreenshot } from "pixel-pigeon";
import {
  moveDownInputCollectionID,
  moveLeftInputCollectionID,
  moveRightInputCollectionID,
  moveUpInputCollectionID,
  passInputCollectionID,
  screenshotInputCollectionID,
} from "./inputCollections";
import { reverseModeID } from "./modes";
import { state } from "./state";

const condition = (): boolean => state.values.isMain;
createInputPressHandler({
  condition,
  inputCollectionID: moveLeftInputCollectionID,
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
  inputCollectionID: moveRightInputCollectionID,
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
  inputCollectionID: moveUpInputCollectionID,
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
  inputCollectionID: moveDownInputCollectionID,
  onInput: (): void => {
    if (state.values.modeID === reverseModeID) {
      attemptPlayerMove(0, -1);
    } else {
      attemptPlayerMove(0, 1);
    }
  },
});
createInputPressHandler({
  inputCollectionID: screenshotInputCollectionID,
  onInput: (): void => {
    takeScreenshot();
  },
});
createInputPressHandler({
  condition,
  inputCollectionID: passInputCollectionID,
  onInput: (): void => {
    if (state.values.instructionsOpen) {
      state.setValues({ instructionsOpen: false });
    } else {
      attemptPlayerPass();
    }
  },
});
