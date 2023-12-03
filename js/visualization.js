// Immediately Invoked Function Expression to limit access to our
// variables and prevent

let selectedDataSource = "BTC-USD";
const drawChartAndTable = async (dataSource) => {
  let timePeriod;
  let timePeriodName;
  if (document.getElementById("daily").checked) {
    timePeriodName = "daily";
    timePeriod =
      dataSource === "HGX" || dataSource === "QQQ"
        ? "Daily_17-21"
        : "Daily_17-20";
  } else if (document.getElementById("weekly").checked) {
    timePeriodName = "weekly";
    timePeriod = "Weekly_17-20";
  } else if (document.getElementById("monthly").checked) {
    timePeriodName = "monthly";
    timePeriod = "Monthly_17-20";
  }
  const data = await d3.csv(`data/csv/${dataSource}/${timePeriod}.csv`);

  let parseDate;
  if (dataSource === "HGX" && timePeriod === "Weekly_17-20") {
    parseDate = d3.timeParse("%m/%d/%Y");
  } else if (dataSource === "DJI") {
    parseDate = d3.timeParse("%m/%d/%Y");
  } else if (dataSource === "SPX" && timePeriod === "Daily_17-20") {
    parseDate = d3.timeParse("%m/%d/%y");
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

  const dispatchString = "selectionUpdated";

  const sortedData = data.sort((a, b) => a.Date - b.Date);
  let myChart = chart()
    .xLabel("Date")
    .yLabel("Market Price")
    .yLabelOffset(0)
    .selectionDispatcher(d3.dispatch(dispatchString))(
    "#chart",
    sortedData,
    dataSource,
    timePeriodName
  );

  let tableData = table().selectionDispatcher(d3.dispatch(dispatchString))(
    "#table",
    sortedData
  );
  myChart.selectionDispatcher().on(dispatchString, function (selectedData) {
    tableData.updateSelection(selectedData);
  });
};

const datasetSelect = document.getElementById("dataSelect");
datasetSelect.value = selectedDataSource;

drawChartAndTable(selectedDataSource);

datasetSelect.addEventListener("change", function () {
  selectedDataSource = this.value;
  // Function to update the chart
  drawChartAndTable(selectedDataSource);
});

document.getElementById("daily").addEventListener("change", () => {
  drawChartAndTable(selectedDataSource);
});
document.getElementById("weekly").addEventListener("change", () => {
  drawChartAndTable(selectedDataSource);
});
document.getElementById("monthly").addEventListener("change", () => {
  drawChartAndTable(selectedDataSource);
});
