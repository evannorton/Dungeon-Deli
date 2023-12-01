import { Definable } from "./definables";

interface ModeOptions {
  readonly name: string;
}

export class Mode extends Definable {
  private readonly _options: ModeOptions;
  public constructor(id: string, options: ModeOptions) {
    super(id);
    this._options = options;
  }

  public get name(): string {
    return this._options.name;
  }
}
new Mode("a", { name: "A Mode" });
new Mode("b", { name: "B Mode" });
new Mode("c", { name: "C Mode" });
new Mode("d", { name: "D Mode" });
new Mode("e", { name: "E Mode" });
