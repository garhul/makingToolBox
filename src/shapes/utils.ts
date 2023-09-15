import { point2D, vector } from "src/types";
/** Bunch of helper functions for 2d aritmethics */

/** gets the angle of the vector formed by two points */
export function vectorAngle(v: vector): number {
  return Math.atan2(v[1].y - v[0].y, v[1].x - v[0].x) * 180 / Math.PI
}

/** gets the distance between two points */
export function dist(p1: point2D, p2: point2D): number {
  return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
}

export function radianToDegrees(r: number): number {
  return (180 / Math.PI) * r;
}

export function degreeToRadian(d: number): number {
  return d * (Math.PI / 180);
}

/**
 * Get the cartesian point coordinates of a point after performing a movement in polar coordinates system
*/
export function polarMove(origin: point2D, angle: number, distance: number): point2D {
  return {
    'x': ((distance * Math.cos(degreeToRadian(angle))) + origin.x),
    'y': ((distance * Math.sin(degreeToRadian(angle))) + origin.y),
  }
}

/** 
 * given two sides and an angle return the angles of the whole triangle
 * 
 * @param {number[] } sides the given sides of the triangle
 * @param {number} vertex angle between sides in degrees
 * 
 * @returns {number[]} an array containing the angles of the 3 vertices of our triangle
 */
export function getTriangleFromSidesAndVertex(sides: number[], vertex: number) {

  //calculate the length of the missing side;
  sides.push(Math.sqrt(Math.pow(sides[1], 2) + Math.pow(sides[0], 2) - 2 * sides[1] * sides[0] * Math.cos(degreeToRadian(vertex))));
  return getTriangleVertices(sides);
}

/** Returns the angles of a triangle based on the length of it sides 
 * 
 *     /\
 *  a /  \ c
 *    ----
 *     b
*/
export function getTriangleVertices(sides: number[]): number[] {
  const angles = [0, 0, 0];

  angles[0] = radianToDegrees(Math.acos((Math.pow(sides[0], 2) + Math.pow(sides[2], 2) - Math.pow(sides[1], 2)) / (2 * sides[0] * sides[2])));
  angles[2] = radianToDegrees(Math.acos((Math.pow(sides[1], 2) + Math.pow(sides[2], 2) - Math.pow(sides[0], 2)) / (2 * sides[1] * sides[2])));
  angles[1] = 180 - angles[0] - angles[2];

  return angles;
}

/**
 * Returns an array of points that represent the arch from point to point at a given radius, separated by 0.1 degree
 * 
 * @param from point from where to begin
 * @param to point to end
 * @param radius radius of the arc
 * @returns {point2D[]} an array of points that make the path
 */
export function getArcPath(from: point2D, to: point2D, radius: number): point2D[] {
  const path: point2D[] = [];

  // radius = Math.abs(radius);
  const distance = dist(from, to);
  const angles = getTriangleVertices([Math.abs(radius), Math.abs(radius), distance]);
  const insideAngle = angles[2]; //ba;
  const shiftAngle = angles[1]; //ac

  const initAngle = vectorAngle([from, to]);

  const angle = initAngle + ((radius > 0) ? shiftAngle : -shiftAngle);

  const arcOrigin = polarMove(from, angle, radius);

  // console.log({ startAngle: vectorAngle([arcOrigin, from]), endAngle: vectorAngle([arcOrigin, to]) })

  // no se que es esto
  const addodn = vectorAngle([arcOrigin, from]);

  // draw  arc in ccw direction
  path.push(arcOrigin);

  // if (radius < 0) {
  //   for (let angle = insideAngle; angle >= 0; angle -= 1) {
  //     path.push(polarMove(arcOrigin, angle + addodn, radius));
  //   }
  // } else {
  //   for (let angle = 0; angle <= insideAngle; angle += 1) {
  //     path.push(polarMove(arcOrigin, angle + addodn, radius));
  //   }
  // }
  for (let angle = 0; angle <= 360; angle += 1)  path.push(polarMove(arcOrigin, angle + addodn, radius));


  return path;
}