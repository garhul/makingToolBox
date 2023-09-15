
import { point2D, Shape, ShapeParameter, ShapeParameterValue } from "src/types";
import { getArcPath, getTriangleFromSidesAndVertex, getTriangleVertices, polarMove } from "./utils";


const pulleyProfiles = {
  gt2: {
    grooveDepth: 0.76, //0.75
    pitchFactor: 0.41, //0.4
    pld: 0.254, // 0.254
    toothRadius: 0.555, // 0.555
    toothInnerDiameter: 1, //1.0
    filletRadius: 0.15 //0.15
  },
  // '3': {
  //   'grooveDepth': 1.14,
  //   'pitchFactor': 1.27,
  //   'insideDiameter': 0.555,
  //   'insideRoundDiameter': 1,
  //   'outsideRoundDiameter': 0.15
  // },
  // '5': {
  //   'grooveDepth': 1.93,
  //   'pitchFactor': 1.78,
  //   'insideDiameter': 0.555,
  //   'insideRoundDiameter': 1,
  //   'outsideRoundDiameter': 0.15
  // }
};

type pulleyProfile = {
  grooveDepth: number;  //0.75
  pitchFactor: number;
  pld: number;
  toothRadius: number;
  toothInnerDiameter: number;
  filletRadius: number;

}

export default class GTPulley implements Shape {
  private _params: ShapeParameter;
  private _color: string;
  private _pulleyProfile: pulleyProfile;

  private _origin = { x: 0, y: 0 };
  private _pitchDiameter = 0;
  private _toothAngle = 0;

  /* outer diameter of the pulley at the farthest point (Addendum) */
  private _outerDiameter = 0;
  /* outer diameter of the pulley at the closest point (Dedendum) */
  private _innerDiameter = 0;


  constructor(params: ShapeParameter, color = '#55DD99') {
    this._color = color;
    this._pulleyProfile = pulleyProfiles.gt2;
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
        'toothCount': {
          name: 'Tooth count',
          tooltip: 'The amount of teeth in the pulley',
          value: 1,
          min: 10,
          max: 200,
          step: 1
        },
        // 'tolerance': {
        //   name: 'Pin diameter',
        //   tooltip: 'The diameter of the external pins',
        //   value: 3,
        //   min: 1,
        //   max: 20,
        //   step: .1
        // },
        // 'pinCount': {
        //   name: 'Pin count',
        //   tooltip: 'Amount of pins (reduction :  # of pins -1)',
        //   value: 11,
        //   min: 4,
        //   max: 100,
        //   step: 1
        // },
        // 'excentricity': {
        //   name: 'Excentricity',
        //   tooltip: 'Excentrical displacement amount from rotation axis',
        //   value: 1,
        //   min: 0.5,
        //   max: 10,
        //   step: .1
        // }
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

  /**
   * looks like it returns the origin point of the arc for the dedendum/addendum fillets (r=0.15)
   * along with its edges
   */
  private _getShoulderFilletPoint(origin: point2D, angle: number, direction: 'cw' | 'ccw'): { origin: point2D, edges: { r: point2D, l: point2D } } {
    const angles = getTriangleFromSidesAndVertex(
      [this._pulleyProfile.toothInnerDiameter + this._pulleyProfile.filletRadius,
      this._pulleyProfile.filletRadius],
      90
    );

    const angleMargin = angles[0]; //cb

    const a = angle + ((direction === 'cw') ? -angleMargin : angleMargin);
    const pointOrig = polarMove(origin, a - 180, this._pulleyProfile.toothInnerDiameter + this._pulleyProfile.filletRadius)

    return {
      origin: pointOrig,
      edges: {
        r: polarMove(origin, a - 180, this._pulleyProfile.toothInnerDiameter),
        l: polarMove(pointOrig, angle, this._pulleyProfile.filletRadius),
      }
    }
  }

  /** 
   *  this returns the position of the excentric 1mm diameter circle that's moved 0.4 mm from centre of tooth
   * 
  */
  private _getInternalFilletPoint(origin: point2D, angle: number, direction: 'cw' | 'ccw'): { origin: point2D, edges: { r: point2D, l: point2D } } {
    const hDist = this._outerDiameter - (this._innerDiameter + this._pulleyProfile.toothRadius);

    const distance = Math.sqrt(Math.pow(hDist, 2) + Math.pow(this._pulleyProfile.pitchFactor, 2));
    const angles = getTriangleVertices([hDist, distance, this._pulleyProfile.pitchFactor]);

    const angleMargin = angles[2] //ba;    
    const a = angle + ((direction === 'cw') ? -angleMargin : angleMargin);

    console.log({ hDist, a, angleMargin });

    return {
      origin: polarMove(origin, a, distance),
      edges: {
        r: polarMove(origin, a - 180, this._pulleyProfile.toothRadius),
        l: polarMove(origin, a - 180, this._pulleyProfile.toothRadius),
      }
    }
  }

  private getToothPath(origin: point2D, angle: number) {
    const path: point2D[] = [];

    const startPoint = polarMove(origin, angle, this._innerDiameter / 2); //point where to begin to draw the path from
    const toothCenter = polarMove(origin, angle, this._innerDiameter / 2 + this._pulleyProfile.toothRadius / 2);

    const internalLeftFillet = this._getInternalFilletPoint(toothCenter, angle, 'cw');
    const internalRightFillet = this._getInternalFilletPoint(toothCenter, angle, 'ccw');

    const leftShoulderFillet = this._getShoulderFilletPoint(internalLeftFillet.origin, angle, 'cw');
    const rightShoulderFillet = this._getShoulderFilletPoint(internalRightFillet.origin, angle, 'ccw');

    /*      
      shapesForExport.push(addArc(leftOutsideRoundPoint.edgeSharedPoint, leftOutsideRoundPoint.sharedPoint, outsideRoundRadius + config.baseConfig.toolOffset));
      shapesForExport.push(addArc(leftOutsideRoundPoint.sharedPoint, leftInsideRoundPoint.sharedPoint, (insideRoundRadius - config.baseConfig.toolOffset) * -1));
      shapesForExport.push(addArc(leftInsideRoundPoint.sharedPoint, startPoint, (roundRadius - config.baseConfig.toolOffset) * -1));
      shapesForExport.push(addArc(startPoint, rightInsideRoundPoint.sharedPoint, (roundRadius - config.baseConfig.toolOffset) * -1));
      shapesForExport.push(addArc(rightInsideRoundPoint.sharedPoint, rightOutsideRoundPoint.sharedPoint, (insideRoundRadius - config.baseConfig.toolOffset) * -1));
      shapesForExport.push(addArc(rightOutsideRoundPoint.sharedPoint, rightOutsideRoundPoint.edgeSharedPoint, outsideRoundRadius + config.baseConfig.toolOffset));
      shapesForExport.push(addArc(rightOutsideRoundPoint.edgeSharedPoint, nextteeth.start, (config.outsideRadius + config.baseConfig.toolOffset)));
        }
    */

    //get first path which correspondes to left side (CCW direction) of 0.15 mm shoulder fillet 
    path.push(...getArcPath(leftShoulderFillet.edges.l, leftShoulderFillet.edges.r, this._pulleyProfile.filletRadius));

    //get path of internal fillet for left side, radius is 1mm, displacement from center is 0.4 mm
    path.push(...getArcPath(leftShoulderFillet.edges.r, internalLeftFillet.edges.r, this._pulleyProfile.toothInnerDiameter));

    /* tooth base r = 0.555*/
    // path.push(...getArcPath(internalRightFillet.edges.r, internalLeftFillet.edges.r, this._pulleyProfile.toothRadius));
    // path.push(...getArcPath(startPoint, internalRightFillet.edges[0], this._pulleyProfile.toothRadius));

    /* internal fillet for right side */
    path.push(...getArcPath(internalRightFillet.edges.l, rightShoulderFillet.edges.r, this._pulleyProfile.toothInnerDiameter));

    /* right shoulder fillet */
    // path.push(...getArcPath(rightShoulderFillet.edges.l, rightShoulderFillet.edges.r, this._pulleyProfile.filletRadius));

    // path.concat(getArcPath(rightShoulderFillet.edges[1], nextteeth.start, this._outerDiameter)); // join this tooth with the next (may not be needed)

    return path;

  }

  getPoints(): point2D[] {
    const points: point2D[] = [];
    // const origin: point2D = { x: 0, y: 0 };

    this._toothAngle = (360 / this.getParameterValue('toothCount').value);
    this._pitchDiameter = (2 * this.getParameterValue('toothCount').value) / Math.PI;
    this._outerDiameter = this._pitchDiameter - this._pulleyProfile.pld; // The outside diameter of the pulley at the addendum 
    this._innerDiameter = this._outerDiameter - this._pulleyProfile.grooveDepth * 2; // the inner diameter of the pulley at the dedendum height


    points.push(...this.getToothPath(this._origin, -90));

    // points.push(...this.getToothPath(this._origin, this._toothAngle));

    // for (let ta = 0; ta <= 360; ta += this._toothAngle) {
    //   points.push(...this.getToothPath(this._origin, ta));
    // }

    // console.log({ points });
    return points; // all the points conforming the pulley
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