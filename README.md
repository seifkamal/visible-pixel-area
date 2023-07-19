# Visible Pixel Area Tech Demo

See brief [here](./brief.pdf).

## Running Locally

```shell
npm install
npm run start
```

## Approach

**TLDR;** On blue shape interactions, capture an image of the DOM, then count
the number of red pixels in the image.

I've written some notes below on my thought process and decisions. Read on for
the _why_'s and _what if_'s. The theme here is pretty much
[KISS](https://en.wikipedia.org/wiki/KISS_principle).

### Architecture

The scene set for this task is quite minimal, so I've opted to keep this theme.

The app is a static, vanilla JS site without a build step. I separated the
functionality into module functions to make it more readable, but decided not to
abstract it any further (eg. using web components).

### Functionality

For the blue shapes, the story is pretty straightforward:

1. Drag and drop them to a new location on the screen;
2. Click on one to toggle between a circle and a square.

For the former, we can use the
[Drag and Drop API](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API),
and for the latter, an `onclick` handler that toggles an attribute to be used
for styling.

The red shape is where it gets tricky. I thought about using the
[Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API),
but that wouldn't account for:

1. The blue shapes overlapping;
2. The blue shapes when toggled into circles.

It would also make the dragging and dropping slightly more complex since the
blue shapes would have to be descendants of the red one.

So I decided to count the number of red pixels on the screen (is that cheeky?).
I do this by drawing the DOM onto a canvas using the
[html2canvas](https://html2canvas.hertzen.com/) library, then getting the pixel
data from the canvas and checking it for red pixels.

### Limitations

I found this technique to be simpler than the alternatives, and appropriate for
the sake of this demo. It's not without its trade-offs though, so here are some
more thoughts.

#### Variable Colors

The biggest limitation is that the pixel value to count (red) is hardcoded.

So if the big shape's color is changed, the code would need to change. This
could easily be addressed by dynamically getting the computed color of the
element before counting the pixels.

BUT...

If the big shape's background had multiple colors (eg. if it was some image), it
would be a problem. One way we could alter our approach to handle this would be
to take an initial snapshot of just the target element (the big shape), and then
compare each pixel's corresponding value on subsequent snapshots.

#### Performance

We could improve the performance of this approach by offloading the pixel work
to a
[Web Worker](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API).

Again, I've chosen to optimise for readability and keep it simple.

#### Responsiveness

The shapes don't cater to different screen sizes nor do they respond to
resizing.

From the brief, I presumed that the subject here was problem solving and
lower-level browser knowledge, so I left it there.

If this was a requirement, we could use a media or container query to switch to
a vertical layout -- maybe place the red shape on top and the blue ones below --
and listen to the window's `resize` event to refresh the pixel count.

### Testing

There isn't a whole lot of bespoke logic here, it's mainly stitching some APIs
together. So again, I kept it simple.

In a production setting I would test this, maybe using something like
[Puppeteer](https://pptr.dev/).
