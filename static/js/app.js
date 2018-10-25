// from data.js
//var tableData = data;
//Get the table
var table = d3.select('#ufo-table');

// var columns = ["datetime", "city", "state", "country", "shape", "comment"]
var columns = d3.keys(data[0])
/**
* buildheader.
*
* Description. Build the header
*
* @return {type} none.
*/
var once = function buildheader() {
    //Append table head
        var thead = table.append('thead')

        // append the header row
        table.select("thead").append('tr')
          .selectAll('th')
          .data(columns).enter()
          .append('th')
          .text(function (column) { return column; });
      }

/**
* buildTable.
*
* Description. Build table according to selection
*
* @tableData {type}   var  list of data.
*
* @return {type} none.
*/
function buildTable(tableData){

    //Build the header one time
    if (!once.done) {
        once();
        once.done = true;
        console.log("doing this once")
    }

    console.log(tableData)
    table.select('tbody').remove()
    var	tbody = table.append('tbody');
    // create a row for each object in the data
    var rows = tbody.selectAll('tr')
        .data(tableData)
        .enter()
        .append('tr');

        // create a cell in each row for each column
	var cells = rows.selectAll('td')
		.data(function (row) {
		          return columns.map(function (column) {
		                    return {column: column, value: row[column]};
		                      });
		    })
		  .enter()
		  .append('td')
		  .text(function (d) { return d.value; });
}

/**
 * Button click: Handle button clieck event.
 *
 * Description.
 *
 * @return {type} none.
 */
d3.select('#filter-btn')
   .on("click", function(){
    // Prevent the page from refreshing
        d3.event.preventDefault();
        //get input
        var value = d3.select("#input-value")
                      .property("value")
        console.log("Value " + value)
        var selection = d3.select('#Drop-down')
                          .property('value')

        filterData(selection, value);
})

/**
 * DropDown Select.
 *
 * Description.
 *
 * @return {type} none.
 */
d3.select('#Drop-down')
  .on('change', function() {
    var selection = d3.select(this).property('value');

    d3.select("#input-value")
        .property("value", "")
        .property("placeholder", function(){
            if (selection == 'datetime')
                return "1/11/2011";
            else
                return selection;
        })
});


/**
 * Filters the data.
 *
 * Description.
 *
  * @selection {type}   var          Selection on Drop Down.
 * @value {type}   [var]        User Entered value.
 *
 * @return {type} none.
 */
function filterData(selection, value){
    //Validate input
    var dateFormat = "D/M/YYYY";
    var newdata = data
    console.log("filterdata: " + selection + " Value " + value)
    if (selection == 'datetime'){
        //validate the date
        if (!(moment(value, "D/M/YYYY", true).isValid() || moment(value, "D/MM/YYYY", true).isValid())) {
            d3.select("#error").text("Date is NOT valid");
            d3.select("#input-value")
                .property("value", "")
                .property("placeholder", "1/11/2011");
            //If invalid data show all
            buildTable(data)
            return;
        }
    }

    //Filter the data
    //Filter the data
    var newdata = data.filter(function(d){
        if (value === "") return data;
        return d[selection].toLowerCase() == value.toLowerCase()
    })
    buildTable(newdata)
}

// Display the table header and data
// buildheader()
buildTable(data)
