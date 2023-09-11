import { useState } from "react";
import { Badge, Container } from "react-bootstrap";
import { ShapeControls, ShapeSelector } from "./components/Controls";
import Canvas from "./components/preview/Canvas";
import { getShape, getShapeOptions, shapeKeys } from "./shapes";

export default function App() {
  const [shapeKey, setShapeKey] = useState<shapeKeys>('Cycloid')
  const zoom = 1;
  const grid = true;
  const axes = true;

  const Shape = getShape(shapeKey);

  return (
    <Container style={{ overflow: 'hidden' }}>
      <Canvas />
      <Container id="footer">
        <Badge>Zoom: {zoom}</Badge>
        <ShapeSelector
          onChange={(key) => console.log(key)}
          options={getShapeOptions()}
        />
        {Shape && <ShapeControls
          controlsList={Shape.getParametersList()}
          onChange={(key, value) => Shape.setParameterValue(key, value)}
        />}
      </Container>
    </Container>
  );
}
