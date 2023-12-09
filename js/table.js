/* global D3 */

function table() {
  // let ourBrush = null,
  //   selectableElements = d3.select(null),
  //   dispatcher;
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
      .join("th")
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

    // Bisrat: Brushing and Linking
    let mouseDown = false; // Keeps track of whether the mouse is down or not
    rows.on("mouseover", (d, i, elements) => {
      // When the mouse is over a row
      if (mouseDown) {
        d3.select(elements[i]).classed("selected", true);
        let dispatchString = Object.getOwnPropertyNames(dispatcher._)[0];
        dispatcher.call(
          dispatchString,
          this,
          table.selectAll(".selected").data()
        );
      }
    });
    rows.on("mousedown", (d, i, elements) => {
      // When the mouse is down on a row
      d3.selectAll(".selected").classed("selected", false);
      mouseDown = true;
      d3.select(elements[i]).classed("selected", true);
      let dispatchString = Object.getOwnPropertyNames(dispatcher._)[0];
      dispatcher.call(
        dispatchString,
        this,
        table.selectAll(".selected").data()
      );
    });
    rows.on("mouseup", (d, i, elements) => {
      // when the mouse is up assign false to mouseDown
      mouseDown = false;
    });

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
