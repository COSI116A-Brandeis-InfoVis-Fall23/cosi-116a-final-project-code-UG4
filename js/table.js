

function table() {
  function chart(selector, data) {
    // Selects the specified DOM element and appends a table to it, or selects the existing one
    let table = d3
      .select(selector)
      .selectAll("table")
      .data([null])
      .join("table")
      .classed("my-table", true);

    let tableHeaders = Object.keys(data[0]);

    // Creates the table header row
    let tr = table
      .selectAll("thead")
      .data([null])
      .join("thead")
      .selectAll("tr")
      .data([null])
      .join("tr");
    tr.selectAll("th")
      .data(tableHeaders)
      .join("th")
      .text((d) => d);

    // Creates the table body
    let tbody = table.selectAll("tbody").data([null]).join("tbody");

    // Binding each row of data to a table row
    let rows = tbody.selectAll("tr").data(data).join("tr");

    // For each row, binding each data value to a table cell
    let cells = rows
      .selectAll("td")
      .data((row) => {
        return tableHeaders.map((column) => {
          let value = row[column];
          if (value instanceof Date) {
            value = value.toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "2-digit",
            });
          }
          return { column: column, value: value };
        });
      })
      .join("td")
      .html((d) => d.value); // Setting the HTML content of each cell to the value
    return chart;
  }

  chart.selectionDispatcher = function (_) {
    if (!arguments.length) return dispatcher;
    dispatcher = _;
    return chart;
  };

  chart.updateSelection = function (selectedData) {
    if (!arguments.length) return;
    console.log(selectedData);
    d3.selectAll("tr").classed("selected", (d) => {
      return selectedData.includes(d);
    });
  };
  return chart;
}
