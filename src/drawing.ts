import * as fs from "fs";
const PImage = require("pureimage");

export const drawLine = (
  ctx: any,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  stroke = "black",
  width = 3
) => {
  // start a new path
  ctx.beginPath();

  // place the cursor from the point the line should be started
  ctx.moveTo(x1, y1);

  // draw a line from current cursor position to the provided x,y coordinate
  ctx.lineTo(x2, y2);

  // set strokecolor
  ctx.strokeStyle = stroke;

  // set lineWidht
  ctx.lineWidth = width;

  // add stroke to the line
  ctx.stroke();
};

export const drawText = (
  ctx: any,
  text: string,
  size: number,
  x: number,
  y: number,
  align?: string
) => {
  const fnt = PImage.registerFont(
    "./src/assets/fonts/Nunito-Regular.ttf",
    "Source Sans Pro"
  );
  fnt.loadSync();

  ctx.textAlign = align || "center";
  ctx.fillStyle = "#111111";
  ctx.font = `${size} Nunito`;
  ctx.fillText(text, x, y);
};

export const drawTextWithBackground = (
  ctx: any,
  text: string,
  size: number,
  x: number,
  y: number,
  align?: string
) => {
  const fnt = PImage.registerFont(
    "./src/assets/fonts/Nunito-Regular.ttf",
    "Source Sans Pro"
  );
  fnt.loadSync();
  ctx.font = `${size} Nunito`;

  ctx.fillStyle = "#eee";
  ctx.fillRect(
    x - 8,
    y - size * 0.9 - 8,
    ctx.measureText(text).width + 8 + 8,
    size + 8 + 8,
    [16]
  );

  drawText(ctx, text, size, x, y, align);
};
