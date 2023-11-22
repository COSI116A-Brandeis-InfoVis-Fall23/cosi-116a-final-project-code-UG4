function chart() {
    let margin = {top: 20, right: 20, bottom: 30, left: 50},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom,
        xLabelText = "",
        yLabelText = "",
        yLabelOffsetPx = 0,
        titleText = "";

    // Parse date and numbers
    const parseDate = d3.timeParse("%Y-%m-%d");

    function chart(selector, data) {

        let bruh = d3.select(selector)
            .append("chart")
                .attr("preserveAspectRatio", "xMidYMid meet")
                .attr("viewBox", [0, 0, width + margin.left + margin.right, height + margin.top + margin.bottom].join(' '))
                .classed("my-chart", true);

        bruh.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        data.forEach(function(d) {
            d.Date = parseDate(d.Date);
            d.Open = +d.Open;
            d.High = +d.High;
            d.Low = +d.Low;
            d.Close = +d.Close;
        });

        // Set up scales
        const x = d3.scaleBand().range([0, width]).padding(0.1),
              y = d3.scaleLinear().range([height, 0]);

        x.domain(data.map(d => d.Date));
        y.domain([d3.min(data, d => d.Low), d3.max(data, d => d.High)]);

        // Retrieve SVG element
        const svg = d3.select("#vis-svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
          .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // Add the x Axis
        let xAxis = svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%Y-%m-%d")))
            .selectAll("text") 
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-65)");

        // x axis label
        svg.append("text")
            .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.top + 20) + ")")
            .style("text-anchor", "middle")
            .text(xLabelText);


        // Add the y Axis
        let yAxis = svg.append("g")
            .call(d3.axisLeft(y));

        // y axis label
        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left + yLabelOffsetPx)
            .attr("x",0 - (height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text(yLabelText);



        // Draw candlesticks
        svg.selectAll(".candlestick")
            .data(data)
          .enter().append("rect")
            .attr("x", d => x(d.Date))
            .attr("y", d => y(Math.max(d.Open, d.Close)))
            .attr("height", d => Math.abs(y(d.Open) - y(d.Close)))
            .attr("width", x.bandwidth())
            .attr("fill", d => d.Open > d.Close ? "red" : "green");

        // Draw wicks
        svg.selectAll(".wick")
            .data(data)
          .enter().append("line")
            .attr("x1", d => x(d.Date) + x.bandwidth() / 2)
            .attr("x2", d => x(d.Date) + x.bandwidth() / 2)
            .attr("y1", d => y(d.High))
            .attr("y2", d => y(d.Low))
            .attr("stroke", "black")
            .attr("stroke-width", 1);

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
        selectableElements.classed("selected", d => {
        return selectedData.includes(d)
        });

    };
    return chart;
}