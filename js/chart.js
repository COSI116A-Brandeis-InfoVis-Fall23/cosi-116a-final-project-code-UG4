function scaleBandInvert(scale) {
  var domain = scale.domain();
  var paddingOuter = scale(domain[0]);
  var eachBand = scale.step();
  return function (value) {
    var index = Math.floor((value - paddingOuter) / eachBand);
    return domain[Math.max(0, Math.min(index, domain.length - 1))];
  };
}

function chart() {
  let margin = { top: 20, right: 40, bottom: 80, left: 70 },
    width = window.innerWidth - margin.left - margin.right,
    height = 350 - margin.top - margin.bottom,
    xLabelText = "",
    yLabelText = "",
    yLabelOffsetPx = 0,
    titleText = "";

  // Parse date and numbers
  // const parseDate = d3.timeParse("%Y-%m-%d");
  function chart(selector, data) {
    // let bruh = d3
    //   .select(selector)
    //   .append("chart")
    //   .attr("preserveAspectRatio", "xMidYMid meet")
    //   .attr(
    //     "viewBox",
    //     [
    //       0,
    //       0,
    //       width + margin.left + margin.right,
    //       height + margin.top + margin.bottom,
    //     ].join(" ")
    //   )
    //   .classed("my-chart", true);

    // bruh.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // data.forEach(function (d) {
    //   d.Date = parseDate(d.Date);
    //   d.Open = +d.Open;
    //   d.High = +d.High;
    //   d.Low = +d.Low;
    //   d.Close = +d.Close;
    // });

    // Set up scales
    const x = d3.scaleBand().range([0, width]).padding(0.1),
      y = d3.scaleLinear().range([height, 0]);

    x.domain(data.map((d) => d.Date));
    y.domain([d3.min(data, (d) => d.Low), d3.max(data, (d) => d.High)]);

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
      .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%B-%Y")));
    xAxis
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", "rotate(-65)")
      .style("visibility", (d, i) => {
        if (x.domain()[i - 1]) {
          return d.getMonth() === x.domain()[i - 1].getMonth()
            ? "hidden"
            : "visible";
        } else {
          return "visible";
        }
      });

    xAxis.selectAll(".tick line").style("visibility", (d, i) => {
      if (x.domain()[i - 1]) {
        return d.getMonth() === x.domain()[i - 1].getMonth()
          ? "hidden"
          : "visible";
      } else {
        return "visible";
      }
    });

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
      .data(data)
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
      .data(data)
      .join("line")
      .attr("class", "wick")
      .attr("x1", (d) => x(d.Date) + x.bandwidth() / 2)
      .attr("x2", (d) => x(d.Date) + x.bandwidth() / 2)
      .attr("y1", (d) => y(d.High))
      .attr("y2", (d) => y(d.Low))
      .attr("stroke", "black")
      .attr("stroke-width", 1);

    const lastDate = data[data.length - 1].Date;
    const limitRange = 60 * 24 * 3600 * 1000;
    const defaultSelection = [
      x(d3.timeParse("%Y-%m-%d")("2020-12-01")),
      x(lastDate),
    ];

    const brushed = ({ selection }) => {
      let dateRange = selection.map(scaleBandInvert(x));
      if (dateRange[1] && dateRange[0]) {
        if (dateRange[1].getTime() - dateRange[0].getTime() > limitRange) {
          dateRange[1] = new Date(dateRange[0].getTime() + limitRange);
          brushGroup.call(
            brush.move,
            dateRange.map((d) => x(d))
          );
        }
      }

      let zoomedChart = brushedChart()
        .xLabel("Date")
        .yLabel("Market Price")
        .yLabelOffset(0)("#brushed-chart", data, dateRange);
    };

    const brushended = ({ selection }) => {
      if (!selection) {
        brushGroup.call(brush.move, defaultSelection);
      }
    };

    const brush = d3
      .brushX()
      .extent([
        [0, 0.5],
        [width, height + 0.5],
      ])
      .on("brush", brushed)
      .on("end", brushended);

    const brushGroup = chartGroup
      .selectAll(".brush-group")
      .data([null])
      .join("g")
      .attr("class", "brush-group")
      .call(brush)
      .call(brush.move, defaultSelection);

    return chart;
  }

  // getter/setter methods

  chart.xLabel = function (_) {
    if (!arguments.length) return xLabelText;
    xLabelText = _;
    return chart;
  };

  chart.yLabel = function (_) {
    if (!arguments.length) return yLabelText;
    yLabelText = _;
    return chart;
  };

  chart.yLabelOffset = function (_) {
    if (!arguments.length) return yLabelOffsetPx;
    yLabelOffsetPx = _;
    return chart;
  };

  // Gets or sets the dispatcher we use for selection events
  chart.selectionDispatcher = function (_) {
    if (!arguments.length) return dispatcher;
    dispatcher = _;
    return chart;
  };

  // Given selected data from another visualization
  // select the relevant elements here (linking)
  chart.updateSelection = function (selectedData) {
    if (!arguments.length) return;

    // Select an element if its datum was selected
    selectableElements.classed("selected", (d) => {
      return selectedData.includes(d);
    });
  };
  return chart;
}

function responsivefy(svg) {
  const container = d3.select(svg.node().parentNode);
  const width = parseInt(svg.style("width"), 10);
  const height = parseInt(svg.style("height"), 10);
  const aspectRatio = width / height;

  svg
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("preserveAspectRatio", "xMinYMid")
    .call(resize);

  d3.select(window).on("resize." + container.attr("id"), resize);

  function resize() {
    const targetWidth = parseInt(container.style("width"));
    svg.attr("width", targetWidth);
    svg.attr("height", Math.round(targetWidth / aspectRatio));
  }
}
