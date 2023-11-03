export type point2D = {
  x: number;
  y: number;
};

export type vector = [point2D, point2D];

export type dimensions2d = {
  width: number;
  height: number;
}

export type path2D = {
  fillColor: string | null;
  strokeColor: string | null;
  points: point2D[];
}
