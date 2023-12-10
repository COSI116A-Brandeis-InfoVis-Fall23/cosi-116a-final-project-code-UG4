// This function inverts a D3 scaleBand scale
function scaleBandInvert(scale) {
  let domain = scale.domain();
  let paddingOuter = scale(domain[0]);
  let eachBand = scale.step();
  return function (value) {
    let index = Math.floor((value - paddingOuter) / eachBand);
    return domain[Math.max(0, Math.min(index, domain.length - 1))];
  };
}

function chart() {
  let margin = { top: 20, right: 20, bottom: 170, left: 65 },
    width = 1200 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom,
    xLabelText = "Date",
    yLabelText = "Market Price",
    yLabelOffsetPx = 10,
    titleText = "";


  function chart(selector, data, dataSource, timePeriodName) {
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
      .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%Y-%m-%d")));
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
      .selectAll(".x-label")
      .data([null])
      .join("text")
      .attr("class", "x-label")
      .attr(
        "transform",
        "translate(" +
          (margin.left + width / 2) +
          " ," +
          (height + margin.top + 60) +
          ")"
      )
      .style("text-anchor", "middle")
      .style("font-size", "15px")
      .attr("dx", "-8.5em")
      .text(xLabelText);

    // Data title
    chartGroup
      .selectAll(".chart-label")
      .data([null])
      .join("text")
      .attr("class", "chart-label")
      .attr("x", width / 2 + margin.left)
      .attr("y", 0 - margin.top / 2 + 10)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .style("font-weight", "bold")
      .attr("dx", "-5.5em")
      .text(dataSource);

    // Add the y Axis
    let yAxis = chartGroup
      .selectAll(".y-axis")
      .data([null])
      .join("g")
      .attr("class", "y-axis")
      .call(d3.axisLeft(y));

    // y axis label
    chartGroup
      .selectAll(".y-label")
      .data([null])
      .join("text")
      .attr("class", "y-label")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + yLabelOffsetPx)
      .attr("x", 0 - height / 2)
      .attr("dy", "1em")
      .style("font-size", "15px")
      .style("text-anchor", "middle")
      .text(yLabelText);

    const tooltip = d3
      .select(selector)
      .selectAll(".tooltip")
      .data([null])
      .join("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

    // Draw candlesticks (assigned a variable to candlestick and then assigned candlestick to selectableElements)
    let candlestick = chartGroup
      .selectAll(".candlestick")
      .data(data)
      .join("rect")
      .attr("class", "candlestick")
      .attr("x", (d) => x(d.Date))
      .attr("y", (d) => y(Math.max(d.Open, d.Close)))
      .attr("height", (d) => Math.abs(y(d.Open) - y(d.Close)))
      .attr("width", x.bandwidth())
      .attr("fill", (d) => (d.Open > d.Close ? "red" : "green"))
      .on("mouseover", function (event, d) {
        tooltip.transition().duration(200).style("opacity", 1);
        tooltip
          .html(
            d.Date.toLocaleDateString("en-US", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            }) +
              "<br> Open: " +
              d.Open +
              "<br> Close: " +
              d.Close +
              "<br> Low: " +
              d.Low +
              "<br> High: " +
              d.High
          )
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 28 + "px");
      })
      .on("mouseout", function () {
        tooltip.transition().duration(200).style("opacity", 0);
      });

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
      .attr("stroke-width", 1)
      .attr("stroke", (d) => (d.Open > d.Close ? "red" : "green")); // color the wicks the same as the candlesticks

    selectableElements = candlestick;

    // Selecting or creating a brush group within the chart group. 
    // This ensures that the brush is correctly positioned within the chart.
    const brushGroup = chartGroup
      .selectAll(".brush-group")
      .data([null])
      .join("g")
      .attr("class", "brush-group");

    // Conditional handling based on the selected time period
    if (timePeriodName === "monthly") {
      chartGroup.selectAll(".brush-group").remove();
      d3.select("#brushed-chart").selectAll("svg").remove();
    } else {
      const lastDate = data[data.length - 1].Date;

      let limitRange = 0;
      let defaultSelection;
      if (timePeriodName === "daily") {
        limitRange = lastDate.getTime() - data[data.length - 60].Date.getTime();
        defaultSelection = [x(data[data.length - 60].Date), x(lastDate)];
      } else {
        limitRange = lastDate.getTime() - data[data.length - 15].Date.getTime();
        defaultSelection = [x(data[data.length - 15].Date), x(lastDate)];
      }

      // Function to handle brush movement
      // Adjusts the selected range if it exceeds the defined limit
      function brushed({ selection }) {
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
          .yLabelOffset(0)("#brushed-chart", data, dateRange, dataSource);
      }

      // Function to handle the end of brush interaction
      // Resets the brush to the default selection if no selection is made
      function brushended({ selection }) {
        if (!selection) {
          brushGroup.call(brush.move, defaultSelection);
        }
      }

      // Initializing the brush with specific dimensions and attaching event handlers
      const brush = d3
        .brushX()
        .extent([
          [0, 0.5],
          [width, height + 0.5],
        ])
        .on("brush", brushed)
        .on("end", brushended);
      brushGroup.call(brush).call(brush.move, defaultSelection);
    }

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

// A function to make an SVG element responsive
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

  // A function to resize the SVG element when the window size changes
  function resize() {
    const targetWidth = parseInt(container.style("width"));
    svg.attr("width", targetWidth);
    svg.attr("height", Math.round(targetWidth / aspectRatio));
  }
}
