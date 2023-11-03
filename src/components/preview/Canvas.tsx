import { useContext, useEffect, useRef, useState, WheelEvent } from "react";
import { getTheme, ThemeContext } from "src/providers/theme";

import Shape from "../../shapes/Shape";
import drawBackground from "./grid";

export type canvasViewProperties = {
  grid: boolean;
  axes: boolean;
  shape: Shape | null;
  zoom: number;
  onZoomChange: (zoom: number) => void;
};



export default function Canvas({ shape, grid, axes, zoom, onZoomChange }: canvasViewProperties) {
  const [, reRender] = useState({});
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
  const { theme, } = useContext(ThemeContext);

  const t = getTheme(theme);
  const colors = {
    grid: t["--canvas-grid"],
    yAxis: t["--canvas-y-axis"],
    xAxis: t["--canvas-x-axis"],
    scale: t["--canvas-scale"]
  };

  const zoomRatio = 4.2; // zoom Ratio is an attempt to adjust everything to look 1:1 without properly attempting to read DPI

  useEffect(() => {
    if (!canvasRef.current) return;

    setCanvas(canvasRef.current);
  }, [canvasRef]);

  const context = canvas?.getContext('2d') || null;
  if (canvas !== null && context !== null) {
    //size the canvas properly
    canvas.width = window.innerWidth * window.devicePixelRatio;
    canvas.height = window.innerHeight * window.devicePixelRatio;

    //get origin as center of screen:
    const origin = { x: canvas.width / 2, y: canvas.height / 2 };

    //clear before drawing
    // console.log({ cw: canvas.width, ch: canvas.height });
    context.clearRect(0, 0, canvas.width, canvas.height);

    drawBackground({
      ctx: context,
      zoomRatio,
      zoom: zoom,
      size: zoom * zoomRatio * 10,
      dimensions: { width: canvas.width, height: canvas.height },
      origin: origin,
      colors: colors
    }, axes, grid);

    // draw objects    
    shape?.render(context, zoom * zoomRatio, origin, [t["--canvas-fg-1"]]);
  }


  useEffect(() => {
    const update = () => reRender({});
    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener('resize', update);
    }
  }, []);


  const handleScroll = (ev: WheelEvent<HTMLCanvasElement>) => {
    const maxZoomLevel = 10;
    const minZoomLevel = 0.25;
    const z = (ev.deltaY < 0) ? zoom + .25 : zoom - .25;
    if (z <= maxZoomLevel && z >= minZoomLevel) {
      onZoomChange(z)
    }
  }

  return (
    <canvas ref={canvasRef} onWheel={handleScroll} />
  );
}