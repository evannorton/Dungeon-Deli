import "./inputHandlers";
import "./modes";
import "./monsters";
import "./stages";
import "./volumeChannels";
import "./weapons";
import { initialize, onRun, setPauseMenuCondition } from "pixel-pigeon";
import { run } from "./run";

onRun(run);
initialize();
setPauseMenuCondition((): boolean => true);
