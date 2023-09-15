import { useEffect, useState } from "react";
import { Badge, Container } from "react-bootstrap";
import { ShapeControls } from "./components/Controls";
import DownloadBadge from "./components/DownloadBadge";
import Canvas from "./components/preview/Canvas";
import TopLeftControls from "./components/TopLeftControls";
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
  const [shapeKey, setShapeKey] = useState<shapeKeys>('Gt2Pulley');
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
  const [zoom, setZoom] = useState(40);

  return (
    <Container style={{ overflow: 'hidden' }}>
      <TopLeftControls />
      <Canvas shape={shape} grid={true} axes={true} onZoomChange={(zoom) => setZoom(zoom)} zoom={zoom} />
      {/* <ZoomBadge zoom={zoom} /> */}
      <DownloadBadge shape={shape} />
      <ShapeControlBox onChange={setShape} />
    </Container>
  );
}
