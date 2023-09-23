import { useEffect, useRef, useState, WheelEvent } from "react";
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

  const zoomRatio = 4.2; // zoom Ratio is an attempt to adjust everything to look 1:1 without properly attempting to read DPI

  const canvas = canvasRef.current || null;
  const context = canvas?.getContext('2d') || null;
  if (context !== null && canvas !== null) {

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
      color: '#000'
    }, axes, grid);

    // draw objects
    shape?.render(context, zoom * zoomRatio, origin);
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