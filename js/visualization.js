// Immediately Invoked Function Expression to limit access to our
// variables and prevent
const drawChartAndTable = async (dataPath) => {
  const data = await d3.csv(`data/${dataPath}`);

  let parseDate;
  if (dataPath === "S_P500.csv") {
    parseDate = d3.timeParse("%m/%d/%y");
  } else if (dataPath === "Dow_Jones.csv") {
    parseDate = d3.timeParse("%m/%d/%Y");
  } else {
    parseDate = d3.timeParse("%Y-%m-%d");
  }

  data.forEach(function (d) {
    d.Date = parseDate(d.Date);
    d.Open = +d.Open;
    d.High = +d.High;
    d.Low = +d.Low;
    d.Close = +d.Close;
  });

  const sortedData = data.sort((a, b) => d3.ascending(a.Date, b.Date));
  const dispatchString = "selectionUpdated";
  let myChart = chart()
    .xLabel("Date")
    .yLabel("Market Price")
    .yLabelOffset(0)
    .selectionDispatcher(d3.dispatch(dispatchString))("#chart", sortedData);

  let tableData = table().selectionDispatcher(d3.dispatch(dispatchString))(
    "#table",
    sortedData
  );
};

const datasetSelect = document.getElementById("dataSelect");
datasetSelect.value = "BTC17_21.csv";

drawChartAndTable("BTC17_21.csv");

datasetSelect.addEventListener("change", function () {
  var selectedFile = this.value;
  // Function to update the chart
  drawChartAndTable(selectedFile);
});
