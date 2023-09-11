export type point2D = {
  x: number;
  y: number;
};

export type dimensions2d = {
  width: number;
  height: number;
}

export type ShapeParameter = {
  name: string;
  key: string;
  tooltip?: string;
  value: number;
  min: number;
  max: number;
  step: number;
}

export interface Shape {
  getPoints: () => point2D[];
  getParametersList: () => ShapeParameter[];
}
