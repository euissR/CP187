import * as Plot from "npm:@observablehq/plot";
import * as d3 from "npm:d3";

export function slopeTimer2(data, { width } = {}) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  // Create container for the plot
  const container = d3
    .create("div")
    .style("width", "100%")
    .style("font-family", "sans-serif");

  // Range values to cycle through
  // const ranges = ["low", "low-mid", "mid", "high"];
  const ranges = ["high", "mid", "low-mid", "low"];
  let currentRangeIndex = 0;
  let timer;

  // Color scale matching your R plot
  const colorScale = d3
    .scaleLinear()
    .domain([-32, -20, -10, 0, 8, 32])
    .range(["#df3144", "#ffde75", "grey90", "#64C2C7", "#376882", "#376882"])
    .interpolate(d3.interpolateRgb);

  function createPlot(range, currentLabel) {
    // Calculate values for diff range
    const min =
      range === "low"
        ? -100
        : range === "low-mid"
        ? -20
        : range === "mid"
        ? -10
        : range === "high"
        ? 0
        : 15;
    const max =
      range === "low"
        ? -20
        : range === "low-mid"
        ? -10
        : range === "mid"
        ? 0
        : range === "high"
        ? 20
        : -100;

    // console.log(`Current range: ${range}, min: ${min}, max: ${max}`);

    const slopeData = data
      .map((d) => ({
        country: d.Country,
        value2024: +d.value - d.diff,
        value2025: +d.value,
        diff: +d.diff,
      }))
      .sort((a, b) => b.value2025 - a.value2025);

    const plot = Plot.plot({
      width: vw / 3,
      height: vh * 0.8,
      marginTop: 40,
      marginBottom: 40,
      title: "Change in views on the United States",
      subtitle: "Selected countries, 2024-2025",
      caption: "Data: PEW, 2025",
      x: {
        domain: ["2024", "2025"],
        tickSize: 0,
        axis: "top",
        label: null,
      },
      y: {
        grid: true,
        ticks: [10, 20, 30, 40, 50, 60, 70, 80, 90],
        domain: [10, 90],
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
        Plot.link(slopeData, {
          x1: (d) => "2024",
          x2: (d) => "2025",
          y1: "value2024",
          y2: "value2025",
          stroke: "diff",
          strokeWidth: 1,
          strokeOpacity: 0.5,
        }),

        // 2025 points
        Plot.dot(slopeData, {
          x: () => "2025",
          y: "value2025",
          fill: "diff",
          stroke: "white",
          strokeWidth: 1,
          opacity: 0.5,
          r: 3,
          tip: true,
          title: (d) => `${d.country}`,
        }),

        // highlights
        Plot.link(
          slopeData.filter((d) => d.diff < max && d.diff > min),
          {
            x1: (d) => "2024",
            x2: (d) => "2025",
            y1: "value2024",
            y2: "value2025",
            stroke: "diff",
            strokeWidth: 3,
          }
        ),
        Plot.dot(
          slopeData.filter((d) => d.diff < max && d.diff > min),
          {
            x: () => "2025",
            y: "value2025",
            fill: "diff",
            stroke: "white",
            strokeWidth: 1,
            r: 6,
            tip: true,
            title: (d) => `${d.country}`,
          }
        ),
        Plot.text(
          slopeData.filter((d) => d.diff < max && d.diff > min),
          {
            x: () => "2025",
            y: (d) =>
              d.country === "Australia" ? d.value2025 - 1 : d.value2025,
            text: "country",
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

  function updatePlot() {
    // Clear existing plot
    container.selectAll("*").remove();

    // Get current range
    const currentRange = ranges[currentRangeIndex];
    const currentLabel =
      ranges[currentRangeIndex] === "low"
        ? "Very negative"
        : ranges[currentRangeIndex] === "low-mid"
        ? "Negative"
        : ranges[currentRangeIndex] === "mid"
        ? "Mildly negative"
        : "Positive";

    // Create new plot
    const plot = createPlot(currentRange, currentLabel);
    container.node().appendChild(plot);

    // Move to next range
    currentRangeIndex = (currentRangeIndex + 1) % ranges.length;
  }

  function startTimer() {
    // Initial plot
    updatePlot();

    // Set up timer to update every 10 seconds
    timer = setInterval(updatePlot, 5000);
  }

  function stopTimer() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  // Start the timer immediately
  startTimer();

  // Clean up timer when the container is removed from DOM
  // This prevents memory leaks
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.removedNodes.forEach((node) => {
        if (node.contains && node.contains(container.node())) {
          stopTimer();
          observer.disconnect();
        }
      });
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });

  return container.node();
}
