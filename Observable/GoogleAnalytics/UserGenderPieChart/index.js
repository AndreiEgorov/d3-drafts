//to load the file properly, serve the whole folder on local server like this:
// in terminal, open this folder and type "python -m SimpleHTTPServer 8888 &"

(function (d3) {
  //imports
  const json = d3.json;
  const select = d3.select;
  const nested = d3.nest;

  //imports end

  const svg = select("svg").style("background-color", "white");
  const height = +svg.attr("height");
  const width = +svg.attr("width");

  let requestedData = null;

  const render = () => {
    if (requestedData !== null) {
      pieChartBuilder(svg, {
        data: requestedData,
        height,
        width,
      });
    } else {
      console.log("NO data YET!!");
    }
  };

  const pieChartBuilder = (selection, props) => {
    const { data, height, width } = props;
    const margin = { top: 30, right: 40, bottom: 30, left: 40 };

    const genders = ["female", "male"];

    const color = d3
      .scaleOrdinal()
      .domain(data.map((d) => d.name))
      .range(["#046b97", "#058dc7"]);

    const pie = d3
      .pie()
      .sort(null)
      .value((d) => d.value);

    const arc = d3
      .arc()
      .innerRadius(0)
      .outerRadius(Math.min(width, height) / 4 - 1);

    const radius = (Math.min(width, height) / 5) * 0.8;
    const arcLabel = d3.arc().innerRadius(radius).outerRadius(radius);
    const arcs = pie(data);
    const legendGap = 80;

    console.log("HERE", arcs);

    const thePie = selection
      .append("g")
      .attr("stroke", "white")
      .attr("class", "pie-chart")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    thePie
      .selectAll("path")
      .data(arcs)
      .join("path")
      .attr("fill", (d) => color(d.data.name))
      .attr("d", arc)
      .append("title")
      .text((d) => `${d.data.name}: ${d.data.value.toLocaleString()}`);

    selection
      .append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 12)
      .attr("text-anchor", "middle")
      .attr("transform", `translate(${width / 2}, ${height / 2})`)
      .attr("class", "section-label")
      .attr("fill", "white")

      .selectAll("text")
      .data(arcs)
      .join("text")

      .attr("transform", (d) => `translate(${arcLabel.centroid(d)})`)
      .call((text) =>
        text
          .append("tspan")
          .attr("y", "-0.4em")
          .attr("font-weight", "bold")
          .text((d) => d.data.name)
      )
      .call((text) =>
        text
          .filter((d) => d.endAngle - d.startAngle > 0.25)
          .append("tspan")
          .attr("x", 0)
          .attr("y", "0.7em")
          .attr("fill-opacity", 0.7)
          .text((d) => d.data.value.toLocaleString())
      );

    const legendGroup = thePie
      .append("g")
      .attr("class", "legend-group")
      .attr("transform", `translate(${-radius}, ${-radius * 2})`);

    const legend = legendGroup
      .selectAll("g")
      .data(color.range())
      .enter()
      .append("g")
      .attr("class", "one-legend")
      .attr("transform", function (d, i) {
        return `translate(${i * legendGap}, ${0})`;
      });

    legend
      .append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", 10)
      .attr("height", 10)

      .style("fill", function (d, i) {
        console.log("BOS", d, i);
        return color(i);
      });

    legend
      .append("text")
      .attr("x", 20)
      .attr("y", 10)
      .attr("font-weight", "bold")
      .text(function (d, i) {
        return genders[i];
      });
  };

  //uncomment when editing , delete otherwise
  let data1 = {
    reports: [
      {
        columnHeader: {
          dimensions: ["ga:userGender", "ga:dimension8"],
          metricHeader: {
            metricHeaderEntries: [
              {
                name: "ga:users",
                type: "INTEGER",
              },
            ],
          },
        },
        data: {
          rows: [
            {
              dimensions: ["female", "3161"],
              metrics: [
                {
                  values: ["9599"],
                },
              ],
            },
            {
              dimensions: ["male", "3161"],
              metrics: [
                {
                  values: ["11162"],
                },
              ],
            },
          ],
          totals: [
            {
              values: ["20761"],
            },
          ],
          rowCount: 2,
          minimums: [
            {
              values: ["9599"],
            },
          ],
          maximums: [
            {
              values: ["11162"],
            },
          ],
          samplesReadCounts: ["499314"],
          samplingSpaceSizes: ["1941217"],
          isDataGolden: true,
        },
      },
    ],
  };

  //calculating totals for entire data set
  let totalUsers = nested()
    .rollup(function (s) {
      return d3.sum(s, function (d) {
        return +d.metrics[0].values;
      });
    })
    .entries(data1.reports[0].data.rows);

  data = data1.reports[0].data.rows.map((r) => ({
    name: r.dimensions[0],
    value: +r.metrics[0].values[0],
    percent: +r.metrics[0].values[0] / totalUsers,
  }));

  requestedData = data;
  render();

  //end for local running ^^^

  // json("http://localhost:8888/response.json").then(function (rawData) {
  //   //calculating totals for entire data set
  //   let totalUsers = nested()
  //     .rollup(function (s) {
  //       return d3.sum(s, function (d) {
  //         return +d.metrics[0].values;
  //       });
  //     })
  //     .entries(rawData.reports[0].data.rows);

  //   data = rawData.reports[0].data.rows.map((r) => ({
  //     name: r.dimensions[0],
  //     value: +r.metrics[0].values[0],
  //     percent: +r.metrics[0].values[0] / totalUsers,
  //   }));

  //   requestedData = data;

  //   render();
  // });
})(d3);
