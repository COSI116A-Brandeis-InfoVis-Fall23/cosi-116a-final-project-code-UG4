// Immediately Invoked Function Expression to limit access to our 
// variables and prevent 
((() => {

  d3.json("data/temp.json", (data) => {

    const dispatchString = "selectionUpdated";

    let myChart = chart()
      .xLabel("Date")
      .yLabel("Market Price")
      .yLabelOffset(0)
      .selectionDispatcher(d3.dispatch(dispatchString))
      ("#chart", data);

    let tableData = table()
      .selectionDispatcher(d3.dispatch(dispatchString))
      ("#table", data);

  });
})());