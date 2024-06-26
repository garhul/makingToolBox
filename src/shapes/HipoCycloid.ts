import { path2D, point2D, } from "src/types";
import Shape, { ShapeParameters } from "./Shape";
import { getArch, polarMove } from "./utils";

export default class Cycloid extends Shape {

  constructor(params: ShapeParameters) {
    super({       // set default parameters
      ...{
        'definition': {
          name: 'Drawing definition',
          tooltip: 'The amount of segments composing the drawing',
          value: 720,
          min: 180,
          max: 3600,
          step: 10
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
          min: 0,
          max: 10,
          step: .1
        },
        'bore': {
          name: 'Central bore',
          tooltip: 'Central bore diameter',
          value: 22,
          min: 1,
          max: 50,
          step: .1
        },
        'backlash': {
          name: 'Backlash',
          tooltip: '3d printing tolerance, increases pins origin diamter',
          value: 0.1,
          min: 0,
          max: 1,
          step: .05
        },
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



    const layers: path2D[] = [
      {
        strokeColor: null,
        fillColor: null,
        points
      },
      {
        strokeColor: null,
        fillColor: null,
        points: getArch({ x: 0, y: 0 }, this.getParam('bore').value / 2, 0, 360)
      },
    ];


    //draw pins too ?
    for (let p = 0; p < this.getParam('pinCount').value; p++) {

      const angle = (360 / this.getParam('pinCount').value) * p;
      const dist = this.getParam('cycloidDiameter').value / 2;
      const origin = polarMove({ x: 0, y: 0 }, angle, dist + this.getParam('backlash').value + this.getParam('excentricity').value / 2);

      layers.push({
        strokeColor: '#ffffff',
        fillColor: null,
        points: getArch(origin, this.getParam('pinDiameter').value / 2, 0, 360)
      });
    }

    //Draw carrying pins




    //Draw axis centre
    const spinAxis = polarMove({ x: 0, y: 0 }, 0, this.getParam('excentricity').value);
    layers.push({
      strokeColor: '#ffffff',
      fillColor: null,
      points: getArch(spinAxis, 1, 0, 360)
    })





    return layers;
  }
}