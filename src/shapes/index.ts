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

export function getShape(key: shapeKeys) {
  switch (key) {
    case 'Cycloid':
      return new Cycloid();
    case 'Gt2Pulley':
      return null;
  }
}