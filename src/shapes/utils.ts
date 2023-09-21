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


export function littleCross(origin: point2D) {
  const path = [];

  //vertical
  for (let y = origin.y - 2; y <= origin.y + 2; y++) {
    path.push({ x: origin.x, y });
  }

  path.push({ x: origin.x, y: origin.y });

  //horizontal
  for (let x = origin.x - 2; x <= origin.x + 2; x++) {
    path.push({ x, y: origin.y });
  }

  return path;

}
/** Returns the length of an arc of given radius and given angle of travel
 * 
 *  For instance given an angle of 90 degrees would yied 1/4 of the perimeter of a circle of radius R
  */
export function getArcDistance(radius: number, angle: number) {
  return (2 * Math.PI * radius) * angle;
}

/** returns the angle that would trace an arc of given distance at given radius 
 *  
 *  for instance what would be the angle needed to draw a 10mm length arc in a radius of R
 * 
*/
export function getAngleOfArc(radius: number, distance: number) {
  return distance / (2 * Math.PI * radius);
}

/* returns the angle between two points in a circle of radius R */
export function getAngleOfPointsInACircle(radius: number, points: point2D[]) {
  const a = getTriangleVertices([Math.abs(radius), Math.abs(radius), dist(points[0], points[1])]);
  console.log({ a, radius, points });
  return a[1];
}

export function getArch(centre: point2D, radius: number, angleFrom: number, angleTo: number) {
  const path: point2D[] = [];

  console.log({ angleFrom, angleTo });

  if (angleFrom < angleTo) {
    for (let a = angleFrom; a <= angleTo; a += 1) {
      path.push(polarMove(centre, a, radius));
    }
  } else {
    for (let a = angleFrom; a >= angleTo; a -= 1) {
      path.push(polarMove(centre, a, radius));
    }
  }

  return path;
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
  const distance = dist(from, to);

  const angles = getTriangleVertices([Math.abs(radius), Math.abs(radius), distance]);
  const insideAngle = getAngleOfPointsInACircle(radius, [from, to]); //angles[0]; //ba;
  const shiftAngle = angles[2]; //ac

  const initAngle = vectorAngle([from, to]);
  const angle = initAngle + ((radius < 0) ? shiftAngle : -shiftAngle);

  //start point from where to begin the arc
  const arcOrigin = polarMove(from, angle, radius);
  // console.log({ from, angle, radius })
  // console.log({ startAngle: vectorAngle([arcOrigin, from]), endAngle: vectorAngle([arcOrigin, to]) })

  // no se que es esto
  // const addodn = vectorAngle([arcOrigin, from]);

  // // path.push(arcOrigin);
  // const center = polarMove(from, angle, radius);

  // if (radius > 0) {
  //   arc.startAngle = vectorAngle(center, from);
  //   arc.endAngle = vectorAngle(center, to);
  //   var addodn = vectorAngle(center, from);
  //   while (insideAngle >= 0) {
  //     arc.path.push(polar(arc.center, insideAngle + addodn, radius));
  //     insideAngle -= 0.1;
  //   }
  //   for (let angle = insideAngle; angle >= 0; angle -= 1) {
  //     path.push(polarMove(from, angle + addodn, radius));
  //   }
  // } else {
  //   arc.endAngle = vectorAngle(arc.center, from);
  //   arc.startAngle = vectorAngle(arc.center, to);

  //   var addodn = vectorAngle(arc.center, to);
  //   i = 0;
  //   while (i <= insideAngle) {
  //     arc.path.push(polar(arc.center, i + addodn, radius));
  //     i += 1;
  //   }
  //   for (let angle = 0; angle <= insideAngle; angle += 1) {
  //     path.push(polarMove(from, angle + addodn, radius));
  //   }
  // }

  // for (let angle = 0; angle <= 360; angle += 1)  path.push(polarMove(arcOrigin, angle + addodn, radius));

  return path;
}