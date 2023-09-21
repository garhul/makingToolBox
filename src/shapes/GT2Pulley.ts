
import { point2D, path2D } from "src/types";
import { getArch, getTriangleFromSidesAndVertex, getTriangleVertices, polarMove, vectorAngle } from "./utils";
import Shape, { ShapeParameter } from './Shape';

const pulleyProfiles = {
  gt2: {
    grooveDepth: 0.75, //0.75
    pitchFactor: 0.40, //0.4
    pitchLineDepth: 0.254, // 0.254
    toothRadius: 0.555, // 0.555
    toothInnerRadius: 1, //1.0
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
  pitchLineDepth: number;
  toothRadius: number;
  toothInnerRadius: number;
  filletRadius: number;

}

export default class GTPulley extends Shape {
  private _pulleyProfile: pulleyProfile;

  private _origin = { x: 0, y: 0 };
  private _pitchRadius = 0;

  /* The distance between tooth groove and pulley inner fillet centre  */
  private _toothInnerFilletCenterDist = 0;
  /* angle for finding innerfilletcentral point */
  private _toothInnerFilletCenterAngle = 0;

  /* outer diameter of the pulley at the farthest point (Addendum) */
  private _outerRadius = 0;
  /* outer diameter of the pulley at the closest point (Dedendum) */
  private _innerRadius = 0;


  constructor(params: ShapeParameter, color = '#55DD99') {
    // set default parameters
    super({
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
    });

    this._pulleyProfile = pulleyProfiles.gt2;
  }

  /**
   * get the shoulder central point and intersection points
   */
  private _getShoulderFilletPoint(origin: point2D, angle: number, direction: 'ccw' | 'cw'): { origin: point2D, edges: { top: point2D, bottom: point2D } } {

    const displacementDistance = this._pulleyProfile.toothInnerRadius + this._pulleyProfile.filletRadius;
    const anglePosition = getTriangleFromSidesAndVertex([displacementDistance, this._pulleyProfile.filletRadius], 90)[2];

    const displacementAngle = angle + ((direction === 'ccw') ? anglePosition : -anglePosition);
    const center = polarMove(origin, displacementAngle - 180, displacementDistance);
    const intersectionWithInsideFillet = polarMove(origin, displacementAngle - 180, this._pulleyProfile.toothInnerRadius);
    const intersectionWithOuterEdge = polarMove(center, angle, this._pulleyProfile.filletRadius);

    return {
      origin: center,
      edges: {
        top: intersectionWithOuterEdge,
        bottom: intersectionWithInsideFillet,
      }
    };
  }

  /** 
   *  this returns the position of the excentric 1mm diameter circle that's moved 0.4 mm from centre of tooth
   *  along with its intersection point with the bottom-most curve
   * 
  */
  private _getInternalFilletPoints(grooveCenter: point2D, angle: number): {
    ccw: { origin: point2D, intersection: point2D }, cw: { origin: point2D, intersection: point2D }
  } {

    const adjustedAngleCCW = angle + this._toothInnerFilletCenterAngle;
    const adjustedAngleCW = angle - this._toothInnerFilletCenterAngle;

    return {
      ccw: {
        origin: polarMove(grooveCenter, adjustedAngleCCW, this._toothInnerFilletCenterDist),
        intersection: polarMove(grooveCenter, adjustedAngleCCW - 180, this._pulleyProfile.toothRadius)
      },
      cw: {
        origin: polarMove(grooveCenter, adjustedAngleCW, this._toothInnerFilletCenterDist),
        intersection: polarMove(grooveCenter, adjustedAngleCW - 180, this._pulleyProfile.toothRadius)
      }
    }

  }

  private getToothPath(origin: point2D, angle: number) {
    const path: point2D[] = [];

    //center from where to draw the 0.555 mm radius curve
    const grooveCenter = polarMove(origin, angle, (this._innerRadius) + this._pulleyProfile.toothRadius);
    const intFilletPoints = this._getInternalFilletPoints(grooveCenter, angle);

    const ccwShoulder = this._getShoulderFilletPoint(intFilletPoints.ccw.origin, angle, 'ccw');
    const cwShoulder = this._getShoulderFilletPoint(intFilletPoints.cw.origin, angle, 'cw');

    console.log({
      origin,
      angle,
      intFilletPoints,
      ccwShoulder,
      cwShoulder
    });


    path.push(...getArch(ccwShoulder.origin, this._pulleyProfile.filletRadius,
      vectorAngle([ccwShoulder.origin, ccwShoulder.edges.top]),
      vectorAngle([ccwShoulder.origin, ccwShoulder.edges.bottom])));

    path.push(...getArch(intFilletPoints.ccw.origin, this._pulleyProfile.toothInnerRadius,
      vectorAngle([intFilletPoints.ccw.origin, ccwShoulder.edges.bottom]),
      vectorAngle([intFilletPoints.ccw.origin, intFilletPoints.ccw.intersection]),));

    // path.push(...getArch(grooveCenter, this._pulleyProfile.toothRadius,
    //   vectorAngle([grooveCenter, intFilletPoints.ccw.intersection]),
    //   vectorAngle([grooveCenter, intFilletPoints.cw.intersection])));

    path.push(...getArch(intFilletPoints.cw.origin, this._pulleyProfile.toothInnerRadius,
      vectorAngle([intFilletPoints.cw.origin, intFilletPoints.cw.intersection]),
      vectorAngle([intFilletPoints.cw.origin, cwShoulder.edges.bottom])));

    path.push(...getArch(cwShoulder.origin, this._pulleyProfile.filletRadius,
      vectorAngle([cwShoulder.origin, cwShoulder.edges.bottom]),
      vectorAngle([cwShoulder.origin, cwShoulder.edges.top])));

    return path;
  }

  getPaths(): path2D[] {
    const points: point2D[] = [];
    const paths: path2D[] = [];


    this._pitchRadius = ((2 * this.getParameterValue('toothCount').value) / Math.PI) / 2;

    this._outerRadius = this._pitchRadius - this._pulleyProfile.pitchLineDepth; // The outside diameter of the pulley at the addendum 
    this._innerRadius = this._outerRadius - this._pulleyProfile.grooveDepth; // the inner diameter of the pulley at the dedendum height


    const hDist = (this._outerRadius - (this._pulleyProfile.toothRadius + this._innerRadius));
    const hypo = this._toothInnerFilletCenterDist = Math.sqrt(Math.pow(hDist, 2) + Math.pow(this._pulleyProfile.pitchFactor, 2));
    this._toothInnerFilletCenterDist = hypo;
    this._toothInnerFilletCenterAngle = getTriangleVertices([hDist, hypo, this._pulleyProfile.pitchFactor])[1];

    // points.push(...this.getToothPath(this._origin, 0));
    // points.push(...this.getToothPath(this._origin, 90));

    // points.push(...this.getToothPath(this._origin, 0));
    // points.push(...this.getToothPath(this._origin, 180));

    const toothAngle = (360 / this.getParameterValue('toothCount').value);
    for (let ta = toothAngle; ta <= 360; ta += toothAngle) {
      points.push(...this.getToothPath(this._origin, ta));
    }

    paths.push({
      strokeColor: '#00ffff',
      fillColor: '#00ffff',
      points
    });

    // console.log({ points });
    return paths; // all the points conforming the pulley
  }
}