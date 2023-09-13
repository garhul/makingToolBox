export type point2D = {
  x: number;
  y: number;
};

export type dimensions2d = {
  width: number;
  height: number;
}

export type ShapeParameterValue = {
  name: string;
  tooltip?: string;
  value: number;
  min: number;
  max: number;
  step: number;
};

export type ShapeParameter = Record<string, ShapeParameterValue>

export interface Shape {
  getPoints: () => point2D[];
  getParametersList: () => ShapeParameter;
  getParameterValue: (key: string) => ShapeParameterValue;
  render: (context: CanvasRenderingContext2D, zoom: number, origin: point2D) => void;
}
