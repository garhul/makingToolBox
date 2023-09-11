import { dimensions2d, point2D } from "src/types";

export type gridProperties = {
  ctx: CanvasRenderingContext2D;
  zoom: number;
  size: number;
  dimensions: dimensions2d;
  origin: point2D;
  color: string;
}

function drawScale({ ctx }: Partial<gridProperties>) {
  console.log(ctx);
}

function drawGrid({ ctx, zoom, size, dimensions, origin, color }: gridProperties) {
  ctx.lineWidth = 1;
  ctx.strokeStyle = color;
  ctx.beginPath();

  const gridStart = dimensions.width - origin.x;

  const count_x = dimensions.width / size;
  //grid must start from origin and expand left and right,top and bottom

  //horizontal grid
  console.log(gridStart);
  for (let x = gridStart; x <= dimensions.height; x += size) {
    console.log(x);
    ctx.strokeRect(0, x, dimensions.width, 0);
  }

  // for (let y = size; y <= canvasWidth; y += size) {
  //   ctx.strokeRect(y, 0, 0, canvasWidth);
  // }

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
  ctx.strokeStyle = "#EE0000";
  ctx.fillStyle = "#FF0000";
  ctx.fillText("X", 4, origin.y - 8);

  ctx.moveTo(0, origin.y);
  ctx.lineTo(dimensions.width, origin.y);
  ctx.closePath();
  ctx.stroke();

  ctx.beginPath();
  ctx.strokeStyle = "#00EE00";
  ctx.fillStyle = "#00FF00";
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
}