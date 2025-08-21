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
  const baseline = parsedData.filter((d) => d.type === "baseline");
  const threat = parsedData.filter((d) => d.type === "threat");
  const steel = parsedData.filter((d) => d.type === "steel");
  const cars = parsedData.filter((d) => d.type === "cars");

  console.log("Parsed threat:", threat);

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
  console.log("Legend data:", legendData);

  const plot = Plot.plot({
    width: width,
    height: 500,
    title: "Rollercoaster?",
    subtitle: "US tariffs on the EU in 2025, %",
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
    color: {
      legend: true,
      range: ["#666", "#df3144", "#309ebe", "#376882"],
    },
    marks: [
      // Baseline as bars
      Plot.areaY(baseline, {
        x: "date",
        y: "value",
        fill: "#666",
        fillOpacity: 0.7,
        width: 10, // Adjust bar width as needed
        tip: true,
        title: (d) =>
          `Baseline: ${d.value}%\n${d3.timeFormat("%b %d, %Y")(d.date)}`,
      }),

      // Steel as line
      Plot.line(steel, {
        x: "date",
        y: "value",
        stroke: "#309ebe",
        strokeWidth: 3,
        // marker: "circle",
        tip: true,
        title: (d) =>
          `Steel: ${d.value}%\n${d3.timeFormat("%b %d, %Y")(d.date)}`,
      }),

      // Cars as line
      Plot.line(cars, {
        x: "date",
        y: "value",
        stroke: "#376882",
        strokeWidth: 3,
        // marker: "circle",
        tip: true,
        title: (d) =>
          `Cars: ${d.value}%\n${d3.timeFormat("%b %d, %Y")(d.date)}`,
      }),

      // Threat as points
      Plot.dot(threat, {
        x: "date",
        y: "value",
        fill: "#df3144",
        stroke: "white",
        strokeWidth: 2,
        r: 6,
        tip: true,
        title: (d) =>
          `Threat: ${d.value}%\n${d.note}\n${d3.timeFormat("%b %d, %Y")(
            d.date
          )}`,
      }),

      // Text labels for threat points
      Plot.text(
        threat.filter((d) => d.note && d.note !== "NA"),
        {
          x: "date",
          y: "value",
          text: "note",
          dy: -15, // Position above the points
          fontSize: 10,
          fill: "#df3144",
          fontWeight: "bold",
          textAnchor: "middle",
          // Add background for readability
          stroke: "white",
          strokeWidth: 3,
          paintOrder: "stroke",
        }
      ),

      // Add legend manually using text
      Plot.text(legendData, {
        x: "x",
        y: (d) => (d.text === "Baseline" ? d.y / 2 : d.y), // Adjust y position for visibility
        text: "text",
        fill: "color",
        fontSize: 12,
        fontWeight: "bold",
        textAnchor: "start",
        dx: 5,
      }),
    ],
  });

  return plot;
}
