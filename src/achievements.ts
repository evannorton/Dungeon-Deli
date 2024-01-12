import { createAchievement } from "pixel-pigeon";

export const lifestealModeAchievementID: string = createAchievement({
  description: "Restore your health to maximum during Lifesteal Mode.",
  id: "lifesteal-mode",
  imagePath: "achievements/lifesteal-mode",
  name: "Full Restore",
});
export const reverseModeAchievementID: string = createAchievement({
  description: "Walk into a wall during Reverse Mode.",
  id: "reverse-mode",
  imagePath: "achievements/reverse-mode",
  name: "Confusion",
});
export const slipperyModeAchievementID: string = createAchievement({
  description: "Slide into a staircase during Slippery Mode.",
  id: "slippery-mode",
  imagePath: "achievements/slippery-mode",
  name: "Slippery Stairs",
});
export const knockbackModeAchievementID: string = createAchievement({
  description: "Push a minecart mouse off of its tracks during Knockback Mode.",
  id: "knockback-mode",
  imagePath: "achievements/knockback-mode",
  name: "Derailed",
});
export const clearGameAchievementID: string = createAchievement({
  description: "Clear the dungeon and retrieve your sandwich.",
  id: "clear-game",
  imagePath: "achievements/clear-game",
  name: "Picnic Time",
});
export const parTimesAchievementID: string = createAchievement({
  description: "Achieve the goal time for each level.",
  id: "par-times",
  imagePath: "achievements/par-times",
  name: "Dungeoneer",
});
