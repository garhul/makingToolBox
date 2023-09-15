import { dimensions2d, point2D } from "src/types";

export type gridProperties = {
  ctx: CanvasRenderingContext2D;
  zoom: number;
  zoomRatio: number;
  size: number;
  dimensions: dimensions2d;
  origin: point2D;
  color: string;
}

function drawScale({ ctx, dimensions, zoom, zoomRatio }: gridProperties) {
  ctx.beginPath();
  ctx.font = "16px Geologica, sans-serif";
  ctx.strokeStyle = "#FFF";
  ctx.fillStyle = "#DDD";
  const scaleSize = 25 * zoom * zoomRatio;

  ctx.fillText(`Zoom: ${zoom}`, 20, dimensions.height - 100);

  ctx.fillText("25 mm", 20, dimensions.height - 50);

  ctx.moveTo(20.5, dimensions.height - 80.5);
  ctx.lineTo(20.5 + scaleSize, dimensions.height - 80.5);

  ctx.moveTo(20.5, dimensions.height - 70);
  ctx.lineTo(20.5, dimensions.height - 90);

  ctx.moveTo(20.5 + scaleSize, dimensions.height - 70);
  ctx.lineTo(20.5 + scaleSize, dimensions.height - 90);

  ctx.closePath();
  ctx.stroke();
}

function drawGrid({ ctx, zoom, size, dimensions, origin, color }: gridProperties) {
  ctx.lineWidth = 1;
  ctx.strokeStyle = color;
  ctx.beginPath();

  //vertical grid lines
  for (let x = origin.x; x <= dimensions.width; x += size) {
    ctx.strokeRect(x, 0, 0.5, dimensions.height);
  }

  for (let x = origin.x; x >= 0; x -= size) {
    ctx.strokeRect(x, 0, 0.5, dimensions.height);
  }

  // horizontal grid lines
  for (let y = origin.y; y <= dimensions.height; y += size) {
    ctx.strokeRect(0, y, dimensions.width, 0.5);
  }

  for (let y = origin.y; y >= 0; y -= size) {
    ctx.strokeRect(0, y, dimensions.width, 0.5);
  }

  ctx.closePath();
  ctx.stroke();
}

type drawAxesParams = {
  ctx: CanvasRenderingContext2D;
  dimensions: dimensions2d;
  origin: point2D;
}

function drawAxes({ ctx, dimensions, origin }: drawAxesParams) {
  // Draw X axis
  ctx.beginPath();
  ctx.font = "1.5em Geologica, sans-serif";
  ctx.strokeStyle = "#AA0000";
  ctx.fillStyle = "#AA0000";
  ctx.fillText("X", 4, origin.y - 8);

  ctx.moveTo(0, origin.y);
  ctx.lineTo(dimensions.width, origin.y);
  ctx.closePath();
  ctx.stroke();

  ctx.beginPath();
  ctx.strokeStyle = "#00AA00";
  ctx.fillStyle = "#00AA00";
  ctx.fillText("Y", origin.x + 4, dimensions.height - 8);

  ctx.moveTo(origin.x, dimensions.height);
  ctx.lineTo(origin.x, 0);
  ctx.closePath();
  ctx.stroke();
}

export default function drawBackground(properties: gridProperties, axes = true, grid = true) {
  // draw axes
  if (drawGrid) drawGrid(properties);
  if (axes) drawAxes(properties);
  drawScale(properties);
}