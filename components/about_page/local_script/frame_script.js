
import { SVG } from "https://cdn.skypack.dev/@svgdotjs/svg.js";
// Doc : https://svgjs.dev/docs/3.0/
import {
  random,
  seedPRNG
} from "https://cdn.skypack.dev/@georgedoescode/generative-utils";

let cell_1 = (colors, strokeWidth) => {
  return `<circle cx="50" cy="50" r="9.44" fill='${colors[0]}' fill-rule="evenodd"/>`;
};

let cell_2 = (colors, strokeWidth) => {
  return `<line x1="25" x2="75" y1="25" y2="25" stroke="${colors[0]}" stroke-width="${strokeWidth}"/><line x1="25" x2="75" y1="50" y2="50" stroke="${colors[0]}" stroke-width="${strokeWidth}"/><line x1="25" x2="75" y1="75" y2="75" stroke="${colors[0]}" stroke-width="${strokeWidth}"/>`;
};

let cell_3 = (colors, strokeWidth) => {
  return `<line x1="25" x2="75" y1="25" y2="75" stroke="${colors[0]}" stroke-width="${strokeWidth}"/><line x1="25" x2="75" y1="75" y2="25" stroke="${colors[0]}" stroke-width="${strokeWidth}"/>`;
};

let cell_4 = (colors, strokeWidth) => {
  return `<rect width="50" height="50" x="25" y="25" fill="none" stroke="${colors[0]}" stroke-width="${strokeWidth}"/>`;
};

let cell_5 = (colors, strokeWidth) => {
  return `<line x1="25" x2="75" y1="75" y2="25" fill="none" stroke="${colors[0]}" stroke-width="${strokeWidth}"/>`;
};

let cell_6 = (colors) => {
  return ``;
};

let cell_7 = (colors, strokeWidth) => {
  return `<rect width="75" height="75" x="12.5" y="12.5" fill="rgba(255, 255, 255, 0.1)" />`;
};

// Class

class Generator {
  constructor(svg) {
    this.svg = svg;
    this.container = svg.group();
    this.cellSize = 50;
    this.borderSize = 0;
    this.width = 500;
    this.height = 1500;
    this.scale = 0.5;
    this.backgroundColor = "rgba(0, 0, 0, 0)";
    // this.fillOpacity = "0";
    this.strokeWidth = 10;
    this.colors = ["rgba(255, 255, 255, 0.1)"];
    this.shapes = [
      { shape: cell_1, weight: 1 },
      { shape: cell_2, weight: 1 },
      { shape: cell_3, weight: 1 },
      { shape: cell_4, weight: 3 },
      { shape: cell_5, weight: 1 },
      { shape: cell_6, weight: 1 },
      { shape: cell_7, weight: 5 }
    ];
    this.pickShape = this.createWeightedSelector(this.shapes);
    this.seed = 1;
  }

  createWeightedSelector(items) {
    const weightedArray = [];

    for (const item of items) {
      for (let i = 0; i < item.weight; i++) {
        weightedArray.push(item);
      }
    }

    return function () {
      return weightedArray[Math.floor(random(0, 1) * weightedArray.length)];
    };
  }

renderCell(area) {
    const shapeChoice = this.pickShape().shape;

    this.container.add(
      SVG(
        `<g transform="translate(${area.x} ${area.y})"><g transform="scale(${
          this.scale
        })" >${shapeChoice(this.colors, this.strokeWidth)}</g></g>`
      )
    );
    this.container.add(
      SVG(
        `<g transform="translate(${this.width - this.cellSize - area.x} ${
          area.y
        })"><g transform="scale(${this.scale})" >${shapeChoice(
          this.colors,
          this.strokeWidth
        )}</g></g>`
      )
    );
  }

  render() {
    seedPRNG(this.seed);
    this.container.remove();
    this.container = this.svg.group();
    this.container
      .rect(this.width, this.height)
      .attr({ fill: this.backgroundColor });
    for (var x = this.borderSize; x < this.width / 2; x += this.cellSize) {
      for (var y = this.borderSize; y < this.height - this.borderSize; y += this.cellSize) {
        this.renderCell({ x: x, y: y });
      }
    }
  }
}

// Instantiate
let svgElem = SVG().viewbox(0, 0, 500, 1500).addTo("#frame").attr("id", "svg");
let generator = new Generator(svgElem);

let counter = 0;

window.addEventListener('scroll', updateGrid);
generator.render();

function updateGrid(){
    counter = (counter + 1) % 1000;

    if (counter % 7 == 0) {
        generator.seed = counter;
        generator.render();
    }
}