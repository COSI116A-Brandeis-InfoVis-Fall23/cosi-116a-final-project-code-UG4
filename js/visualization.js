// Immediately Invoked Function Expression to limit access to our 
// variables and prevent 
((() => {

  d3.json("data/BTC17_21.json", (data) => {

    const dispatchString = "selectionUpdated";

    let tableData = table()
      .selectionDispatcher(d3.dispatch(dispatchString))
      ("#table", data);

  });
})());