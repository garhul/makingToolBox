import { path2D, } from "src/types";
import Shape, { ShapeParameter } from "./Shape";

export default class Cycloid extends Shape {

  constructor(params: ShapeParameter, color = '#ff6600') {
    super({       // set default parameters
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
    });
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

  getPaths(): path2D[] {
    const pointCount = this.getParameterValue('definition').value;
    const range = { start: 0, end: 2 * Math.PI };
    const step = Math.PI / pointCount;
    const points = [];

    for (let t = range.start; t < range.end; t += step) {
      points.push(this.getPoint(t));
    }

    //draw pins too ?
    return [
      {
        strokeColor: this._colors[0],
        fillColor: this._colors[0],
        points
      }
    ];
  }
}