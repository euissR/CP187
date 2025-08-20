import * as Plot from "npm:@observablehq/plot";
import * as d3 from "npm:d3";

export function slope(data, range, { width = 1000 } = {}) {
  // calculate values for diff range
  const min =
    range === "low" ? -100 : range === "mid" ? -20 : range === "high" ? 0 : 15;
  const max =
    range === "low" ? -20 : range === "mid" ? 0 : range === "high" ? 20 : -100;
  // Color scale matching your R plot
  const colorScale = d3
    .scaleLinear()
    .domain([-32, -20, -10, 0, 8, 32])
    .range(["#df3144", "#ffde75", "grey90", "#64C2C7", "#376882", "#376882"]) // Added extra #376882 for values > 8
    .interpolate(d3.interpolateRgb);

  console.log(data);

  const slopeData = data
    .map((d) => ({
      country: d.Country,
      value2024: +d.value - d.diff,
      value2025: +d.value,
      diff: +d.diff,
    }))
    .sort((a, b) => b.value2025 - a.value2025);
  console.log(slopeData);
  const plot = Plot.plot({
    width: width,
    height: 600,
    marginLeft: width / 4,
    marginRight: width / 4,
    marginTop: 40,
    marginBottom: 40,
    title: "America",
    subtitle: "Change in favorable view of the United States, 2024-2025",
    caption: "Data: PEW, 2025",
    x: {
      domain: ["2024", "2025"],
      tickSize: 0,
      axis: "top",
      label: null,
    },
    y: {
      //   domain: [
      //     0,
      //     Math.max(...slopeData.map((d) => Math.max(d.value2024, d.value2025))) +
      //       5,
      //   ],
      //   label: "Favorable view (%)",
      grid: true,
    },
    color: {
      type: "linear",
      domain: [-32, 32],
      range: ["#df3144", "#ffde75", "#eee", "#64C2C7", "#376882"],
      legend: true,
      label: "Favorable view, %",
    },
    marks: [
      // Lines connecting 2024 to 2025
      Plot.link(slopeData, {
        x1: (d) => "2024",
        x2: (d) => "2025",
        y1: "value2024",
        y2: "value2025",
        stroke: "diff",
        strokeWidth: 2,
      }),

      // 2024 points
      Plot.dot(slopeData, {
        x: () => "2024",
        y: "value2024",
        fill: "diff",
        stroke: "white",
        strokeWidth: 1,
        r: 4,
        tip: true,
        title: (d) => `${d.country}`,
      }),

      // 2025 points
      Plot.dot(slopeData, {
        x: () => "2025",
        y: "value2025",
        fill: "diff",
        stroke: "white",
        strokeWidth: 1,
        r: 4,
        tip: true,
        title: (d) => `${d.country}`,
      }),

      Plot.text(
        slopeData.filter((d) => d.diff < max && d.diff > min),
        {
          x: () => "2025",
          y: (d) => (d.country === "Australia" ? d.value2025 - 1 : d.value2025),
          text: "country",
          textAnchor: "start",
          //   fill: "diff",
          fontWeight: "bold",
          dx: 10,
          fontSize: 11,
          fill: "#333",
        }
      ),
    ],
  });

  return plot;
}
