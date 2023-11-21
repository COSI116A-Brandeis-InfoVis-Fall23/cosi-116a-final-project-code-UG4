// Immediately Invoked Function Expression to limit access to our 
// variables and prevent 
((() => {

  d3.json("data/NASDAQ17_21.json", (data) => {

    const dispatchString = "selectionUpdated";

    let myChart = chart();
    myChart("#chart", data);


    let tableData = table()
      .selectionDispatcher(d3.dispatch(dispatchString))
      ("#table", data);

  });
   





  // d3.json("data/BTC17_21.json", (data) => {

  //   const dispatchString = "selectionUpdated";
  //   data.forEach(d => {
  //     d.Date = new Date(d.Date);
  //     d.Open = +d.Open;
  //     d.High = +d.High;
  //     d.Low = +d.Low;
  //     d.Close = +d.Close;
  //     d['Adj Close'] = +d['Adj Close'];
  //     d.Volume = +d.Volume;
  //   });
  
  //   // Now you can use this data with your chart
  //   const myChart = chart()
  //     .width(500)
  //     .height(300)
  //     .ticker(data);
  
  //   // Append the chart to an SVG element
  //   const svg = d3.select('#chart').append('svg');
  //   myChart(svg);
  // }).catch(error => {
  //   console.error('Error loading or parsing data:', error);
  // });


})());