

// set the dimensions and margins of the graph
var margin = {top: 20, right: 5, bottom: 10, left: 80},
    width = window.innerWidth*.55,
    height = 6000;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

function datetransform(d) {

    //Format as a "Date" as a date
    return {
        date: d3.timeParse("%Y-%m-%d")(d.Date),
        Disease: +d.Disease,
        Wounds: +d.Wounds,
        Other: +d.Other
    };

}
//Read the data
d3.csv("nightingale.csv", datetransform, function (data) {

    // List of groups (your categories)
    var keys = ["Disease", "Wounds", "Other"];

    // Stack the data
    var stackedData = d3.stack()
        .keys(keys)(data);

    // Add Y axis --> it is a date format
    var y = d3.scaleTime()
        .domain(d3.extent(data, function (d) {
            return d.date;
        }))
        .range([0, height]);
        //.style("font-size", "20px");

    svg.append("g")
        .attr("transform", "translate(0, 0)")
        .call(d3.axisLeft(y)
            .tickFormat(d3.timeFormat("%b %Y"))
            .ticks(24))
        .style("font-size", "17px")
        .style("font-family", "Garamond")
        .attr("font-weight", "bold");

    //.call(d3.axisLeft(y).ticks(24)); // Display number of ticks on y axis

    // Add X axis
    var x = d3.scaleLinear()
        .domain([0, d3.max(stackedData, function (d) {
            return d3.max(d, function (d) {
                return d[1];
            });
        }) * 1.02]) // Adds 2% padding at the top
        .range([0, width]);


    // add y axis
     // svg.append("g")
     //     .attr("transform", "translate(0," + height + ")")
     //     .call(d3.axisBottom(x).ticks(40)); // Display number of ticks on X axis

    // Add the stacked areas
    var color = d3.scaleOrdinal()
        .domain(keys)
        .range(["#738c8c", "#d2aeac", "#2c2a2b"]);

    myChart = svg.selectAll(".area")
        .data(stackedData)
        .enter()
        .append("path")
        .attr("class", ["area"])
        .attr("fill", function (d) {
            return color(d.key);
        })
        .attr("d", d3.area()
            .x0(function (d) {
                return x(d[0]);
            }) // Use x for the start of the area
            .x1(function (d) {
                return x(d[1]);
            }) // Use x for the end of the area
            .y(function (d) {
                return y(d.data.date);
            }) // Use y for the date
        );

});
