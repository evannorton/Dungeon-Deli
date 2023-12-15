import "./achievements";
import "./anchors";
import "./ingredients";
import "./inputHandlers";
import "./modes";
import "./monsters";
import "./stages";
import "./volumeChannels";
import "./weapons";
import { initialize, onRun, onTick, setPauseMenuCondition } from "pixel-pigeon";
import { run } from "./run";
import { state } from "./state";
import { tick } from "./tick";

onRun(run);
onTick(tick);
initialize();
setPauseMenuCondition((): boolean => state.values.isMain);
