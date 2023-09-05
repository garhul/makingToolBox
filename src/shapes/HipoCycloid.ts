
// const _ = (id) => document.getElementById(id);

export type cycloidSettings = {
  pinCount: number;
  pinRadius: number;
  cycloidRadius: number;
  excentricity: number;
}

export type point = {
  x: number;
  y: number;
}

// export default function getPoints(): string


const getPoint = (step: number, settings: cycloidSettings): point => {
  const { pinCount, pinRadius, cycloidRadius, excentricity } = settings;
  /*const N = 16; //number of pins (roller)
  const Rr = 6.5; //Radius of Radius of the roller
  const R = 45; // - Radius of the rollers PCD (Pitch Circle Diamater)
  const E = 1.5; //excentricity
  */
  // x = (45*cos(t))-(6.5*cos(t+arctan(sin((1-16)*t)/((45/(1.5*16))-cos((1-16)*t)))))-(1.5*cos(16*t))
  // y = (-45*sin(t))+(6.5*sin(t+arctan(sin((1-16)*t)/((45/(1.5*16))-cos((1-16)*t)))))+(1.5*sin(16*t))
  return {
    x: (cycloidRadius * Math.cos(step)) - (pinRadius * Math.cos(step + Math.atan(Math.sin((1 - pinCount) * step) / ((cycloidRadius / (excentricity * pinCount)) - Math.cos((1 - pinCount) * step))))) - (excentricity * Math.cos(pinCount * step)),
    y: (-cycloidRadius * Math.sin(step)) + (pinRadius * Math.sin(step + Math.atan(Math.sin((1 - pinCount) * step) / ((cycloidRadius / (excentricity * pinCount)) - Math.cos((1 - pinCount) * step))))) + (excentricity * Math.sin(pinCount * step))
  }
}


// export default getPoints = (points) => {
//   const scale = 4;
//   const canvas = _('previewCanvas');
//   const ctx = canvas.getContext("2d");
//   const offset = { x: canvas.width / 2, y: canvas.height / 2 };
//   ctx.clearRect(0, 0, canvas.width, canvas.height);
//   ctx.lineWidth = 1;
//   ctx.strokeStyle = "#ff6600";
//   ctx.fillStyle = "red";
//   // ctx.fillRect(10, 10, 100, 100);

//   ctx.moveTo(points[0].x, points[0].y);
//   ctx.beginPath(); // Start a new path    
//   for (const point of points) {

//     ctx.lineTo((point.x * scale + offset.x), (point.y * scale + offset.y)); // Draw a line to (150, 100)    
//     ctx.moveTo((point.x * scale + offset.x), (point.y * scale + offset.y));
//   }

//   ctx.closePath(); // Line to bottom-left corner
//   ctx.stroke();
// }



export default (settings: cycloidSettings): point[] => {
  const pointCount = 3600;
  const range = { start: 0, end: 2 * Math.PI };
  const step = Math.PI / pointCount;
  const points = [];

  for (let t = range.start; t < range.end; t += step) {
    points.push(getPoint(t, settings));
  }
  // console.log(points);
  return points;
}



// (() => {
//   let settings = {
//     pins: _('pin-count-range').value,
//     pinsR: _('pin-radius-range').value,
//     radius: _('radius-range').value,
//     ex: _('excentricity-range').value
//   };

//   console.log(settings);
//   update(settings);

//   _('pin-count-range').addEventListener('change', ev => {
//     console.log(ev.target.value);
//     settings = { ...settings, ...{ pins: ev.target.value } }
//     update(settings);
//   });

//   _('pin-radius-range').addEventListener('change', ev => {
//     console.log(ev.target.value);
//     settings = { ...settings, ...{ pinsR: ev.target.value } };
//     update(settings);
//   });

//   _('radius-range').addEventListener('change', ev => {
//     console.log(ev.target.value);
//     settings = { ...settings, ...{ radius: ev.target.value } };
//     update(settings);
//   });

//   _('excentricity-range').addEventListener('change', ev => {
//     console.log(ev.target.value);
//     settings = { ...settings, ...{ ex: ev.target.value } };
//     update(settings);
//   });

// })();