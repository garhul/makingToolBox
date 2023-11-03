import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { ShapeControls } from "./components/Controls";
import DownloadBadge from "./components/DownloadBadge";
import Canvas from "./components/preview/Canvas";
import { TopRightBar } from "./components/TopControls";
import { getDefaultTheme, getTheme, ThemeContext, themeOptions } from "./providers/theme";
import { getShape, getShapeOptions, shapeKeys } from "./shapes";
import Shape from "./shapes/Shape";


export type shapeControlBoxProps = {
  onParamsChange: (paramKey: string, value: number) => void;
  onShapeChange: (shapeKey: shapeKeys) => void;
  shape: Shape;
}

function ShapeControlBox({ onParamsChange, onShapeChange, shape }: shapeControlBoxProps) {
  return (
    <Container id="shapeControls">
      <ShapeControls
        controlsList={shape.getParametersList()}
        onParamChange={onParamsChange}
        onShapeChange={onShapeChange}
        opts={getShapeOptions()}
      />
    </Container>
  )
}

export default function App() {
  const [shapeKey, setShapeKey] = useState<shapeKeys>('Cycloid');
  const [zoom, setZoom] = useState(4);
  const [theme, setTheme] = useState<themeOptions>(getDefaultTheme()); //default to autodetect the theme
  const [shape, setShape] = useState<Shape>(getShape(shapeKey, {})); //default shape is a cycloid

  const handleShapeChange = (key: shapeKeys) => {
    setShapeKey(key);
    setShape(getShape(key, {}));
  }

  const handleParamsChange = (param: string, value: number) => {
    if (Number.isNaN(value)) return;
    try {
      const p = shape.getParameterValue(param);

      if (p) {
        p.value = value;
        const newP = Object.fromEntries([[param, p]]);
        const newShape = getShape(shapeKey, { ...shape.getParametersList(), ...newP });
        setShape(newShape);
        // setShapeParams({ ...shapeParams, ...newP });
      }
    } catch (ex) { console.error(ex); }
  }

  useEffect(() => {
    const t = getTheme(theme);
    Object.keys(t).forEach(k => {
      document.documentElement.style.setProperty(k, t[k as keyof typeof t]);
    });
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }} >
      <Container style={{ overflow: 'hidden' }}>
        <TopRightBar />
        <Canvas shape={shape} grid={true} axes={true} onZoomChange={(zoom) => setZoom(zoom)} zoom={zoom} />
        {/* <ZoomBadge zoom={zoom} /> */}
        <DownloadBadge shape={shape} />
        <ShapeControlBox onShapeChange={handleShapeChange} onParamsChange={handleParamsChange} shape={shape} />
      </Container>
    </ThemeContext.Provider>
  );
}
