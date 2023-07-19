export const events = new EventTarget();
export const eventTypes = {
  shapeDrop: "app:shape:drop",
  shapeRound: "app:shape:round",
};

/**
 * @typedef {{
 *   blueShapes: HTMLElement[];
 *   dropContainer: HTMLElement;
 * }} AppProps
 *
 * @param {AppProps} props
 */
export function init({ blueShapes, dropContainer }) {
  initBlueShapes(blueShapes);
  initDropContainer(dropContainer);
}

/**
 * @param {AppProps['blueShapes']} blues
 */
function initBlueShapes(blues) {
  // Limit the space available for the spawn position randomising.
  const spawnXOffset = window.innerWidth / 3;
  const spawnYOffset = window.innerHeight / 1.5;

  blues.forEach((blue, idx) => {
    if (!blue.id) {
      blue.id = `shape-${idx}`;
    }

    const randomX = Math.random() * spawnXOffset;
    const randomY = Math.random() * spawnYOffset;
    blue.style.left = `${randomX}px`;
    blue.style.top = `${randomY}px`;
    blue.draggable = true;

    blue.addEventListener("click", async () => {
      blue.toggleAttribute("data-round");
      events.dispatchEvent(new Event(eventTypes.shapeRound));
    });

    blue.addEventListener("dragstart", (event) => {
      if (!event.dataTransfer) {
        return;
      }

      const data = {
        id: blue.id,
        offsetX: event.offsetX,
        offsetY: event.offsetY,
      };

      event.dataTransfer.setData("text/plain", JSON.stringify(data));
      blue.toggleAttribute("data-dragging", true);
    });

    blue.addEventListener("dragend", () => {
      blue.toggleAttribute("data-dragging", false);
    });
  });
}

/**
 * @param {AppProps['dropContainer']} container
 */
function initDropContainer(container) {
  container.addEventListener("dragover", (event) => event.preventDefault());
  container.addEventListener("drop", async (event) => {
    const draggableData = event.dataTransfer?.getData("text/plain");
    if (!draggableData) {
      return;
    }

    const { id, offsetX, offsetY } = JSON.parse(draggableData);
    const draggable = document.getElementById(id);
    if (!draggable) {
      return;
    }

    event.preventDefault();

    const { clientX: x, clientY: y } = event;
    draggable.style.left = `${x - offsetX}px`;
    draggable.style.top = `${y - offsetY}px`;
    events.dispatchEvent(new Event(eventTypes.shapeDrop));
  });
}
