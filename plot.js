/* global d3 */
// Set up dimensions
const margin = { top: 50, right: 50, bottom: 50, left: 50 };
const width = 800 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

// Set up scales
const x = d3.scaleBand().rangeRound([0, width]).padding(0.1);
const y = d3.scaleLinear().rangeRound([height, 0]);

const color = d3
  .scaleOrdinal()
  .domain(["ECR", "ID", "EPP", "Renew", "NI", "S&D", "GUE/NGL", "Greens/EFA"])
  .range([
    "#1E90FF",
    "#00008B",
    "#0000FF",
    "#FFD700",
    "#D3D3D3",
    "#FF0000",
    "#8B0000",
    "#008000",
  ]);

// Set up SVG
const svg = d3
  .select(".container")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

// Fetch and process data
d3.json("data/eu_groups0.json").then((data) => {
  x.domain(data.map((d) => d.political_group));
  y.domain([0, d3.max(data, (d) => d["Mean(final_grade)"])]);

  // Append the bars

  svg
    .selectAll(".bar")
    .data(data)
    .enter()
    .append("rect")
    // In case I want to add a class for styling : .attr("class", "bar")
    .attr("x", (d) => x(d.political_group))
    .attr("y", (d) => y(d["Mean(final_grade)"]))
    .attr("width", x.bandwidth())
    .attr("height", (d) => height - y(d["Mean(final_grade)"]))
    .attr("fill", (d) => color(d.political_group));

  // Append the axis

  svg
    .append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("class", "axis-label");

  svg
    .append("g")
    .call(d3.axisLeft(y))
    .selectAll("text")
    .attr("class", "axis-label");
});
