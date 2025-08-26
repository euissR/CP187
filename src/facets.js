import * as Plot from "npm:@observablehq/plot";
import * as d3 from "npm:d3";

export function facets(data, { width } = {}) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  // console.log("Creating facets plot with data:", data); // Color scale matching your R plot
  const colorScale = d3
    .scaleLinear()
    .domain([-32, -20, -10, 0, 8, 32])
    .range(["#df3144", "#ffde75", "grey90", "#64C2C7", "#376882", "#376882"]) // Added extra #376882 for values > 8
    .interpolate(d3.interpolateRgb);

  const plot = Plot.plot({
    width: vw,
    height: vh,
    x: { ticks: [], label: null },
    y: { ticks: [], label: null },
    fy: { label: null },
    fx: { label: null },
    title: "Transatlantic rupture?",
    subtitle:
      "Share of citizens who have a favourable view of \nthe United States, for selected European countries",
    caption: "Data: PEW, 2025",
    color: {
      type: "linear",
      domain: [5, 95],
      range: ["#df3144", "#ffde75", "#eee", "#64C2C7", "#376882"],
      label: "%",
      legend: true,
      ticks: [25, 50, 75],
    },
    marks: [
      // Country fills based on diff values
      // Plot.geo(data, {
      //   fill: "value",
      //   fx: "facet",
      //   fy: "Country",
      //   tip: true,
      //   title: (d) => `${d.Country}\n: ${d.value}%`,
      // }),
      Plot.areaX(data, {
        x: "lon_zero",
        y: "lat_zero",
        z: "group", // Group individual polygons
        fill: "value",
        stroke: "white",
        strokeWidth: 0.5,
        fx: "facet",
        fy: "Country",
        curve: "linear-closed", // Closes the polygon
      }),
    ],
  });
  return plot;
}
