/* global d3 */

function minMaxGradeFinder(gradesData) {
  /* TODO : Re-write this function with more modern code, like a reduce() function.
  For now though, it will do the job. */
  let lowestGrade = 20;
  let highestGrade = 0;
  for (let i = 0; i < gradesData.length; i += 1) {
    console.log(gradesData[i]);
    if (gradesData[i].average_grade < lowestGrade) {
      lowestGrade = gradesData[i].average_grade;
    }
    if (gradesData[i].average_grade > highestGrade) {
      highestGrade = gradesData[i].average_grade;
    }
  }
  console.log({ lowestGrade }, { highestGrade });
  return { lowestGrade, highestGrade };
}

// Define projection
const projection = d3.geoMercator();

// Define path generator
const path = d3.geoPath().projection(projection);

// Load the data
d3.json("data/countries0.json").then((gradesData) => {
  const { lowestGrade, highestGrade } = minMaxGradeFinder(gradesData);

  // Set a color scale
  const color = d3
    .scaleSequential()
    .domain([lowestGrade, highestGrade])
    .interpolator(d3.interpolateRdYlGn);

  d3.json("data/europe.geojson").then((mapData) => {
    const updatedFeatures = mapData.features.map((mapFeature) => {
      const gradeCountry = gradesData.find(
        (country) =>
          country.country.toUpperCase() === mapFeature.properties.ISO2,
      );

      // Create a new object with all properties of mapFeature
      // and a possibly updated average_grade property
      return {
        ...mapFeature,
        properties: {
          ...mapFeature.properties,
          average_grade: gradeCountry
            ? gradeCountry.average_grade
            : mapFeature.properties.average_grade,
        },
      };
    });

    projection.fitSize([800, 600], {
      type: "FeatureCollection",
      features: updatedFeatures,
    });

    // Now you can use the color scale to color your map
    d3.select("#map")
      .selectAll("path")
      .data(updatedFeatures)
      .enter()
      .append("path")
      .attr("d", path)
      .attr("class", "country-default") // Use the path generator with projection
      .style("fill", (d) => color(d.properties.average_grade));
  });
});
