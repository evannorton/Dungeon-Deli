import { createAnchor, getCurrentTime } from "pixel-pigeon";
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
createAnchor({
  coordinates: {
    condition,
    x: 205,
    y: 178,
  },
  height: 11,
  url: "https://evanmmo.com",
  width: 78,
});
createAnchor({
  coordinates: {
    condition,
    x: 152,
    y: 207,
  },
  height: 11,
  url: "https://twitter.com/bampikku",
  width: 75,
});
createAnchor({
  coordinates: {
    condition,
    x: 238,
    y: 207,
  },
  height: 11,
  url: "https://ttkurok.itch.io",
  width: 53,
});
createAnchor({
  coordinates: {
    condition,
    x: 300,
    y: 207,
  },
  height: 11,
  url: "https://twitter.com/GFLK_pik",
  width: 44,
});
createAnchor({
  coordinates: {
    condition,
    x: 220,
    y: 238,
  },
  height: 11,
  url: "https://www.youtube.com/channel/UCTljefNUAIUavdRcGFfrQZg",
  width: 46,
});
