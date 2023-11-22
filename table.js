/* global D3 */

function table() {

    // Based on Mike Bostock's margin convention
    // https://bl.ocks.org/mbostock/3019563
    let ourBrush = null,
      selectableElements = d3.select(null),
      dispatcher;
  
    // Create the chart by adding an svg to the div with the id 
    // specified by the selector using the given data
    function chart(selector, data) {
        let table = d3.select(selector)
          .append("table")
            .classed("my-table", true);
    
        // Here, we grab the labels of the first item in the dataset
        //  and store them as the headers of the table.
        let tableHeaders = Object.keys(data[0]);
    
        // You should append these headers to the <table> element as <th> objects inside
        // a <th>
        // See https://developer.mozilla.org/en-US/docs/Web/HTML/Element/table
    
        // YOUR CODE HERE
        let tr = table.append('thead').append('tr')
        tr.selectAll('th').data(tableHeaders).enter().append('th').text((d) => d)
    
        // Append a tbody to the table and create a row for each object in the data
        var tbody = table.append('tbody')
        var rows = tbody.selectAll('tr')
        .data(data)
        .enter()
        .append('tr')
        var cells = rows.selectAll('td')
        // For each row, append a td element for each column
        .data((row) => { 
          return tableHeaders.map((column) => { 
            return {column: column, value: row[column]} 
          })
         })
          .enter()
          .append('td')
          .html((d) => d.value)
        return chart;
      };
      
      chart.selectionDispatcher = function (_) {
        if (!arguments.length) return dispatcher;
        dispatcher = _;
        return chart;
      };
    
      // Given selected data from another visualization 
      // select the relevant elements here (linking)
      chart.updateSelection = function (selectedData) {
        if (!arguments.length) return;
    
        // Select an element if its datum was selected
        d3.selectAll('tr').classed("selected", d => {
          return selectedData.includes(d)
        });
      };
    return chart;
}
