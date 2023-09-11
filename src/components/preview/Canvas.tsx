import { useEffect, useRef, useState, WheelEvent } from "react";
import { point2D } from "src/types";
import drawBackground from "./grid";

const drawPoints = (ctx: CanvasRenderingContext2D, points: point2D[], zoomLevel: number, w: number, h: number) => {

  const offset = { x: w / 2, y: h / 2 };
  ctx.strokeStyle = "#ff6600";

  ctx.moveTo(points[0].x, points[0].y);
  ctx.beginPath(); // Start a new path    

  for (const point of points) {
    ctx.lineTo((point.x * zoomLevel + offset.x), (point.y * zoomLevel + offset.y));
    ctx.moveTo((point.x * zoomLevel + offset.x), (point.y * zoomLevel + offset.y));
  }

  ctx.closePath(); // Line to bottom-left corner
  ctx.stroke();
}

export type canvasViewProperties = {
  origin: { x: number, y: number };
  zoom: number;
  grid: boolean;
  axes: boolean;
};

export default function Canvas() {
  const [viewProperties, setViewProperties] = useState<canvasViewProperties>({
    origin: { x: 0, y: 0 }, //represents the central point from where to draw everything
    zoom: 1,
    grid: true,
    axes: true
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current || null;
    if (canvas === null) return;
    console.log('coso');
    setViewProperties((viewProperties) => ({ ...viewProperties, ...{ origin: { x: canvas.width / 2, y: canvas.height / 2 } } }));
  }, [canvasRef]);

  useEffect(() => {
    const canvas = canvasRef.current || null;
    const context = canvas?.getContext('2d') || null;
    if (context === null || canvas === null) return;

    //size the canvas properly
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    //clear first
    console.log({ cw: canvas.width, ch: canvas.height });
    context.clearRect(0, 0, canvas.width, canvas.height);

    drawBackground({     // draw scale bar ?
      ctx: context,
      zoom: viewProperties.zoom,
      size: Math.ceil(window.innerWidth / 50),
      dimensions: { width: canvas.width, height: canvas.height },
      origin: viewProperties.origin,
      color: '#000'
    }, viewProperties.axes, viewProperties.grid);

    // draw objects
    // drawPoints(context, getPoints({ cycloidRadius: 40, excentricity: 1, pinCount: 10, pinRadius: 3 }), viewProperties.zoom, canvas.width, canvas.height);

    // No animations, we need something to show 

  }, [viewProperties]);

  const handleScroll = (ev: WheelEvent<HTMLCanvasElement>) => {
    const maxZoomLevel = 10;
    const minZoomLevel = 0.25;

    if (ev.deltaY > 0) {
      if (viewProperties.zoom < maxZoomLevel) setViewProperties({ ...viewProperties, ...{ zoom: viewProperties.zoom + .25 } });
    } else {
      if (viewProperties.zoom > minZoomLevel) setViewProperties({ ...viewProperties, ...{ zoom: viewProperties.zoom - .25 } });
    }
  }

  return (
    <canvas ref={canvasRef} onWheel={handleScroll} />
  );
}