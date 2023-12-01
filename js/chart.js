function chart() {
    let margin = { top: 20, right: 20, bottom: 30, left: 50 },
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom,
        xLabelText = "Date",
        yLabelText = "Market Price",
        yLabelOffsetPx = 0,
        titleText = "";

    // // Bisrat: Brushing and Linking
    // let ourBrush = null,
    //     selectableElements = d3.select(null),
    //     dispatcher;

    // Parse date and numbers
    const parseDate = d3.timeParse("%Y-%m-%d");
    function chart(selector, data) {
        data.forEach(function (d) {
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
            .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.top + 60) + ")")
            .style("text-anchor", "middle")
            .style("font-size", "10px")
            .attr("dx", "-8.5em")
            .text(xLabelText);
        
        // Data title
        svg.append("text")
            .attr("x", width / 2) 
            .attr("y", 0 - (margin.top / 2))
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .style("font-weight", "bold")
            .attr("dx", "-5.5em")
            .text("BTC-USD");


        // Add the y Axis
        let yAxis = svg.append("g")
            .call(d3.axisLeft(y));

        // y axis label
        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left + yLabelOffsetPx)
            .attr("x", 0 - (height / 2))
            .attr("dy", "1em")
            .style("font-size", "10px")
            .style("text-anchor", "middle")
            .text(yLabelText);
        
        const tooltip = d3.select(selector)
            .append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);
      
        // Bisrat: Draw candlesticks (assigned a variable to candlestick and then assigned candlestick to selectableElements)
        let candlestick = svg.selectAll(".candlestick")
            .data(data);

        candlestick.enter().append("rect")
            .attr("x", d => x(d.Date))
            .attr("y", d => y(Math.max(d.Open, d.Close)))
            .attr("height", d => Math.abs(y(d.Open) - y(d.Close)))
            .attr("width", x.bandwidth())
            .attr("fill", d => d.Open > d.Close ? "red" : "green")
            .on("mouseover", function(d) {
                tooltip.transition()
                    .duration(200)
                    .style("opacity", 1)
                tooltip.html(d.Date.toLocaleDateString('en-US', {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit"
                    }) +
                    "<br> Open: " + d.Open +
                    "<br> Close: " + d.Close + 
                    "<br> Low: " + d.Low + 
                    "<br> High: " + d.High)
                    .style("left", (d3.event.pageX+10) + "px")
                    .style("top", (d3.event.pageY-28) + "px")
            })
            .on("mouseout", function() {
                tooltip.transition()
                    .duration(200)
                    .style("opacity", 0)
            });
  
        // Draw wicks
        svg.selectAll(".wick")
            .data(data)
            .enter().append("line")
            .attr("x1", d => x(d.Date) + x.bandwidth() / 2)
            .attr("x2", d => x(d.Date) + x.bandwidth() / 2)
            .attr("y1", d => y(d.High))
            .attr("y2", d => y(d.Low))
            .attr("stroke", "black")
            .attr("stroke-width", 1)
            // Bisrat: color the wicks the same as the candlesticks
            .attr("stroke", d => d.Open > d.Close ? "red" : "green");

        selectableElements = candlestick;

        // svg.call(brush)

        // // Bisrat: Highlight candlesticks when brushed
        // function brush(g) {
        //     const brush = d3.brushX()
        //         .on("start brush", brushed)
        //         .on("end", brushended);

        //     ourBrush = brush;

        //     g.call(brush);

        //     function brushed() {
        //         if (d3.event.selection === null) return;
        //         console.log(d3.event.selection)
        //         const [x0, x1] = d3.event.selection;
        //         console.log("CandleStick:", candlestick);
        //         candlestick.classed("selected", d =>
        //             // x0 <= x(d.Date) && x(d.Date) + x.bandwidth() <= x1 
        //              true  
        //         );


        //         let dispatchString = Object.getOwnPropertyNames(dispatcher._)[0];
        //         //Let other charts know about brush update
        //         dispatcher.call(dispatchString, this, candlestick.selectAll(".selected").data());


        //     }

        //     function brushended() {
        //         // if(d3.event.sourceEvent.type!="end"){
        //         //     d3.select(this).call(brush.move, null);
        //         //   }   
        //     }
        // }


        return chart;
    }

    // // Bisrat: Brushing and Linking
    // function X(d) {
    //     return xScale(xValue(d));
    // }
    // function Y(d) {
    //     return yScale(yValue(d));
    // }


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