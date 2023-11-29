import "./inputHandlers";
import "./sprites";
import "./volumeChannels";
import { initialize, onRun, onTick, setPauseMenuCondition } from "pixel-pigeon";
import { run } from "./run";
import { tick } from "./tick";

onRun(run);
onTick(tick);
initialize();
setPauseMenuCondition((): boolean => true);
