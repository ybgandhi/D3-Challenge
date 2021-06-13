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

// append div class to the scatter element
let chart = d3.select('scatter')
    .append('div')
    .classed('chart', true);


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
let chosenXAxis = "Proverty";
let chosenYAxis = "Healthcare";

// aysync function for cleaner style - chart script
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
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(bottomAxis);
    
    let yAxis = chartGroup.append("g")
        .call(leftAxis);
    
    // create Scatterplot and append initial citcles
    let circlesGroup = chartGroup.select("g circle")
        .data(MMP_data)
        .enter()
        .append("g");
    
    let circlesXY = circlesGroup.append("circle")
        .attr("cx", d=> xLinearScale(d[chosenXAxis]))
        .attr("cy", d=> yLinearScale(d[chosenYAxis]))
        .attr("r", 15)
        .classed("stateCircle", true);

    let circleText = circlesGroup.append("text")
        .text(d => d.abbr)
        .attr("dx", d=> xLinearScale(d[chosenXAxis]))
        .attr("dy", d=> yLinearScale(d[chosenYAxis])+ 5)
        .classed("stateText", "true");

    // create group for 3 x-axis labels
    const xlabelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${chartWidth / 2}, ${chartHeight})`);
    
    const povertyLabel = xlabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "poverty") // value to grab for event listener
        .text("In Poverty (%)")
        .classed("active", true);
    
    const ageLabel = xlabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 60)
        .attr("value", "age") // value to grab for event listener
        .text("Age (Median)")
        .classed("inactive", true);
    
    const incomeLabel = xlabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 80)
        .attr("value", "income") // value to grab for event listener
        .text("Household Income (Median)")
        .classed("inactive", true);
    
    // Create group for 3 y-axis labels
    const ylabelsGroup = chartGroup.append("g");

    const healthcareLabel = ylabelsGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -(chartHeight / 2))
        .attr("y", -40)
        .attr("value", "healthcare") // value to grab for event listener
        .text("Lacks Healthcare (%)")
        .classed("active", true);

    const smokesLabel = ylabelsGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -(chartHeight / 2))
        .attr("y", -60)
        .attr("value", "smokes") // value to grab for event listener
        .text("Smokes (%)")
        .classed("inactive", true);

    const obeseLabel = ylabelsGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -(chartHeight / 2))
        .attr("y", -80)
        .attr("value", "obesity") // value to grab for event listener
        .text("Obese (%)")
        .classed("inactive", true);
    // initial tooltips
    circlesGroup = updateToolTip(circlesGroup, chosenXAxis, chosenYAxis);

    // x axis event listener script
    xlabelsGroup.selectAll("text")
        .on("click",function(){
        // get value of selection
        const value = d3.select(this).attr("value");
        if (value !== chosenXAxis) {

            // replaces chosenAxis with value
            chosenXAxis = value;

            // update x scale for new data
            xLinearScale = xScale(MMP_data, chosenXAxis);

            // update x axis with transition
            xAxis = renderXAxes(xLinearScale, xAxis);

            // update circles with x values
            circlesXY = renderXCircles(circlesXY, xLinearScale, chosenXAxis);

            // update circles text with x values
            circlesText = renderXText(circlesText, xLinearScale, chosenXAxis);

            // update tooltups with respective x value information
            circlesGroup = updateToolTip(circlesGroup, chosenXAxis, chosenYAxis);

            // changes classes to cahnge bold text
            if (chosenXAxis === "age") {
                povertyLabel
                    .classed("active",false)
                    .classed("inactive", true);
                ageLabel
                    .classed("active",true)
                    .classed("inactive", false);
                incomeLabel
                    .classed("active",false)
                    .classed("inactive", true);
            }
            else if (chosenXAxis === "income"){
                povertyLabel
                    .classed("active",false)
                    .classed("inactive", true);
                ageLabel
                    .classed("active",false)
                    .classed("inactive", true);
                incomeLabel
                    .classed("active",true)
                    .classed("inactive", false);
            }
            else {
                povertyLabel
                    .classed("active",true)
                    .classed("inactive", false);
                ageLabel
                    .classed("active",false)
                    .classed("inactive", true);
                incomeLabel
                    .classed("active",false)
                    .classed("inactive", true); 
            }
        }
    });
    
    // y axis event listener script
    ylabelsGroup.selectAll("text")
        .on("click", function(){
        // get value of selection
        const value = d3.select(this).attr("value");
        if (value !== chosenYAxis) {

            // replace chosenYAxis with value
            chosenYAxis = value;

            // update y scale for data and axis with transition
            yLinearScale = yScale(MMP_data, chosenYAxis);
            yAxis = renderYAxes(yLinearScale, yAxis);

            // update circles with y value and text respective to y value 
            circlesXY = renderYCircles(circlesXY, yLinearScale, chosenYAxis);
            circlesText = renderYText(circlesText, yLinearScale, chosenYAxis);

            // update tooltips with info
            circlesGroup = updateToolTip(circlesGroup, chosenXAxis,chosenYAxis);

            // changes classes to update text to bold
            if (chosenYAxis ==="smoke") {
                healthcareLabel
                    .classed("active", false)
                    .classed("inactive", true);
                smokesLabel
                    .classed("active", true)
                    .classed("inactive", false);
                obeseLabel
                    .classed("active", false)
                    .classed("inactive", true);
            }
            else if (chosenYAxis === "obesity") {
                healthcareLabel
                .classed("active", false)
                .classed("inactive", true);
                smokesLabel
                .classed("active", false)
                .classed("inactive", true);
                obeseLabel
                .classed("active", true)
                .classed("inactive", false);   
            }
            else {
                healthcareLabel
                .classed("active", true)
                .classed("inactive", false);
                smokesLabel
                .classed("active", false)
                .classed("inactive", true);
                obeseLabel
                .classed("active", false)
                .classed("inactive", true);   
            }
        }
    });
})()



