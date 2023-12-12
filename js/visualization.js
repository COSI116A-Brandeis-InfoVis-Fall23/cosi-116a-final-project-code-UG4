

let selectedDataSource = "BTC-USD"; // set the initial data source 

// A function to draw both chart and table based on the selected data source
const drawChartAndTable = async (dataSource) => {
  let timePeriod;
  let timePeriodName;

  // Check which time period is selected ('daily', 'weekly', 'monthly') and set the corresponding file path
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

  // Load the appropriate CSV data for the selected data source and time period using D3
  const data = await d3.csv(`data/csv/${dataSource}/${timePeriod}.csv`);

  // Determine the date format for parsing based on the data source and time period
  let parseDate;
  if (dataSource === "HGX" && timePeriod === "Weekly_17-20") {
    parseDate = d3.timeParse("%m/%d/%Y");
  } else if (dataSource === "DJI") {
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

  const dispatchString = "selectionUpdated";
  // Sort the data to ensure proper ordering in the chart and table
  const sortedData = data.sort((a, b) => a.Date - b.Date);

  // Create and configure the chart with the sorted data
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

  // Create and configure the table with the sorted data
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

// Event listeners for the data source selection and time period radio buttons
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
