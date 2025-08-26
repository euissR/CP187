import * as Plot from "npm:@observablehq/plot";
import * as d3 from "npm:d3";

export function maps(data, coast, { width } = {}) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  //   console.log("Creating facets plot with data:", data); // Color scale matching your R plot
  const colorScale = d3
    .scaleLinear()
    .domain([-32, -20, -10, 0, 8, 32])
    .range(["#df3144", "#ffde75", "grey90", "#64C2C7", "#376882", "#376882"]) // Added extra #376882 for values > 8
    .interpolate(d3.interpolateRgb);

  const radius = 27; // Adjust radius as needed
  const circle = d3.geoCircle().center([4, 32]).radius(radius)();

  function geoToPolygons(geoData) {
    // First pass: extract all coordinates with grouping
    const rawPolygons = geoData.features.flatMap((feature) => {
      let allCoordinates = [];

      if (feature.geometry.type === "Polygon") {
        allCoordinates = [feature.geometry.coordinates[0]];
      } else if (feature.geometry.type === "MultiPolygon") {
        allCoordinates = feature.geometry.coordinates.map(
          (polygon) => polygon[0]
        );
      } else {
        return [];
      }

      return allCoordinates.flatMap((coordinates, polygonIndex) => {
        return coordinates.map((coord, i) => ({
          ...feature.properties,
          lon: coord[0],
          lat: coord[1],
          facetGroup: `${feature.properties.Country}-${feature.properties.facet}`, // For min/max calculation
          group: `${feature.properties.Country}-${feature.properties.facet}-${polygonIndex}`,
          order: i,
        }));
      });
    });

    // Second pass: calculate min values for each country-year combination
    const minValues = d3.rollup(
      rawPolygons,
      (v) => ({
        minLon: d3.min(v, (d) => d.lon),
        minLat: d3.min(v, (d) => d.lat),
      }),
      (d) => d.facetGroup
    );

    // Third pass: normalize coordinates to start at (0,0)
    return rawPolygons.map((d) => {
      const mins = minValues.get(d.facetGroup);
      return {
        ...d,
        x: d.lon - mins.minLon, // lon_zero
        y: d.lat - mins.minLat, // lat_zero
      };
    });
  }

  const polygonData = geoToPolygons(data);
  console.log(
    "Polygon data:",
    polygonData.filter((d) => d.Country === "France" && d.year === 2016)
  ); // Log the processed polygon data

  const facetLabels = Array.from(
    new Set(
      polygonData.map((d) => `${d.facet}-${d.Country}-${d.year}-${d.president}`)
    )
  )
    .map((combo) => {
      const [facet, country, year, president] = combo.split("-");
      return { facet, Country: country, year, president };
    })
    .filter((d) => d.Country == "France");
  console.log("array:", facetLabels);

  const plot = Plot.plot({
    width: vw / 3.1,
    height: vw / 2.6,
    title: "US favourability drops",
    // title: "Transatlantic rupture?",
    subtitle:
      "Share of citizens who have a favourable view of \nthe United States, for selected European countries",
    caption: "Data: PEW, 2025",
    // facet: {
    //   data: polygonData,
    //   x: "facet",
    //   y: "Country",
    // },
    facet: {
      data: polygonData,
      //   x: "year",
      //   y: "Country",
      label: null,
    },
    // fy: { label: null },
    x: { type: "linear", axis: null },
    y: { type: "linear", axis: null },
    color: {
      type: "linear",
      domain: [0, 100],
      range: ["#df3144", "#ffde75", "#eee", "#64C2C7", "#376882"],
      label: "%",
      legend: true,
    },
    marks: [
      Plot.line(polygonData, {
        x: "x",
        y: "y",
        z: "group", // Group by country-year combination
        fx: (d) => `${d.year}`,
        fy: "Country",
        stroke: "white",
        strokeWidth: 0.5,
        fill: "value", // Fill the polygon
        curve: "linear-closed", // Closes the polygon
      }),
      // Custom facet labels at the top
      // Custom facet labels at the top
      Plot.text(
        // unique combinations for labels
        facetLabels,
        {
          fx: (d) => `${d.year}`,
          fy: "Country",
          x: () => 7, // Center horizontally (adjust as needed)
          y: () => 12, // Above the plot area (adjust as needed)
          text: "president",
          //   dx: 20,
          //   dy: -20,
          textAnchor: "middle",
          fontSize: 12,
          fontWeight: "bold",
          fill: "#333",
        }
      ),
      //   Plot.frame(polygonData.filter((d) => d.year === 2016)),
    ],
  });

  return plot;
}
