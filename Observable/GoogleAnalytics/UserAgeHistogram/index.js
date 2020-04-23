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
      barChartBuilder(svg, {
        data: requestedData,
        height,
        width,
      });
    } else {
      console.log("NO data YET!!");
    }
  };

  const barChartBuilder = (selection, props) => {
    const { data, height, width } = props;

    
    const margin = { top: 30, right: 40, bottom: 30, left: 40 };

    let chart = selection.append("g").attr("class", "chart-main-group");

    const x = d3
      .scaleBand()
      .domain(d3.range(data.length))
      .range([margin.left, width - margin.right])
      .padding(0.3);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.percent)])
      .nice()
      .range([height - margin.bottom, margin.top]);

    const xAxis = (g) =>
      g
        .attr("class", "x-axis")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(
          d3
            .axisBottom(x)
            .tickFormat((i) => data[i].name)
            .tickSizeOuter(0)
        );

    const yAxis = (g) =>
      g

        .attr("class", "y-axis")
        .attr("transform", `translate(${margin.left},0)`)
        .call(
          d3
            .axisLeft(y)
            .ticks(4, "%")
            .tickSize(-width + margin.left + margin.right)
        )
        .call((g) => g.select(".domain").remove());

    chart.append("g").call(xAxis);

    chart.append("g").call(yAxis);
    chart
      .append("g")
      .attr("fill", "steelblue")
      .selectAll("rect")
      .data(data)
      .join("rect")
      .attr("x", (d, i) => x(i))
      .attr("y", (d) => y(d.percent))
      .attr("height", (d) => y(0) - y(d.percent))
      .attr("width", x.bandwidth());
  };

  //uncomment when editing , delete otherwise
  // data1 = {
  //     "reports": [
  //       {
  //         "columnHeader": {
  //           "dimensions": [
  //             "ga:userAgeBracket",
  //             "ga:dimension8"
  //           ],
  //           "metricHeader": {
  //             "metricHeaderEntries": [
  //               {
  //                 "name": "ga:users",
  //                 "type": "INTEGER"
  //               }
  //             ]
  //           }
  //         },
  //         "data": {
  //           "rows": [
  //             {
  //               "dimensions": [
  //                 "18-24",
  //                 "3161"
  //               ],
  //               "metrics": [
  //                 {
  //                   "values": [
  //                     "1924"
  //                   ]
  //                 }
  //               ]
  //             },
  //             {
  //               "dimensions": [
  //                 "25-34",
  //                 "3161"
  //               ],
  //               "metrics": [
  //                 {
  //                   "values": [
  //                     "3616"
  //                   ]
  //                 }
  //               ]
  //             },
  //             {
  //               "dimensions": [
  //                 "35-44",
  //                 "3161"
  //               ],
  //               "metrics": [
  //                 {
  //                   "values": [
  //                     "3919"
  //                   ]
  //                 }
  //               ]
  //             },
  //             {
  //               "dimensions": [
  //                 "45-54",
  //                 "3161"
  //               ],
  //               "metrics": [
  //                 {
  //                   "values": [
  //                     "3938"
  //                   ]
  //                 }
  //               ]
  //             },
  //             {
  //               "dimensions": [
  //                 "55-64",
  //                 "3161"
  //               ],
  //               "metrics": [
  //                 {
  //                   "values": [
  //                     "3207"
  //                   ]
  //                 }
  //               ]
  //             },
  //             {
  //               "dimensions": [
  //                 "65+",
  //                 "3161"
  //               ],
  //               "metrics": [
  //                 {
  //                   "values": [
  //                     "3577"
  //                   ]
  //                 }
  //               ]
  //             }
  //           ],
  //           "totals": [
  //             {
  //               "values": [
  //                 "20181"
  //               ]
  //             }
  //           ],
  //           "rowCount": 6,
  //           "minimums": [
  //             {
  //               "values": [
  //                 "1924"
  //               ]
  //             }
  //           ],
  //           "maximums": [
  //             {
  //               "values": [
  //                 "3938"
  //               ]
  //             }
  //           ],
  //           "samplesReadCounts": [
  //             "499314"
  //           ],
  //           "samplingSpaceSizes": [
  //             "1941217"
  //           ],
  //           "isDataGolden": true
  //         }
  //       }
  //     ]
  //   }

  // //calculating totals for entire data set
  // let totalUsers = nested()
  //   .rollup(function(s){
  //       return d3.sum(s, function(d){
  //           return +d.metrics[0].values
  //       })
  //   })
  //   .entries(data1.reports[0].data.rows)

  // data = data1.reports[0].data.rows.map(r => ({
  //     name : r.dimensions[0],
  //     value : +r.metrics[0].values[0],
  //     percent : +r.metrics[0].values[0] /totalUsers
  //   }
  // ))

  // requestedData = data;
  // render();

  json("http://localhost:8888/response.json").then(function (rawData) {
    //calculating totals for entire data set
    let totalUsers = nested()
      .rollup(function (s) {
        return d3.sum(s, function (d) {
          return +d.metrics[0].values;
        });
      })
      .entries(rawData.reports[0].data.rows);

    data = rawData.reports[0].data.rows.map((r) => ({
      name: r.dimensions[0],
      value: +r.metrics[0].values[0],
      percent: +r.metrics[0].values[0] / totalUsers,
    }));

    requestedData = data;

    render();
  });
})(d3);
