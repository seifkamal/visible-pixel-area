import html2canvas from "html2canvas";

/**
 * @typedef {[number, number, number]} PixelColor
 * @typedef {(color: PixelColor) => Promise<number>} PixelCounter
 * @returns {PixelCounter}
 */
export function createPixelCounter() {
  const canvas = new OffscreenCanvas(window.innerWidth, window.innerHeight);
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) {
    throw new Error("canvas 2d context not available");
  }

  return async (color) => {
    const image = await captureDocumentImage(canvas, ctx);
    return countPixels(image.data, color);
  };
}

/**
 * @param {OffscreenCanvas} canvas
 * @param {OffscreenCanvasRenderingContext2D} ctx
 * @returns {Promise<ImageData>}
 */
async function captureDocumentImage(canvas, ctx) {
  const renderedCanvas = await html2canvas(document.documentElement, {
    foreignObjectRendering: true,
    logging: false,
  });

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(renderedCanvas, 0, 0, canvas.width, canvas.height);

  return ctx.getImageData(0, 0, canvas.width, canvas.height);
}

/**
 * @param {Uint8ClampedArray} pixels
 * @param {PixelColor} color
 * @returns {number}
 */
function countPixels(pixels, [r = 0, g = 0, b = 0]) {
  let count = 0;
  for (let i = 0; i < pixels.length; i += 4) {
    const red = pixels[i];
    const green = pixels[i + 1];
    const blue = pixels[i + 2];

    if (red === r && green === g && blue === b) {
      count++;
    }
  }

  return count;
}
