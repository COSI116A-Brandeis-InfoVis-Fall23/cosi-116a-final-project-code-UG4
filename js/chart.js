function chart() {
  let margin = { top: 20, right: 50, bottom: 30, left: 50 },
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom,
      xLabelText = "",
      yLabelText = "",
      yLabelOffsetPx = 0,
      // xLabelText = "Time",
      // yLabelText = "market price (open, close, change)",
      titleText = "";



  // Parse date and numbers. We assume data is in the format you provided.
  const parseDate = d3.timeParse("%Y-%m-%d");

  function chart(selector, data) {
      data.forEach(function(d) {
          d.Date = parseDate(d.Date);
          d.Open = +d.Open;
          d.High = +d.High;
          d.Low = +d.Low;
          d.Close = +d.Close;
      });

      // Set up scales
      // const x = d3.scaleBand().range([0, width]).padding(0.1)
      const x = d3.scaleBand()
      .domain(d3.utcDay
          .range(data.at(0).Date, +data.at(-1).Date + 1)
          .filter(d => d.getUTCDay() !== 0 && d.getUTCDay() !== 6))
      .range([margin.left, width - margin.right])
      .padding(0.2);
      const y = d3.scaleLinear().range([height, 0]);

      x.domain(data.map(d => d.Date));
      y.domain([d3.min(data, d => d.Low), d3.max(data, d => d.High)]);

      // Create SVG element
      const svg = d3.select("#vis-svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
        .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      // // Draw candlesticks
      // svg.selectAll("rect")
      //     .data(data)
      //   .enter().append("rect")
      //     .attr("x", d => x(d.Date))
      //     .attr("width", x.bandwidth())
      //     .attr("y", d => y(Math.max(d.Open, d.Close)))
      //     .attr("height", d => Math.abs(y(d.Open) - y(d.Close)))
      //     .attr("fill", d => d.Open > d.Close ? "red" : "green");

      // // Draw wicks
      // svg.selectAll("line")
      //     .data(data)
      //   .enter().append("line")
      //     .attr("x1", d => x(d.Date) + x.bandwidth() / 2)
      //     .attr("x2", d => x(d.Date) + x.bandwidth() / 2)
      //     .attr("y1", d => y(d.High))
      //     .attr("y2", d => y(d.Low))
      //     .attr("stroke", "black")
      //     .attr("stroke-width", 1);

      // Add the x Axis
      let xAxis = svg.append("g")
          .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%Y-%m-%d")))
          .selectAll("text")  
          .style("text-anchor", "end")
          .attr("dx", "-.8em")
          .attr("dy", ".15em")
          .attr("transform", "rotate(-65)")
      
        xAxis.append("text")        
        .attr("class", "axisLabel")
        .attr("transform", "translate(" + (width - 50) + ",-10)")
        .text(xLabelText);
          

      // Add the y Axis
      let yAxis = svg.append("g")
        .call(d3.axisLeft(y))
      .append("text")
        .attr("class", "axisLabel")
        .attr("transform", "translate(" + yLabelOffsetPx + ", -12)")
        .text(yLabelText);
      // let yAxis = svg.append("g")
      //     .call(d3.axisLeft(y))

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
      
  }

  return chart;
}

// Usage example
// let myChart = candlestickChart();
// d3.json("path/to/your/data.json").then(data => {
//     myChart("#yourSvgContainer", data);
// });



// // Assuming D3.js is already included in your environment

// function chart() {
//   let margin = {top: 20, right: 20, bottom: 30, left: 50},
//       width = 960 - margin.left - margin.right,
//       height = 500 - margin.top - margin.bottom;

//   // Parse date and numbers. We assume data is in the format you provided.
//   const parseDate = d3.timeParse("%Y-%m-%d");

//   function chart(selector, data) {
//       data.forEach(function(d) {
//           d.Date = parseDate(d.Date);
//           d.Open = +d.Open;
//           d.High = +d.High;
//           d.Low = +d.Low;
//           d.Close = +d.Close;
//       });

//       // Set up scales
//       const x = d3.scaleBand().range([0, width]).padding(0.1),
//             y = d3.scaleLinear().range([height, 0]);

//       x.domain(data.map(d => d.Date));
//       y.domain([d3.min(data, d => d.Low), d3.max(data, d => d.High)]);

//       // Create SVG element
//       const svg = d3.select("#vis-svg")
//           .attr("width", width + margin.left + margin.right)
//           .attr("height", height + margin.top + margin.bottom)
//         .append("g")
//           .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//       // Draw candlesticks
//       svg.selectAll(".candlestick")
//           .data(data)
//         .enter().append("rect")
//           .attr("x", d => x(d.Date))
//           .attr("y", d => y(Math.max(d.Open, d.Close)))
//           .attr("height", d => Math.abs(y(d.Open) - y(d.Close)))
//           .attr("width", x.bandwidth())
//           .attr("fill", d => d.Open > d.Close ? "red" : "green");

//       // Draw wicks
//       svg.selectAll(".wick")
//           .data(data)
//         .enter().append("line")
//           .attr("x1", d => x(d.Date) + x.bandwidth() / 2)
//           .attr("x2", d => x(d.Date) + x.bandwidth() / 2)
//           .attr("y1", d => y(d.High))
//           .attr("y2", d => y(d.Low))
//           .attr("stroke", "black")
//           .attr("stroke-width", 1);

//       // Add the x Axis
//       svg.append("g")
//           .attr("transform", "translate(0," + height + ")")
//           .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%Y-%m-%d")))
//           .selectAll("text")  
//           .style("text-anchor", "end")
//           .attr("dx", "-.8em")
//           .attr("dy", ".15em")
//           .attr("transform", "rotate(-65)");

//       // Add the y Axis
//       svg.append("g")
//           .call(d3.axisLeft(y));
//   }

//   return chart;
// }

// // You would then call this function with the selector of your SVG container and the data
// // For example:
// // let myChart = candlestickChart();
// // d3.json("path/to/your/data.json").then(data => {
// //     myChart("#yourSvgContainer", data);
// // });
