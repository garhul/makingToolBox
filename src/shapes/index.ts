import { Shape, ShapeParameter } from "src/types";
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

export function getShape(key: shapeKeys, params: ShapeParameter = {}, color = '#FFBB00'): Shape {
  switch (key) {
    case 'Cycloid':
      return new Cycloid(params, color);
    case 'Gt2Pulley':
      return new Cycloid(params, '#0099ff');
  }
}