import { path2D, point2D } from "src/types";

export type ShapeParameterValue = {
  name: string;
  tooltip?: string;
  value: number;
  min: number;
  max: number;
  step: number;
};

export type ShapeParameters = Record<string, ShapeParameterValue>

export interface ShapeInterface {
  getPaths: () => path2D[];
  getParametersList: () => ShapeParameters;
  getParameterValue: (key: string) => ShapeParameterValue;
  render: (context: CanvasRenderingContext2D, zoom: number, origin: point2D, colors: string[]) => void;
}

export default class Shape implements ShapeInterface {
  protected _params: ShapeParameters;

  constructor(params: ShapeParameters) {
    this._params = params;
  }

  /** returns a copy of shape parameters object */
  getParametersList() {
    return { ...{}, ...this._params };
  }

  /** returns a copy of the current shape params */
  protected getParam(key: string) {
    if (!(key in this._params)) throw new Error(`Requested param [${key}] not found `);

    return { ...{}, ...this._params[key] };
  }

  getPaths(): path2D[] { return [] };

  setParameterValue(key: string, value: number): ShapeParameterValue {
    if (!(key in this._params))
      throw new Error(`Error setting value for parameter ${key}, parameter not found`);

    const param = this._params[key];

    if ((param.min <= value) && (value <= param.max)) {
      param.value = value;
      return param;
    }

    throw new Error(`Error setting value for parameter ${key}, parameter value (${value}) out of range (${param.min}:${param.max})`);
  }

  getParameterValue(key: string): ShapeParameterValue {
    if (!(key in this._params))
      throw new Error(`Error setting value for parameter ${key}, parameter not found`);
    return { ...{}, ...this._params[key] };
  }

  render(ctx: CanvasRenderingContext2D, zoom: number, origin: point2D, colors: string[]): void {
    // console.time('path_gen');
    const paths = this.getPaths();
    // console.timeEnd('path_gen');
    // console.time('render');
    paths.forEach((path, i) => {
      const points = path.points;
      ctx.strokeStyle = path.strokeColor || colors[i] || colors[0];
      ctx.fillStyle = path.fillColor || colors[i] || colors[0];

      ctx.moveTo(points[0].x, points[0].y);

      ctx.beginPath(); // Start a new path    

      for (const point of points) {
        ctx.lineTo((point.x * zoom + origin.x), (point.y * zoom + origin.y));
        ctx.moveTo((point.x * zoom + origin.x), (point.y * zoom + origin.y));
      }

      ctx.closePath(); // Line to bottom-left corner
      ctx.stroke();
      // console.timeEnd('render');
    });
  }

}