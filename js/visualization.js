// Immediately Invoked Function Expression to limit access to our 
// variables and prevent 
((() => {
  let dataFile = "data/temp.json";
  // Bisrat: Pick the right dataFile depending on which radio button (daily, weekly or monthly)  is selected
  function updateDataFile() {
    d3.select('#vis-svg').selectAll("*").remove();
    d3.select('#table').selectAll("*").remove();

    if (document.getElementById("daily").checked) {
      dataFile = "data/temp.json"; 
    } else if (document.getElementById("weekly").checked) {
      dataFile = "data/temp2.json"; 
    } else if (document.getElementById("monthly").checked) {
      dataFile = "data/temp3.json";
    }
    d3.json(dataFile, (data) => {

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
    
      myChart.selectionDispatcher().on(dispatchString, function(selectedData) {
          tableData.updateSelection(selectedData);
        });
    
    });
  }
  document.getElementById("daily").addEventListener("change", updateDataFile);
  document.getElementById("weekly").addEventListener("change", updateDataFile);
  document.getElementById("monthly").addEventListener("change", updateDataFile);

  updateDataFile();


  
})());