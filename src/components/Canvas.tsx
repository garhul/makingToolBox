import { useEffect, useRef, useState, WheelEvent } from "react";
import { Container } from "react-bootstrap";
import getPoints, { point } from '../shapes/HipoCycloid';

export type CanvasProps = {
  showGrid: boolean;
  objects: unknown[];
}


const drawPoints = (ctx: CanvasRenderingContext2D, points: point[], zoomLevel: number, w: number, h: number) => {

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

const drawAxes = (ctx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number) => {
  // Draw X axis
  ctx.beginPath();
  ctx.font = "1.5em Geologica, sans-serif";
  ctx.strokeStyle = "#EE0000";
  ctx.fillStyle = "#FF0000";
  ctx.fillText("X", canvasWidth - 20, canvasHeight - 8);

  ctx.moveTo(canvasHeight, canvasWidth);
  ctx.lineTo(0, canvasHeight);
  ctx.closePath();
  ctx.stroke();

  ctx.beginPath();
  ctx.strokeStyle = "#00EE00";
  ctx.fillStyle = "#00FF00";
  ctx.fillText("Y", 5, 20);

  ctx.moveTo(0, canvasWidth);
  ctx.lineTo(0, 0);
  ctx.closePath();
  ctx.stroke();
}

const drawGrid = (ctx: CanvasRenderingContext2D, size: number, canvasWidth: number, canvasHeight: number) => {
  ctx.lineWidth = 1;
  ctx.strokeStyle = "#555";
  ctx.beginPath();

  ctx.setLineDash([4, 10]);
  for (let x = size; x <= canvasHeight; x += size) {
    ctx.strokeRect(0, x, canvasWidth, 0);
  }

  for (let y = size; y <= canvasWidth; y += size) {
    ctx.strokeRect(y, 0, 0, canvasWidth);
  }

  ctx.setLineDash([1]);
  ctx.closePath();
  ctx.stroke();
}

export type canvasProps = {
  size: number;
  showGrid: boolean;
  initialZoom?: number;
  canvasDimensions?: { h: number, w: number };
  objects?: unknown[];
  animate?: boolean;
}

export default function Canvas({ showGrid, size }: canvasProps) {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const scale = window.devicePixelRatio;
  // console.log({ scale });

  useEffect(() => {
    const canvas = canvasRef.current || null;
    const context = canvas?.getContext('2d') || null;
    if (context === null || canvas === null) return;
    //clear first
    console.log('clearing canvas');
    context.clearRect(0, 0, canvas.width, canvas.height);

    drawAxes(context, canvas.width, canvas.height);
    if (showGrid) drawGrid(context, zoomLevel * 40, canvas.width, canvas.height);
    drawPoints(context, getPoints({ cycloidRadius: 40, excentricity: 1, pinCount: 10, pinRadius: 3 }), zoomLevel, canvas.width, canvas.height);

    // let frameCount = 0
    // let animationFrameId

    // const render = () => {
    //   // frameCount++
    //   // draw(context, frameCount)
    //   // animationFrameId = window.requestAnimationFrame(render)


    // }

    // render();

    return () => {
      // window.cancelAnimationFrame(animationFrameId)
    }

  }, [showGrid, zoomLevel]);

  const handleScroll = (ev: WheelEvent<HTMLCanvasElement>) => {
    const maxZoomLevel = 10;
    const minZoomLevel = 0.25;

    if (ev.deltaY > 0) {
      if (zoomLevel < maxZoomLevel) setZoomLevel(zoomLevel + .25);
    } else {
      if (zoomLevel > minZoomLevel) setZoomLevel(zoomLevel - .25);
    }
  }

  return (
    <Container>
      <canvas ref={canvasRef} onWheel={handleScroll} width={size * scale} height={size * scale} />
    </Container>
  )

}

// const useCanvas = (callback) => {
//   const canvasRef = React.useRef(null);

//   React.useEffect(() => {
//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext('2d');
//     callback([canvas, ctx]);
//   }, []);

//   return canvasRef;
// }

// const Canvas = () => {
//   const [position, setPosition] = React.useState({});

//   const canvasRef = useCanvas(([canvas, ctx]) => {
//     ctx.fillRect(0, 0, canvas.width, canvas.height);
//     const x = canvas.width;
//     const y = canvas.height;
//     setPosition({ x, y });
//   });

//   return (<canvas ref={canvasRef} />);
// };