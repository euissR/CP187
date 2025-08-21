import * as Plot from "npm:@observablehq/plot";
import * as d3 from "npm:d3";

export function tariffsEU(data, { width = 1000 } = {}) {
  // First, parse all the data with proper types
  const parsedData = data.map((d) => ({
    date: new Date(d.date),
    value: +d.value,
    note: d.note,
    type: d.type,
  }));

  // Then filter into four arrays
  const baseline = parsedData
    .filter((d) => d.type === "baseline")
    .sort((a, b) => a.date - b.date);
  const threat = parsedData
    .filter((d) => d.type === "threat")
    .sort((a, b) => a.date - b.date);
  const steel = parsedData
    .filter((d) => d.type === "steel")
    .sort((a, b) => a.date - b.date);
  const cars = parsedData
    .filter((d) => d.type === "cars")
    .sort((a, b) => a.date - b.date);

  // Get overall extent for consistent scaling
  const allData = parsedData;
  const dateExtent = d3.extent(allData, (d) => d.date);
  const maxValue = d3.max(allData, (d) => d.value);

  // Calculate legend data: get the last data point for each type
  const parsedDataNothreat = parsedData.filter((d) => d.type !== "threat");
  const legendData = Array.from(
    d3.group(parsedDataNothreat, (d) => d.type),
    ([type, values]) => {
      const maxDate = d3.max(values, (d) => d.date);
      const lastPoint = values.find(
        (d) => d.date.getTime() === maxDate.getTime()
      );
      return {
        x: lastPoint.date,
        y: lastPoint.value,
        text: type.charAt(0).toUpperCase() + type.slice(1),
        color:
          type === "baseline"
            ? "#666"
            : type === "steel"
            ? "#309ebe"
            : "#376882",
      };
    }
  );

  // Add baseline legend positioned at specified coordinates
  const baselineLegend = {
    x: new Date("2025-03-01"),
    y: 7,
    text: "Baseline",
    color: "#666",
  };

  const legend = legendData.filter((d) => d.text !== "Baseline");

  // Create container for the animated plot
  const container = d3
    .create("div")
    .style("width", "100%")
    .style("font-family", "sans-serif");

  // Animation state
  let currentThreatIndex = 0;
  let currentBaselineIndex = 0;
  let animationPhase = "baseline"; // "baseline", "threat", "steel-cars", "pause"
  let isAnimating = false;
  let threatTimeout;

  function getCurrentBaselineData() {
    const currentThreatDate = threat[currentThreatIndex]?.date;
    if (!currentThreatDate) return baseline;

    return baseline.filter((d) => d.date <= currentThreatDate);
  }

  function updatePlot(
    showSteel = false,
    showCars = false,
    currentThreatVisible = false,
    showThreatText = false
  ) {
    // Clear existing plot
    container.selectAll("*").remove();

    const currentBaseline = getCurrentBaselineData();
    const currentThreats = threat.slice(
      0,
      currentThreatIndex + (currentThreatVisible ? 1 : 0)
    );
    const visibleThreatText =
      currentThreatVisible && showThreatText
        ? threat
            .slice(currentThreatIndex, currentThreatIndex + 1)
            .filter((d) => d.note && d.note !== "NA")
        : [];

    const plot = Plot.plot({
      width: width,
      height: width * 0.45,
      title: "US tariffs on the EU in 2025",
      subtitle: "%",
      caption:
        "Data: Historical Statistics of the United States Ea424-434, Monthly Treasury Statement, Bureau of Economic Analysis, The Budget Lab analysis. Federal Reserve bank of Minneapolis, 2025",
      marginLeft: 60,
      marginRight: 100,
      marginTop: 60,
      marginBottom: 60,
      x: {
        domain: dateExtent,
        type: "time",
        tickFormat: d3.timeFormat("%b %Y"),
        grid: false,
        label: null,
      },
      y: {
        domain: [0, maxValue + 5],
        grid: true,
        gridColor: "#e0e0e0",
        gridOpacity: 0.7,
        label: null,
      },
      marks: [
        // Baseline area
        ...(currentBaseline.length > 0
          ? [
              Plot.areaY(currentBaseline, {
                x: "date",
                y: "value",
                fill: "#aaa",
                fillOpacity: 0.7,
              }),
            ]
          : []),

        // Steel line (if visible)
        ...(showSteel
          ? [
              Plot.line(steel, {
                x: "date",
                y: "value",
                stroke: "#309ebe",
                strokeWidth: 3,
              }),
            ]
          : []),

        // Cars line (if visible)
        ...(showCars
          ? [
              Plot.line(cars, {
                x: "date",
                y: "value",
                stroke: "#376882",
                strokeWidth: 3,
              }),
            ]
          : []),

        // Threat points
        ...(currentThreats.length > 0
          ? [
              Plot.dot(currentThreats, {
                x: "date",
                y: "value",
                fill: "#df3144",
                stroke: "white",
                strokeWidth: 2,
                r: 6,
              }),
            ]
          : []),

        // Threat text labels (only current one if visible) - DOUBLED SIZE
        ...(visibleThreatText.length > 0
          ? [
              Plot.text(visibleThreatText, {
                x: "date",
                y: "value",
                text: "note",
                dy: -15,
                fontSize: 20, // Doubled from 10 to 20
                fill: "#df3144",
                fontWeight: "bold",
                textAnchor: "middle",
                stroke: "white",
                strokeWidth: 3,
                paintOrder: "stroke",
              }),
            ]
          : []),

        // Baseline legend (show with first bit of baseline)
        ...(currentBaseline.length > 0
          ? [
              Plot.text([baselineLegend], {
                x: "x",
                y: "y",
                text: "text",
                fill: "color",
                fontSize: 12,
                fontWeight: "bold",
                textAnchor: "start",
                dx: 5,
              }),
            ]
          : []),

        // Legend (only when steel/cars are visible)
        ...(showSteel && showCars
          ? [
              Plot.text(legend, {
                x: "x",
                y: "y",
                text: "text",
                fill: "color",
                fontSize: 12,
                fontWeight: "bold",
                textAnchor: "start",
                dx: 5,
              }),
            ]
          : []),
      ],
    });

    container.node().appendChild(plot);
  }

  function animate() {
    if (isAnimating) return;
    isAnimating = true;

    function nextStep() {
      if (animationPhase === "baseline") {
        // Animate baseline to next threat
        updatePlot(false, false, false, false);

        setTimeout(() => {
          if (currentThreatIndex < threat.length) {
            animationPhase = "threat";
            nextStep();
          } else {
            // All threats done, show steel and cars
            animationPhase = "steel-cars";
            nextStep();
          }
        }, 1000);
      } else if (animationPhase === "threat") {
        // Show current threat dot and text
        updatePlot(false, false, true, true);

        // Hide text after 3 seconds but keep dot
        setTimeout(() => {
          updatePlot(false, false, true, false);

          // Move to next threat after brief pause
          setTimeout(() => {
            currentThreatIndex++;
            animationPhase = "baseline";
            nextStep();
          }, 500);
        }, 3000);
      } else if (animationPhase === "steel-cars") {
        // Show complete visualization with steel and cars
        updatePlot(true, true, true, false);

        // Stay for 5 seconds then loop
        setTimeout(() => {
          animationPhase = "pause";
          setTimeout(() => {
            // Reset and loop
            currentThreatIndex = 0;
            currentBaselineIndex = 0;
            animationPhase = "baseline";
            nextStep();
          }, 2000);
        }, 5000);
      }
    }

    nextStep();
  }

  // Start animation after brief delay
  setTimeout(() => {
    animate();
  }, 500);

  // Initial empty plot
  updatePlot(false, false, false, false);

  return container.node();
}
