export function createCanvas(width:number,height:number):HTMLCanvasElement{
  const canvas = document.createElement("canvas");
  canvas.width = width
  canvas.height = height||width
  if(document.body)
    document.body.appendChild(canvas)
  return canvas;
}
export function context2D(canvas:HTMLCanvasElement):CanvasRenderingContext2D{
  return canvas.getContext('2d')
}