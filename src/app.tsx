import { useEffect, useState } from "react";
import { Badge, Container } from "react-bootstrap";
import { ShapeControls } from "./components/Controls";
import Canvas from "./components/preview/Canvas";
import { getShape, getShapeOptions, shapeKeys } from "./shapes";
import { Shape, ShapeParameter } from "./types";
// import 'bootstrap/dist/css/bootstrap.min.css';

export type shapeControlBoxProps = {
  onChange: (shape: Shape) => void;
}

function ZoomBadge({ zoom }: { zoom: number }) {
  return (
    <Badge id="zoomBadge">
      Zoom: {zoom}x
    </Badge>);
}

function ShapeControlBox({ onChange }: shapeControlBoxProps) {
  const [shapeKey, setShapeKey] = useState<shapeKeys>('Cycloid');
  const [shapeParams, setShapeParams] = useState<ShapeParameter>({});
  const [shapeObj, setShapeObj] = useState(getShape(shapeKey));

  useEffect(() => {
    const newShape = getShape(shapeKey, shapeParams)
    setShapeObj(newShape);
    onChange(newShape);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shapeParams]);

  const shapeKeyChangeHandler = (key: shapeKeys) => {
    setShapeKey(key);
    const newShape = getShape(key);
    setShapeObj(newShape);
    setShapeParams(newShape.getParametersList());
    onChange(newShape);
  }

  const updateShapeParam = (param: string, value: number) => {
    console.log({ param, value });
    try {
      const p = shapeObj?.getParameterValue(param);
      if (p) {
        p.value = value;
        const newP = Object.fromEntries([[param, p]]);
        setShapeParams({ ...shapeParams, ...newP });
      }
    } catch (ex) { console.error(ex); }
  }

  return (
    <Container id="shapeControls">
      <ShapeControls
        controlsList={shapeObj.getParametersList()}
        onChange={updateShapeParam}
        onShapeChange={shapeKeyChangeHandler}
        opts={getShapeOptions()}
      />
    </Container>
  )
}




export default function App() {
  const [shape, setShape] = useState<Shape | null>(null);
  const [zoom, setZoom] = useState(1);

  const shapeChangeHandler = (s: Shape) => {
    console.log(s);
    setShape(s);
  }

  return (
    <Container style={{ overflow: 'hidden' }}>
      <Canvas shape={shape} grid={true} axes={true} onZoomChange={(zoom) => setZoom(zoom)} zoom={zoom} />
      <Container id="footer">
        <ZoomBadge zoom={zoom} />
        <ShapeControlBox onChange={shapeChangeHandler} />
      </Container>
    </Container>
  );
}
