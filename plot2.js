/* global d3 */

d3.json("data/political_groups0.json").then((data) => {
  const width = 800;
  const radius = width / 2;
  const height = radius;

  const order = [
    "GUE/NGL",
    "S&D",
    "Greens/EFA",
    "Renew",
    "EPP",
    "ECR",
    "ID",
    "NI",
  ];

  data.sort(
    (a, b) =>
      order.indexOf(a.political_group) - order.indexOf(b.political_group),
  );

  console.log(data);

  const color = d3
    .scaleSequential()
    .domain([0, 20])
    .interpolator(d3.interpolateRdYlGn);

  const pie = d3
    .pie()
    .sort(null)
    .value((d) => d.group_size)
    .startAngle(-Math.PI / 2)
    .endAngle(Math.PI / 2)
    .padAngle(0.01);

  const arc = d3
    .arc()
    .innerRadius(radius * 0.5)
    .outerRadius(radius);

  const svg = d3
    .select(".container")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${width / 2},${height})`); // Removed rotation

  const g = svg
    .selectAll(".arc")
    .data(pie(data))
    .enter()
    .append("g")
    .attr("class", "arc");

  g.append("path")
    .attr("d", arc)
    .attr("fill", (d) => color(d.data.average_grade));

  // Append the text
  g.append("text")
    .attr("transform", (d) => `translate(${arc.centroid(d)})`) // Removed the rotation from the translate function
    .attr("dy", ".35em")
    .style("text-anchor", "middle")
    .style("fill", "white")
    .style("font-weight", "bold")
    .text((d) => d.data.political_group);
});
