import * as Plot from "npm:@observablehq/plot";
import * as d3 from "npm:d3";

export function slope(data, subtitle, { width } = {}) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  // Color scale matching your R plot
  const colorScale = d3
    .scaleLinear()
    .domain([-32, -20, -10, 0, 8, 32])
    .range(["#df3144", "#ffde75", "grey90", "#64C2C7", "#376882", "#376882"])
    .interpolate(d3.interpolateRgb);

  const min = d3.min(data, (d) => d.value);
  const max = d3.max(data, (d) => d.value);

  const plot = Plot.plot({
    width: vw / 3,
    height: vh * 0.75,
    marginTop: 50,
    marginBottom: 40,
    title: "Change in views on the United States",
    subtitle: subtitle,
    caption: "Data: PEW, 2025",
    x: {
      domain: [2023.5, 2025.5],
      ticks: [2024, 2025],
      tickFormat: [],
      tickSize: 0,
      axis: "top",
      label: null,
    },
    y: {
      grid: true,
      // ticks: [10, 20, 30, 40, 50, 60, 70, 80, 90],
      domain: [min - 5, max + 5],
    },
    color: {
      type: "linear",
      domain: [-32, 32],
      range: ["#df3144", "#ffde75", "#eee", "#64C2C7", "#376882"],
      legend: true,
      label: "Change 2024-2025, %-points",
    },
    marks: [
      // Lines connecting 2024 to 2025
      Plot.line(data, {
        x: "year",
        y: "value",
        z: "Country",
        stroke: "diff",
        strokeWidth: 3,
        strokeOpacity: 1,
      }),

      // 2025 points
      Plot.dot(
        data.filter((d) => d.year == "2025"),
        {
          x: "year",
          y: "value",
          fill: "diff",
          stroke: "white",
          // strokeWidth: 1,
          // opacity: 0.5,
          r: 6,
          tip: true,
          title: (d) => `${d.Country}`,
        }
      ),

      Plot.text(
        data.filter((d) => d.year == "2025"),
        {
          x: "year",
          y: (d) =>
            d.Country == "South Africa"
              ? d.value - 1.5
              : d.Country == "Australia"
              ? d.value - 1.5
              : d.Country == "Kenya"
              ? d.value + 0.5
              : d.Country == "Brazil"
              ? d.value + 0.5
              : d.Country == "India"
              ? d.value - 0.5
              : d.value,
          text: "Country",
          textAnchor: "start",
          fontWeight: "bold",
          dx: 10,
          fontSize: 12,
          fill: "#333",
        }
      ),
    ],
  });
  return plot;
}
