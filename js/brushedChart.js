function brushedChart() {
  let margin = { top: 20, right: 40, bottom: 80, left: 70 },
    width = window.innerWidth - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom,
    xLabelText = "",
    yLabelText = "",
    yLabelOffsetPx = 0,
    titleText = "";

  function brushedChart(selector, data, dateRange) {
    const filteredData = data.filter(
      (d) => d.Date >= dateRange[0] && d.Date <= dateRange[1]
    );
    const x = d3.scaleBand().range([0, width]).padding(0.1),
      y = d3.scaleLinear().range([height, 0]);

    x.domain(filteredData.map((d) => d.Date));
    y.domain([
      d3.min(filteredData, (d) => d.Low),
      d3.max(filteredData, (d) => d.High),
    ]);

    // Retrieve SVG element
    const svg = d3
      .select(selector)
      .selectAll("svg")
      .data([null])
      .join("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .call(responsivefy);

    const chartGroup = svg
      .selectAll(".chart-group")
      .data([null])
      .join("g")
      .attr("class", "chart-group")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Add the x Axis
    let xAxis = chartGroup
      .selectAll(".x-axis")
      .data([null])
      .join("g")
      .attr("class", "x-axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%Y-%m-%d")))
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", "rotate(-65)");

    // x axis label
    chartGroup
      .selectAll(".x-axis-label")
      .data([null])
      .join("text")
      .attr("class", "x-axis-label")
      .attr(
        "transform",
        "translate(" + width / 2 + " ," + (height + margin.top + 20) + ")"
      )
      .style("text-anchor", "middle")
      .text(xLabelText);

    // Add the y Axis
    let yAxis = chartGroup
      .selectAll(".y-axis")
      .data([null])
      .join("g")
      .attr("class", "y-axis")
      .call(d3.axisLeft(y));

    // y axis label
    chartGroup
      .selectAll(".y-axis-label")
      .data([null])
      .join("text")
      .attr("class", "y-axis-label")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + yLabelOffsetPx)
      .attr("x", 0 - height / 2)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text(yLabelText);

    // Draw candlesticks
    chartGroup
      .selectAll(".candlestick")
      .data(filteredData)
      .join("rect")
      .attr("class", "candlestick")
      .attr("x", (d) => x(d.Date))
      .attr("y", (d) => y(Math.max(d.Open, d.Close)))
      .attr("height", (d) => Math.abs(y(d.Open) - y(d.Close)))
      .attr("width", x.bandwidth())
      .attr("fill", (d) => (d.Open > d.Close ? "red" : "green"));

    // Draw wicks
    chartGroup
      .selectAll(".wick")
      .data(filteredData)
      .join("line")
      .attr("class", "wick")
      .attr("x1", (d) => x(d.Date) + x.bandwidth() / 2)
      .attr("x2", (d) => x(d.Date) + x.bandwidth() / 2)
      .attr("y1", (d) => y(d.High))
      .attr("y2", (d) => y(d.Low))
      .attr("stroke", "black")
      .attr("stroke-width", 1)
      .attr("stroke", d => d.Open > d.Close ? "red" : "green");

    return brushedChart;
  }

  // getter/setter methods

  brushedChart.xLabel = function (_) {
    if (!arguments.length) return xLabelText;
    xLabelText = _;
    return brushedChart;
  };

  brushedChart.yLabel = function (_) {
    if (!arguments.length) return yLabelText;
    yLabelText = _;
    return brushedChart;
  };

  brushedChart.yLabelOffset = function (_) {
    if (!arguments.length) return yLabelOffsetPx;
    yLabelOffsetPx = _;
    return brushedChart;
  };

  // Gets or sets the dispatcher we use for selection events
  brushedChart.selectionDispatcher = function (_) {
    if (!arguments.length) return dispatcher;
    dispatcher = _;
    return brushedChart;
  };

  // Given selected data from another visualization
  // select the relevant elements here (linking)
  brushedChart.updateSelection = function (selectedData) {
    if (!arguments.length) return;

    // Select an element if its datum was selected
    selectableElements.classed("selected", (d) => {
      return selectedData.includes(d);
    });
  };
  return brushedChart;
}
