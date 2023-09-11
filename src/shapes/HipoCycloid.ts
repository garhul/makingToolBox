import { point2D, Shape, ShapeParameter } from "src/types";

export default class Cycloid implements Shape {
  private parameters: ShapeParameter[];

  constructor() {
    // set default parameters
    this.parameters = [
      {
        name: 'Drawing definition',
        tooltip: 'The amount of points composing the drawing',
        key: 'definition',
        value: 1800,
        min: 360,
        max: 3600,
        step: 360
      },
      {
        name: 'Cycloid disc radius',
        tooltip: 'The radius of the cycloid disc',
        key: 'cycloidRadius',
        value: 1,
        min: 10,
        max: 100,
        step: .1
      },
      {
        name: 'Pin radius',
        tooltip: 'The radius of the external pins',
        key: 'pinRadius',
        value: 3,
        min: 10,
        max: 50,
        step: .1
      },
      {
        name: 'Pin count',
        tooltip: 'Amount of pins (reduction :  # of pins -1)',
        key: 'pinCount',
        value: 10,
        min: 4,
        max: 100,
        step: 1
      },
      {
        name: 'Excentricity',
        tooltip: 'Excentrical displacement amount from rotation axis',
        key: 'excentricity',
        value: 1,
        min: 0.5,
        max: 10,
        step: .1
      },

    ];

  }

  getParametersList() {
    return this.parameters;
  }

  private getParam(key: string) {
    const param = this.parameters.find(p => p.key === key);
    if (param) return param;
    throw new Error(`Requested param not found ${key}`);
  }

  private getPoint(step: number) {
    const cycloidRadius = this.getParam('cycloidRadius').value;
    const pinRadius = this.getParam('pinRadius').value;
    const pinCount = this.getParam('pinCount').value;
    const excentricity = this.getParam('excentricty').value;

    return {
      x: (cycloidRadius * Math.cos(step)) - (pinRadius * Math.cos(step + Math.atan(Math.sin((1 - pinCount) * step) / ((cycloidRadius / (excentricity * pinCount)) - Math.cos((1 - pinCount) * step))))) - (excentricity * Math.cos(pinCount * step)),
      y: (-cycloidRadius * Math.sin(step)) + (pinRadius * Math.sin(step + Math.atan(Math.sin((1 - pinCount) * step) / ((cycloidRadius / (excentricity * pinCount)) - Math.cos((1 - pinCount) * step))))) + (excentricity * Math.sin(pinCount * step))
    }
  }

  getPoints(): point2D[] {
    const pointCount = 3600;
    const range = { start: 0, end: 2 * Math.PI };
    const step = Math.PI / pointCount;
    const points = [];

    for (let t = range.start; t < range.end; t += step) {
      points.push(this.getPoint(t));
    }

    return points;
  }

  setParameterValue(key: string, value: number) {
    const p = this.parameters.find(p => p.key === key);

    if (!p) throw new Error(`Error setting value for parameter ${key}, parameter not found`);

    if ((p.min <= value) && (value <= p.max)) {
      p.value = value;
      return p;
    }

    throw new Error(`Error setting value for parameter ${key}, parameter value (${value}) out of range (${p.min}:${p.max})`);
  }
}