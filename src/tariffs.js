import * as Plot from "npm:@observablehq/plot";
import * as d3 from "npm:d3";

export function tariffs(
  longData,
  shortData,
  { width = 1000, animationDuration = 3000 } = {}
) {
  // Process the data
  const processedLongData = longData.map((d) => ({
    date: new Date(d.date, 0, 1), // Convert year to date
    value: +d.value,
  }));

  const processedShortData = shortData.map((d) => ({
    date: new Date(d.date),
    value: +d.value,
  }));

  // Get data extents
  const longExtent = d3.extent(processedLongData, (d) => d.date);
  const shortExtent = d3.extent(processedShortData, (d) => d.date);
  const maxValue = Math.max(
    d3.max(processedLongData, (d) => d.value),
    d3.max(processedShortData, (d) => d.value)
  );

  // Create container
  const container = d3
    .create("div")
    .style("width", "100%")
    .style("display", "flex")
    .style("gap", "20px");

  // Chart dimensions
  const longChartWidth = (width * 2) / 3;
  const shortChartWidth = width / 3;
  const chartHeight = 400;

  // Create long-term chart container
  const longContainer = container
    .append("div")
    .style("flex", "2")
    .style("position", "relative");

  // Create short-term chart container
  const shortContainer = container
    .append("div")
    .style("flex", "1")
    .style("position", "relative");

  // Add titles
  //   longContainer
  //     .append("h3")
  //     .style("margin", "0 0 5px 0")
  //     .style("font-size", "18px")
  //     .style("font-weight", "600")
  //     .text("US average effective tariff rate");

  longContainer
    .append("p")
    .style("margin", "0 0 20px 0")
    .style("font-size", "14px")
    .style("color", "#666")
    .text("Since 1790");

  //   shortContainer
  //     .append("h3")
  //     .style("margin", "0 0 5px 0")
  //     .style("font-size", "18px")
  //     .style("font-weight", "600")
  //     // .style("visibility", "hidden") // Invisible placeholder
  //     .text(" ");

  // Animation state
  let longAnimationProgress = 0;
  let shortAnimationProgress = 0;
  let isAnimating = false;

  function updateLongChart(progress) {
    const dataLength = processedLongData.length;
    const currentIndex = Math.floor(progress * dataLength);
    const currentData = processedLongData.slice(0, currentIndex + 1);

    if (currentData.length === 0) return;

    // Create breaks for x-axis
    const minYear = longExtent[0].getFullYear();
    const maxYear = longExtent[1].getFullYear();
    const breaks = [minYear, 1850, 1900, 1950, 2000, maxYear]
      .filter((year) => year >= minYear && year <= maxYear)
      .map((year) => new Date(year, 0, 1));

    const plot = Plot.plot({
      width: longChartWidth,
      height: chartHeight,
      marginLeft: 60,
      marginRight: 20,
      marginTop: 20,
      marginBottom: 40,
      x: {
        domain: longExtent,
        ticks: breaks,
        tickFormat: (d) => d.getFullYear().toString(), // Convert to string to avoid commas
        grid: false,
      },
      y: {
        domain: [0, maxValue],
        grid: true,
        gridColor: "#e0e0e0",
        gridOpacity: 0.7,
      },
      marks: [
        Plot.line(currentData, {
          x: "date",
          y: "value",
          stroke: "#999",
          strokeWidth: 1,
        }),
        // Highlight recent data (from 2024)
        Plot.line(
          currentData.filter((d) => d.date.getFullYear() >= 2024),
          {
            x: "date",
            y: "value",
            stroke: "#309ebe",
            strokeWidth: 2,
          }
        ),
        // Add 2025 label if we have 2025 data
        Plot.text(
          currentData.filter((d) => d.date.getFullYear() >= 2025),
          {
            x: "date",
            y: "value",
            text: "2025",
            dy: -10,
            fill: "#309ebe",
            fontSize: 12,
            fontWeight: "bold",
          }
        ),
      ],
    });

    // Replace existing chart
    longContainer.select(".chart").remove();
    longContainer.append("div").attr("class", "chart").node().appendChild(plot);
  }

  function updateShortChart(progress) {
    const dataLength = processedShortData.length;
    const currentIndex = Math.floor(progress * dataLength);
    const currentData = processedShortData.slice(0, currentIndex + 1);

    if (currentData.length === 0) return;

    // Add title only once when short chart starts
    if (!shortContainer.select(".short-title").node()) {
      shortContainer
        .append("p")
        .attr("class", "short-title")
        .style("margin", "0 0 20px 0")
        .style("font-size", "14px")
        .style("color", "#666")
        .text("In 2025");
    }

    const plot = Plot.plot({
      width: shortChartWidth,
      height: chartHeight,
      marginLeft: 60,
      marginRight: 20,
      marginTop: 20,
      marginBottom: 40,
      x: {
        domain: shortExtent,
        ticks: d3.timeMonth.every(1), // Show every month
        tickFormat: d3.timeFormat("%b"),
        grid: false,
      },
      y: {
        domain: [0, maxValue],
        grid: true,
        gridColor: "#e0e0e0",
        gridOpacity: 0.7,
      },
      marks: [
        Plot.line(currentData, {
          x: "date",
          y: "value",
          stroke: "#309ebe",
          strokeWidth: 2,
        }),
      ],
    });

    // Replace existing chart
    shortContainer.select(".chart").remove();
    shortContainer
      .append("div")
      .attr("class", "chart")
      .node()
      .appendChild(plot);
  }

  function animate() {
    if (isAnimating) return;
    isAnimating = true;

    const startTime = Date.now();

    function step() {
      const elapsed = Date.now() - startTime;
      const totalProgress = Math.min(elapsed / animationDuration, 1);

      // Long chart animates first (0 to 0.7 of total time)
      if (totalProgress <= 0.7) {
        longAnimationProgress = totalProgress / 0.7;
        updateLongChart(longAnimationProgress);
      } else if (totalProgress <= 0.8) {
        // Pause period (0.6 to 0.8 = 0.2 of total time = 1/5 of animationDuration)
        if (longAnimationProgress < 1) {
          longAnimationProgress = 1;
          updateLongChart(longAnimationProgress);
        }
        // Do nothing during pause
      } else {
        // Ensure long chart is complete
        if (longAnimationProgress < 1) {
          longAnimationProgress = 1;
          updateLongChart(longAnimationProgress);
        }

        // Short chart animates after pause (0.8 to 1.0 of total time)
        shortAnimationProgress = (totalProgress - 0.8) / 0.2;
        updateShortChart(shortAnimationProgress);
      }

      if (totalProgress < 1) {
        requestAnimationFrame(step);
      } else {
        isAnimating = false;
        // Add caption after animation completes
        if (!longContainer.select(".caption").node()) {
          longContainer
            .append("p")
            .attr("class", "caption")
            .style("margin", "20px 0 0 0")
            .style("font-size", "10px")
            .style("color", "#666")
            .style("line-height", "1.3")
            .text(
              "Data: Historical Statistics of the United States Ea424-434, Monthly Treasury Statement, Bureau of Economic Analysis, The Budget Lab analysis. Federal Reserve bank of Minneapolis, 2025"
            );
        }
      }
    }

    requestAnimationFrame(step);
  }

  // Start animation after a brief delay
  setTimeout(animate, 500);

  return container.node();
}
