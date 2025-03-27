import {context2D, createCanvas} from "./canvas"
const S = Math.max(256,Math.min(innerWidth,1024));
const canvas = createCanvas(S,S);
const ctx:CanvasRenderingContext2D = context2D(canvas);

ctx.fillRect(0,0,S,S)

export default function(){}