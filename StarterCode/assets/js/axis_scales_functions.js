// functions used to update axis and scales based on selections

// function used for updating x-scale const when clicked on axis label
function xScale(csvData, chosenXAxis) {
    // create scales
    let xLinearScale = d3.scaleLinear()
        .domain([d3.min(csvData, d => d[chosenXAxis]) * 0.8,
            d3.max(csvData, d => d[chosenXAxis]) * 1.2])
        .range([0, chartWidth]);
    return xLinearScale;
}

// function used for updating y-scale const when click on axis label
function yScale(csvData, chosenYAxis) {
    // create scales
    let yLinearScale = d3.scaleLinear()
        .domain([d3.min(csvData, d => d[chosenYAxis]) * 0.8,
            d3.max(csvData, d => d[chosenYAxis]) *1.2])
        .range([chartHeight, 0]);

return yLinearScale;
}

// function to update xAxis const when click on axis label
function renderXAxes(newXScale, xAxis) {
    let bottomAxis = d3.axisBottom(newXScale);

    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);

    return xAxis;
}

// function to update yAxis const when click on axis label
function renderYAxes(newYScale, yAxis) {
    let leftAxis = d3.axisBottom(newYScale);

    yAxis.transition()
        .duration(1000)
        .call(leftAxis);

    return yAxis;
}

// function to update circle group with transition to new cirlces for X and Y coordinates
function renderXCircles(circlesGroup, newXScale, chosenXAxis) {

    circlesGroup.transition()
        .duration(750)
        .attr("cx", d => newXScale(d[chosenXAxis]));
    
    return circlesGroup;
}

// function to update circles text with transition from new circles X and Y coordinates
function renderYCircles(circlesGroup, newYScale, chosenYAxis) {

    circlesGroup.transition()
        .duration(750)
        .attr("cy", d => newYScale(d[chosenYAxis]));
    
    return circlesGroup;
}

// function to update circles text for XCircles and YCircles
function renderXText(circlesGroup, newXScale, chosenXAxis) {

    circlesGroup.transition()
      .duration(1000)
      .attr("dx", d => newXScale(d[chosenXAxis]));
  
    return circlesGroup;
}
  
function renderYText(circlesGroup, newYScale, chosenYAxis) {
  
    circlesGroup.transition()
      .duration(1000)
      .attr("dy", d => newYScale(d[chosenYAxis])+5);
  
    return circlesGroup;
}

// format numbers to USD
let formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

// function to update circle groups tooltip
function updateToolTip(circlesGroup, chosenXAxis, chosenYAxis) {

    let xpercentsign = "";
    let xlabel = "";
    if (chosenXAxis === "poverty") {
      xlabel = "Poverty";
      xpercentsign = "%";
    } else if (chosenXAxis === "age"){
      xlabel = "Age";
    } else {
      xlabel = "Income";
    }
  
    let ypercentsign = "";
    let ylabel = "";
    if (chosenYAxis === "healthcare") {
      ylabel = "Healthcare";
      ypercentsign = "%";
    } else if (chosenYAxis === "smokes"){
      ylabel = "Smokes";
      ypercentsign = "%";
    } else {
      ylabel = "Obesity";
      ypercentsign = "%";
    }
  
    const toolTip = d3.tip()
      .attr("class", "d3-tip")
      .offset([50, -75])
      .html(function(d) {
        if (chosenXAxis === "income"){
            let incomelevel = formatter.format(d[chosenXAxis]);
  
            return (`${d.state}<br>${xlabel}: ${incomelevel.substring(0, incomelevel.length-3)}${xpercentsign}<br>${ylabel}: ${d[chosenYAxis]}${ypercentsign}`)
        } 
        else {
            return (`${d.state}<br>${xlabel}: ${d[chosenXAxis]}${xpercentsign}<br>${ylabel}: ${d[chosenYAxis]}${ypercentsign}`)
        };
      });
  
    circlesGroup.call(toolTip);
  
    // mouseover event
    circlesGroup.on("mouseover", function(data) {
        toolTip.show(data, this);
    })
      // onmouseout event
      .on("mouseout", function(data) {
          toolTip.hide(data, this);
      });
  
  return circlesGroup;
}
  
