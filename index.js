import { init } from "./src/app.js";

document.addEventListener("DOMContentLoaded", () => {
  const blueShapeNodes = document.querySelectorAll(".blue");
  const blueShapes = Array.from(blueShapeNodes).map((shape) => {
    if (!(shape instanceof HTMLElement)) {
      throw new Error(".blue must be an HTMLElement");
    }
    return shape;
  });

  const dropContainer = document.querySelector("main");
  if (!(dropContainer instanceof HTMLElement)) {
    throw new Error("main drop area must be an HTMLElement");
  }

  const redShapeOutput = document.querySelector(".red output");
  if (!(redShapeOutput instanceof HTMLElement)) {
    throw new Error(".red output must be an HTMLElement");
  }

  init({
    blueShapes,
    dropContainer,
    redShapeOutput,
  });
});
