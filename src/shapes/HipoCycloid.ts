import { point2D, Shape, ShapeParameter, ShapeParameterValue } from "src/types";

export default class Cycloid implements Shape {
  private _params: ShapeParameter;
  private _color: string;

  constructor(params: ShapeParameter, color = '#ff6600') {
    this._color = color;
    // set default parameters
    this._params = {
      ...{
        'definition': {
          name: 'Drawing definition',
          tooltip: 'The amount of segments composing the drawing',
          value: 1800,
          min: 720,
          max: 3600,
          step: 360
        },
        'cycloidDiameter': {
          name: 'Cycloid disc diameter',
          tooltip: 'The diameter of the cycloid disc',
          value: 50,
          min: 10,
          max: 200,
          step: .1
        },
        'pinDiameter': {
          name: 'Pin diameter',
          tooltip: 'The diameter of the external pins',
          value: 3,
          min: 1,
          max: 20,
          step: .1
        },
        'pinCount': {
          name: 'Pin count',
          tooltip: 'Amount of pins (reduction :  # of pins -1)',
          value: 11,
          min: 4,
          max: 100,
          step: 1
        },
        'excentricity': {
          name: 'Excentricity',
          tooltip: 'Excentrical displacement amount from rotation axis',
          value: 1,
          min: 0.5,
          max: 10,
          step: .1
        }
      }, ...params
    };
  }

  getParametersList() {
    return this._params;
  }

  private getParam(key: string) {
    if (!(key in this._params)) throw new Error(`Requested param [${key}] not found `);

    return this._params[key];
  }

  private getPoint(step: number) {
    const cycloidRadius = this.getParam('cycloidDiameter').value / 2;
    const pinRadius = this.getParam('pinDiameter').value / 2;
    const pinCount = this.getParam('pinCount').value;
    const excentricity = this.getParam('excentricity').value;

    return {
      x: (cycloidRadius * Math.cos(step)) - (pinRadius * Math.cos(step + Math.atan(Math.sin((1 - pinCount) * step) / ((cycloidRadius / (excentricity * pinCount)) - Math.cos((1 - pinCount) * step))))) - (excentricity * Math.cos(pinCount * step)),
      y: (-cycloidRadius * Math.sin(step)) + (pinRadius * Math.sin(step + Math.atan(Math.sin((1 - pinCount) * step) / ((cycloidRadius / (excentricity * pinCount)) - Math.cos((1 - pinCount) * step))))) + (excentricity * Math.sin(pinCount * step))
    }
  }

  getPoints(): point2D[] {
    const pointCount = this.getParameterValue('definition').value;
    const range = { start: 0, end: 2 * Math.PI };
    const step = Math.PI / pointCount;
    const points = [];

    for (let t = range.start; t < range.end; t += step) {
      points.push(this.getPoint(t));
    }

    return points;
  }

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
    return this._params[key];
  }

  render(ctx: CanvasRenderingContext2D, zoom: number, origin: point2D): void {
    ctx.strokeStyle = this._color;
    const points = this.getPoints();
    ctx.moveTo(points[0].x, points[0].y);
    ctx.beginPath(); // Start a new path    

    for (const point of points) {
      ctx.lineTo((point.x * zoom + origin.x), (point.y * zoom + origin.y));
      ctx.moveTo((point.x * zoom + origin.x), (point.y * zoom + origin.y));
    }

    ctx.closePath(); // Line to bottom-left corner
    ctx.stroke();
  }
}