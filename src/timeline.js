import * as d3 from "npm:d3";

export function timeline(timelineData, animationDuration, { width } = {}) {
  const vw = window.innerWidth;
  const marSide = vw / 10;
  // console.log("VW:", vw);
  const vh = window.innerHeight;
  // Process the data
  const data = timelineData
    .map((d) => ({
      date: new Date(d.date),
      id: +d.id,
      event: d.event,
      type: d.type,
      area: d.area,
      actor: d.actor,
      actorSimple: d.actor_simple,
    }))
    .filter((d) => d.date && !isNaN(d.date))
    .sort((a, b) => a.id - b.id);

  // Set up dimensions
  const margin = { top: 150, right: marSide, bottom: 80, left: marSide };
  // const innerWidth = vh - margin.left - margin.right;
  const innerWidth = vh;
  const height = window.innerHeight * 0.85;
  const innerHeight = height - margin.top - margin.bottom;

  // Create SVG
  const svg = d3
    .create("svg")
    .attr("width", vh)
    .attr("height", height)
    .attr("viewBox", [0, 0, vh, height])
    .style("max-width", "100%")
    .style("height", "auto");

  const g = svg
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Set up scales
  const dateExtent = d3.extent(data, (d) => d.date);
  let yScale = d3
    .scaleTime()
    .domain(dateExtent)
    .range([-20, innerHeight - 50]);

  // const types = [...new Set(data.map(d => d.type))];
  // const actors = [...new Set(data.map((d) => d.actor))];
  const area = [...new Set(data.map((d) => d.area))];
  // console.log("Areas:", area[2]);
  const colorScale = d3
    .scaleOrdinal(["#1d3956", "#309ebe", "#df3144", "#595959"])
    .domain(area);

  // Set up x scale for areas
  // const areas = [...new Set(data.map((d) => d.area))];
  // const actorsSimple = [...new Set(data.map(d => d.actorSimple))];
  const xScale = d3
    .scalePoint()
    .domain(area)
    .range([0, innerWidth])
    .padding(0.1);

  // Add area labels at the top
  g.selectAll(".area-label")
    .data(area)
    .enter()
    .append("text")
    .attr("class", "area-label")
    .attr("x", (d) => xScale(d))
    .attr("y", -100)
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .style("font-weight", "700")
    // .style("color", "#ddd")
    .style("fill", (d) => colorScale(d))
    .text((d) => d);
  // .call(function (selection) {
  //   selection.each(function (d) {
  //     d3.select(this).call(wrapText, d, 20, d);
  //   });
  // });

  // Add legend
  // const legend = g
  //   .append("g")
  //   .attr("class", "legend")
  //   .attr(
  //     "transform",
  //     `translate(${innerWidth / 2 - 100}, ${innerHeight + 50})`
  //   );

  // const legendItems = legend
  //   .selectAll(".legend-item")
  //   .data(actorSimple)
  //   .enter()
  //   .append("g")
  //   .attr("class", "legend-item")
  //   .attr("transform", (d, i) => `translate(${i * 200}, 0)`);

  // legendItems
  //   .append("circle")
  //   .attr("r", 8)
  //   .attr("fill", (d) => colorScale(d))
  //   .attr("stroke", "white")
  //   .attr("stroke-width", 2);

  // legendItems
  //   .append("text")
  //   .attr("x", 15)
  //   .attr("y", 4)
  //   .attr("text-anchor", "start")
  //   .attr("dominant-baseline", "middle")
  //   .style("font-size", "14px")
  //   .style("font-weight", "600")
  //   .style("fill", "#333")
  //   .text((d) => d);

  // Add timeline axis (vertical line for each area)
  // g.selectAll(".timeline-axis")
  //     .data(areas)
  //     .enter()
  //     .append("line")
  //     .attr("class", "timeline-axis")
  //     .attr("x1", d => xScale(d))
  //     .attr("x2", d => xScale(d))
  //     .attr("y1", 0)
  //     .attr("y2", innerHeight)
  //     .attr("stroke", "#ddd")
  //     .attr("stroke-width", 2);

  // Add y-axis
  // const yAxisGroup = g.append("g")
  //     .attr("class", "y-axis");

  // const yAxis = d3.axisLeft(yScale)
  //     .tickFormat(d3.timeFormat("%b %Y"));

  // yAxisGroup.call(yAxis);

  // Animation state
  let currentIndex = 0;
  let currentEventGroup = null;
  let isAnimating = false;

  function addEvent(d) {
    // Update y-axis smoothly
    // yAxisGroup
    //     .transition()
    //     .duration(800)
    //     .call(d3.axisLeft(yScale).tickFormat(d3.timeFormat("%d %b")));

    const y = yScale(d.date);
    const x = xScale(d.area);

    // Remove previous event group reference
    currentEventGroup = null;

    // Create group for this event
    const eventGroup = g
      .append("g")
      .attr("class", "event-group")
      .attr("transform", `translate(${x}, ${innerHeight + 50})`); // Start from bottom

    currentEventGroup = eventGroup;

    // Add dot
    const dot = eventGroup
      .append("circle")
      .attr("class", "event-dot")
      .attr("r", 0)
      .attr("fill", colorScale(d.area))
      .attr("stroke", "white")
      .attr("stroke-width", 2)
      .style("filter", "drop-shadow(0 2px 4px rgba(0,0,0,0.2))");

    // Add event label (to the right)
    const eventLabel = eventGroup
      .append("text")
      .attr("class", "event-label")
      .attr("x", 20)
      // .attr("y", 4)
      .attr(
        "y",
        yScale((d) => d.date)
      )
      .attr("text-anchor", "start")
      .attr("dominant-baseline", "central")
      .style("font-size", "20px")
      .style("font-weight", "500")
      .style("font-family", "sans-serif")
      .style(
        "text-shadow",
        "2px 0 #fff, -2px 0 #fff, 0 2px #fff, 0 -2px #fff, 1px 1px #fff, -1px -1px #fff, 1px -1px #fff, -1px 1px #fff"
      )
      .style("pointer-events", "none")
      .style("opacity", 0)
      .call(wrapText, d.event, 30, d); // 30 characters per line

    // Add date label (to the left)
    const dateLabel = eventGroup
      .append("text")
      .attr("class", "date-label")
      .attr("x", -20)
      .attr("y", 4)
      .attr("text-anchor", "end")
      .attr("dominant-baseline", "central")
      .style("font-size", "16px")
      .style("font-family", "PT Sans Narrow, sans-serif")
      .style(
        "text-shadow",
        "2px 0 #fff, -2px 0 #fff, 0 2px #fff, 0 -2px #fff, 1px 1px #fff, -1px -1px #fff, 1px -1px #fff, -1px 1px #fff"
      )
      .style("fill", "#666")
      .style("pointer-events", "none")
      .text(d3.timeFormat("%d %b %Y")(d.date))
      .style("opacity", 0);

    // Animate the event flying in
    eventGroup
      .transition()
      .duration(animationDuration / 10)
      .ease(d3.easeCubicOut)
      .attr("transform", `translate(${x}, ${y})`)
      .on("end", () => {
        // Animate dot growth and labels appearing
        dot
          .transition()
          .duration(animationDuration / 20)
          .attr("r", 8);

        eventLabel
          .transition()
          .duration(animationDuration / 20)
          .delay(animationDuration / 20)
          .style("opacity", 1);

        dateLabel
          .transition()
          .duration(animationDuration / 20)
          .delay(animationDuration / 20)
          .style("opacity", 1);

        // After 3 seconds, start flying out to the top
        setTimeout(() => {
          // Fade dots to 0.2 opacity
          dot
            .transition()
            .duration(animationDuration / 20)
            .style("opacity", 0.2);

          // Fade text labels to 0 opacity
          eventLabel
            .transition()
            .duration(animationDuration / 20)
            .style("opacity", 0);

          dateLabel
            .transition()
            .duration(animationDuration / 20)
            .style("opacity", 0);
        }, animationDuration / 2);
      });
  }

  // helper function to wrap text in labels
  function wrapText(text, content, maxChars, dataObj) {
    const words = content.split(/\s+/);
    const lines = [];
    let currentLine = "";

    words.forEach((word) => {
      if ((currentLine + word).length <= maxChars) {
        currentLine += (currentLine ? " " : "") + word;
      } else {
        if (currentLine) lines.push(currentLine);
        currentLine = word;
      }
    });
    if (currentLine) lines.push(currentLine);

    const lineHeight = 1.2;
    const totalHeight = lines.length * lineHeight;
    const yOffset = -(totalHeight - 1) / 2;

    // Get the original x position and text-anchor
    const x = text.attr("x");
    const textAnchor = text.style("text-anchor") || text.attr("text-anchor");

    text.selectAll("tspan").remove();
    text
      .selectAll("tspan")
      .data(lines)
      .enter()
      .append("tspan")
      .attr("x", x) // Use original x position
      .attr("dy", (d, i) => (i === 0 ? `${yOffset}em` : `${lineHeight}em`))
      .style("fill", colorScale(dataObj.area)) // Use the data object here
      .text((d) => d);
  }

  function resetAnimation() {
    currentIndex = 0;
    currentEventGroup = null;
    g.selectAll(".event-group").remove();

    // Reset y-scale to full range
    // if (data.length > 0) {
    //     const dateExtent = d3.extent(data, d => d.date);
    //     yScale.domain(dateExtent);
    //     yAxisGroup
    //         .transition()
    //         .duration(500)
    //         .call(d3.axisLeft(yScale).tickFormat(d3.timeFormat("%b %Y")));
    // }
  }

  function startAnimation(animationDuration) {
    if (data.length === 0 || isAnimating) return;

    isAnimating = true;

    function animateNext() {
      if (currentIndex >= data.length) {
        // Loop back to beginning
        setTimeout(() => {
          resetAnimation();
          setTimeout(() => {
            isAnimating = false;
            startAnimation(animationDuration);
          }, animationDuration / 5);
        }, animationDuration / 2); // second pause before looping
        return;
      }

      // Wait for previous event to fly out before showing new one
      if (currentEventGroup) {
        setTimeout(() => {
          addEvent(data[currentIndex]);
          currentIndex++;
          setTimeout(animateNext, animationDuration / 3); // seconds between each event
        }, animationDuration / 3); // second delay after previous event starts flying out
      } else {
        addEvent(data[currentIndex]);
        currentIndex++;
        setTimeout(animateNext, animationDuration / 3); // seconds between each event
      }
    }

    animateNext();
  }

  // Start animation after a brief delay
  setTimeout(() => {
    startAnimation(animationDuration);
  }, animationDuration / 5);

  return svg.node();
}
