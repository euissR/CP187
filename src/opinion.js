import * as Plot from "npm:@observablehq/plot";
import * as d3 from "npm:d3";

export function opinion(
  opEurope,
  opWorld,
  coastlineData,
  { width = 1000 } = {}
) {
  console.log("Received width:", width);
  console.log("Window width:", window.innerWidth);
  // Create container
  const container = d3
    .create("div")
    .style("width", "100%")
    .style("font-family", "sans-serif");

  // Add toggle controls
  const controls = container
    .append("div")
    .style("text-align", "center")
    .style("margin-bottom", "20px");

  const toggleContainer = controls
    .append("div")
    .style("display", "inline-flex")
    .style("background", "#f0f0f0")
    .style("border-radius", "25px")
    .style("padding", "4px")
    .style("box-shadow", "0 2px 8px rgba(0,0,0,0.1)");

  const europeButton = toggleContainer
    .append("button")
    .style("background", "#309ebe")
    .style("color", "white")
    .style("border", "none")
    .style("padding", "10px 20px")
    .style("border-radius", "20px")
    .style("cursor", "pointer")
    .style("font-size", "14px")
    .style("font-weight", "600")
    .style("transition", "all 0.3s ease")
    .style("margin-right", "4px")
    .text("Europe");

  const worldButton = toggleContainer
    .append("button")
    .style("background", "transparent")
    .style("color", "#666")
    .style("border", "none")
    .style("padding", "10px 20px")
    .style("border-radius", "20px")
    .style("cursor", "pointer")
    .style("font-size", "14px")
    .style("font-weight", "600")
    .style("transition", "all 0.3s ease")
    .style("margin-right", "4px")
    .text("World");

  const slopeButton = toggleContainer
    .append("button")
    .style("background", "transparent")
    .style("color", "#666")
    .style("border", "none")
    .style("padding", "10px 20px")
    .style("border-radius", "20px")
    .style("cursor", "pointer")
    .style("font-size", "14px")
    .style("font-weight", "600")
    .style("transition", "all 0.3s ease")
    .text("Slope Chart");

  // Chart container
  const chartContainer = container.append("div").style("width", "100%");
  // .style("text-align", "center");

  // Current view state
  let currentView = "europe";
  let chartType = "map"; // "map" or "slope"

  // Color scale matching your R plot
  const colorScale = d3
    .scaleLinear()
    .domain([-32, -20, -10, 0, 8, 32])
    .range(["#df3144", "#ffde75", "grey90", "#64C2C7", "#376882", "#376882"]) // Added extra #376882 for values > 8
    .interpolate(d3.interpolateRgb);

  function updateChart(data) {
    // Clear existing chart
    chartContainer.selectAll("*").remove();

    // Add title
    const title = chartContainer.append("div").style("margin-bottom", "10px");

    title
      .append("h3")
      .style("width", "100%")
      .style("margin", "0 0 5px 0")
      .style("font-size", "18px")
      .style("font-weight", "600")
      .text("Transatlantic rupture?");

    const subtitle = title
      .append("p")
      .style("margin", "0")
      .style("font-size", "14px")
      .style("color", "#666");

    if (chartType === "slope") {
      subtitle.text("Change in favorable view of the United States, 2024-2025");
      updateSlopeChart(data);
    } else {
      if (currentView === "europe") {
        subtitle.text(
          "Share of citizens who have a favourable view of \nthe United States, for selected European countries"
        );
      } else {
        subtitle.text(
          "Share of citizens who have a favourable view of \nthe United States, for selected countries"
        );
      }
      updateMap(data);
    }
  }

  function updateMap(data) {
    // Create the plot with full world extent and equal-earth projection
    const plot = Plot.plot({
      width: width,
      height: 500,
      projection: {
        type: "equal-earth",
        domain: { type: "Sphere" }, // Full world extent
      },
      color: {
        type: "linear",
        domain: [-32, 32],
        range: ["#df3144", "#ffde75", "#eee", "#64C2C7", "#376882"],
        label: "Change 2024-2025 in %points",
        legend: true,
        tickFormat: (d) => (d > 0 ? `+${d}` : `${d}`),
        ticks: [-32, -20, -10, 0, 8],
      },
      marks: [
        // Coastline background
        Plot.geo(coastlineData, {
          fill: "none",
          stroke: "#ccc",
          strokeWidth: 0.25,
        }),
        // Country fills based on diff values
        Plot.geo(data, {
          fill: "diff",
          //   stroke: "#fff",
          //   strokeWidth: 0.8,
          tip: true,
          title: (d) =>
            `${d.properties.Country}\nChange: ${
              d.properties.diff > 0 ? "+" : ""
            }${d.properties.diff}%pts\nCurrent: ${d.properties.value}%`,
        }),
      ],
    });

    chartContainer.node().appendChild(plot);

    // Add legend explanation
    const legendNote = chartContainer
      .append("div")
      .style("margin-top", "15px")
      .style("font-size", "12px")
      .style("color", "#666")
      .style("font-style", "italic");

    legendNote.text("Hover over countries for detailed information");
  }

  function updateSlopeChart(data) {
    // Prepare data for slope chart
    const slopeData = data.features
      .map((d) => ({
        country: d.properties.Country,
        value2024: d.properties.value - d.properties.diff,
        value2025: d.properties.value,
        diff: d.properties.diff,
      }))
      .sort((a, b) => b.value2025 - a.value2025);

    const plot = Plot.plot({
      width: width,
      height: 600,
      marginLeft: width / 4,
      marginRight: width / 4,
      marginTop: 40,
      marginBottom: 40,
      x: {
        domain: ["2024", "2025"],
        tickSize: 0,
        axis: "top",
        label: null,
      },
      y: {
        domain: [
          0,
          Math.max(
            ...slopeData.map((d) => Math.max(d.value2024, d.value2025))
          ) + 5,
        ],
        label: "Favorable view (%)",
        grid: true,
      },
      color: {
        type: "linear",
        domain: [-32, 32],
        range: ["#df3144", "#ffde75", "#eee", "#64C2C7", "#376882"],
        legend: true,
        label: "Change 2024-2025 in %points",
      },
      marks: [
        // Lines connecting 2024 to 2025
        Plot.line(
          slopeData.flatMap((d) => [
            { x: "2024", y: d.value2024, country: d.country, diff: d.diff },
            { x: "2025", y: d.value2025, country: d.country, diff: d.diff },
          ]),
          {
            x: "x",
            y: "y",
            z: "country",
            stroke: "diff",
            strokeWidth: 2,
            tip: true,
            title: (d) => `${d.country}\n${d.x}: ${Math.round(d.y)}%`,
          }
        ),

        // 2024 points
        Plot.dot(slopeData, {
          x: () => "2024",
          y: "value2024",
          fill: "diff",
          stroke: "white",
          strokeWidth: 1,
          r: 4,
        }),

        // 2025 points
        Plot.dot(slopeData, {
          x: () => "2025",
          y: "value2025",
          fill: "diff",
          stroke: "white",
          strokeWidth: 1,
          r: 4,
        }),

        // Country labels on the right
        Plot.text(slopeData, {
          x: () => "2025",
          y: "value2025",
          text: "country",
          textAnchor: "start",
          dx: 10,
          fontSize: 11,
          fill: "#333",
        }),
      ],
    });

    chartContainer.node().appendChild(plot);
  }

  function updateButtons(activeView, activeChart) {
    // Reset all buttons
    europeButton.style("background", "transparent").style("color", "#666");
    worldButton.style("background", "transparent").style("color", "#666");
    slopeButton.style("background", "transparent").style("color", "#666");

    // Highlight active button
    if (activeChart === "slope") {
      slopeButton.style("background", "#309ebe").style("color", "white");
    } else if (activeView === "europe") {
      europeButton.style("background", "#309ebe").style("color", "white");
    } else {
      worldButton.style("background", "#309ebe").style("color", "white");
    }
  }

  // Event handlers
  europeButton.on("click", function () {
    if (currentView !== "europe" || chartType !== "map") {
      currentView = "europe";
      chartType = "map";
      updateButtons("europe", "map");
      updateChart(opEurope);
    }
  });

  worldButton.on("click", function () {
    if (currentView !== "world" || chartType !== "map") {
      currentView = "world";
      chartType = "map";
      updateButtons("world", "map");
      updateChart(opWorld);
    }
  });

  slopeButton.on("click", function () {
    if (chartType !== "slope") {
      chartType = "slope";
      updateButtons(currentView, "slope");
      // Use current data (Europe or World based on last selection)
      updateChart(currentView === "europe" ? opEurope : opWorld);
    }
  });

  // Initialize with Europe view
  updateChart(opEurope);

  return container.node();
}
