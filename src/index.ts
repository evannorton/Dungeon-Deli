import "./inputHandlers";
import { initialize, onRun, onTick, setPauseMenuCondition } from "pixel-pigeon";
import { run } from "./run";
import { state } from "./state";
import { tick } from "./tick";

onRun(run);
onTick(tick);
initialize();
setPauseMenuCondition((): boolean => state.values.isMain);
