// Define SVG area dimensions
var svgWidth = 960;
var svgHeight = 660;

// Define the chart's margins as an object
var chartMargin = {
  top: 30,
  right: 30,
  bottom: 30,
  left: 30
};

// Define dimensions of the chart area
var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;

// Select body, append SVG area to it, and set the dimensions
var svg = d3
  .select("body")
  .append("svg")
  .attr("height", svgHeight + 40) // additional padding for 3rd label 
  .attr("width", svgWidth);

// Append a group to the SVG area and shift ('translate') it to the right and down to adhere
// to the margins set in the "chartMargin" object.
var chartGroup = svg.append("g")
  .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);

// Initial Parameters of Scatter Plot
let chosedXAxis = "Proverty";
let chosedYAxis = "healthcare";

// aysync function for cleaner style
(async function(){

    // Load data from data.csv to MMP_data (major metro paper dataset)
    const MMP_data = await d3.csv("assets/data/data.csv");
    
    // parse through data set as numbers
    MMP_data.forEach(function(data){
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
        data.age = +data.age;
        data.smoke = +data.smoke;
        data.obesity = +data.obesity;
        data.income = +data.income;
    });

    // set scale functions
    let xLinearScale = xScale(MMP_data, chosenXAxis);
    let yLinearScale = yScale(MMP_data, chosenYAxis);

    // set axis functions
    let bottomAxis = d3.axisBottom(xLinearScale);
    let leftAxis = d3.axisLeft(yLinearScale);

    // Append x and y axes to chart
    let xAxis = chartGroup.append("g")
        .attr("transform", 'translate(0, ${height})')
        .call(bottomAxis);
    
    let yAxis = chartGroup.append("g")
        .call(leftAxis);
    
        
})


})
