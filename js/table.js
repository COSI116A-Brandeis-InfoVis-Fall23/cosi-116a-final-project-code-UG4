/* global D3 */

function table() {
  let ourBrush = null,
    selectableElements = d3.select(null),
    dispatcher;
  function chart(selector, data) {
    let table = d3
      .select(selector)
      .selectAll("table")
      .data([null])
      .join("table")
      .classed("my-table", true);

    let tableHeaders = Object.keys(data[0]);

    let tr = table
      .selectAll("thead")
      .data([null])
      .join("thead")
      .selectAll("tr")
      .data([null])
      .join("tr");
    tr.selectAll("th")
      .data(tableHeaders)
      .enter()
      .append("th")
      .text((d) => d);

    var tbody = table.selectAll("tbody").data([null]).join("tbody");
    var rows = tbody.selectAll("tr").data(data).join("tr");
    var cells = rows
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
      .html((d) => d.value);
    return chart;
  }

  chart.selectionDispatcher = function (_) {
    if (!arguments.length) return dispatcher;
    dispatcher = _;
    return chart;
  };

  chart.updateSelection = function (selectedData) {
    if (!arguments.length) return;

    d3.selectAll("tr").classed("selected", (d) => {
      return selectedData.includes(d);
    });
  };
  return chart;
}
