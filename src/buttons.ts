import { createButton, getCurrentTime, openURL } from "pixel-pigeon";
import { state } from "./state";

const condition = (): boolean => {
  if (state.values.isVictory) {
    if (
      state.values.victoryStartedAt !== null &&
      getCurrentTime() > state.values.victoryStartedAt + 47 * 100
    ) {
      return true;
    }
  }
  return false;
};
createButton({
  coordinates: {
    condition,
    x: 205,
    y: 178,
  },
  height: 11,
  onClick: (): void => {
    openURL("https://evanmmo.com");
  },
  width: 78,
});
createButton({
  coordinates: {
    condition,
    x: 152,
    y: 207,
  },
  height: 11,
  onClick: (): void => {
    openURL("https://twitter.com/bampikku");
  },
  width: 75,
});
createButton({
  coordinates: {
    condition,
    x: 238,
    y: 207,
  },
  height: 11,
  onClick: (): void => {
    openURL("https://ttkurok.itch.io");
  },
  width: 53,
});
createButton({
  coordinates: {
    condition,
    x: 300,
    y: 207,
  },
  height: 11,
  onClick: (): void => {
    openURL("https://twitter.com/GFLK_pik");
  },
  width: 44,
});
createButton({
  coordinates: {
    condition,
    x: 220,
    y: 238,
  },
  height: 11,
  onClick: (): void => {
    openURL("https://www.youtube.com/channel/UCTljefNUAIUavdRcGFfrQZg");
  },
  width: 46,
});
