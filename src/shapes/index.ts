import Shape, { ShapeParameters } from "./Shape";
import GTPulley from "./GT2Pulley";
import Cycloid from "./HipoCycloid";

enum ShapeKeys {
  Cycloid,
  Gt2Pulley
};

export type shapeKeys = keyof typeof ShapeKeys;

export type shapeListOption = {
  key: shapeKeys;
  name: string;
}

export function getShapeOptions(): shapeListOption[] {
  return [{
    key: 'Cycloid',
    name: 'Cycloid disc',
  }, {
    key: 'Gt2Pulley',
    name: 'GT2 Pulley'
  }];
}

export function getShape(key: shapeKeys, params: ShapeParameters = {}): Shape {
  switch (key) {
    case 'Cycloid':
      return new Cycloid(params);
    case 'Gt2Pulley':
      return new GTPulley(params);
  }
}