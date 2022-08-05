var main = d3.select("main");
var scrolly = main.select("#scrolly");
var figure = scrolly.select("figure");
var article = scrolly.select("article");
var step = article.selectAll(".step");

// initialize the scrollama
var scroller = scrollama();

// generic window resize listener event
function handleResize() {
    // 1. update height of step elements
    var stepH = Math.floor(window.innerHeight * 0.8);
    step.style("height", stepH + "px");

    var figureHeight = window.innerHeight * 0.8;
    var figureMarginTop = (window.innerHeight - figureHeight)/ 2 ;

    figure
        .style("height", figureHeight + "px")
        .style("top", figureMarginTop + "px");

    // 3. tell scrollama to update new element dimensions
    scroller.resize();
}
    function show(selector) {
        d3.selectAll(selector)
            .transition()
            .duration(200)
            .attr("opacity", 1)
    }
    // this function hides the element passed to it by setting opacity to 0
    function hide(selector) {
        d3.selectAll(selector)
            .transition()
            .duration(200)
            .attr("opacity", 0)
    }

// scrollama event handlers
function handleStepEnter(response) {
    console.log(response);
    // response = { element, direction, index }

    // add color to current step only
    step.classed("is-active", function (d, i) {
        return i === response.index;
    });

    // update graphic based on step
    if (response.index === 0) {
        drawbotChart();
        d3.select("#botninetyaxis").classed('hidden', false)    
        d3.select("#botninetyline").classed('hidden', false)   
        d3.selectAll("#topfiveaxis").classed('hidden', true)    
        d3.selectAll("#topfiveline").classed('hidden', true)   
        d3.selectAll("#toponeaxis").classed('hidden', true)    
        d3.selectAll("#toponeline").classed('hidden', true)  
        d3.selectAll("#botninetyline5").classed('hidden', true)    
        d3.selectAll("#botninetyline1").classed('hidden', true)    
        d3.selectAll("#topfiveline1").classed('hidden', true)  
 
    }

    if (response.index === 1) {
        drawfiveChart();
        d3.selectAll("#botninetyaxis").classed('hidden', true)    
        d3.selectAll("#botninetyline").classed('hidden', true)   
        d3.selectAll("#topfiveaxis").classed('hidden', false)  
        d3.select("#botninetyline5").classed('hidden', false)    
        d3.select("#topfiveline").classed('hidden', false)   
        d3.selectAll("#toponeaxis").classed('hidden', true)    
        d3.selectAll("#toponeline").classed('hidden', true)
        d3.selectAll("#botninetyline1").classed('hidden', true)    
        d3.selectAll("#topfiveline1").classed('hidden', true)  

    }
    
    if (response.index === 2) {
        drawoneChart();
        d3.selectAll("#botninetyaxis").classed('hidden', true)    
        d3.selectAll("#botninetyline").classed('hidden', true)   
        d3.selectAll("#topfiveaxis").classed('hidden', true)  
        d3.selectAll("#botninetyline5").classed('hidden', true)    
        d3.selectAll("#topfiveline").classed('hidden', true)   
        d3.selectAll("#topfiveaxis").classed('hidden', true)    
        d3.select("#botninetyline1").classed('hidden', false)    
        d3.select("#topfiveline1").classed('hidden', false)  
        d3.selectAll("#toponeaxis").classed('hidden', false)    
        d3.selectAll("#toponeline").classed('hidden', false)   
    }

    // figure.select("p").text(response.index + 1);

}

// format dollar signs on axes
var dollarFormat = function(d) { return '$' + d3.format(',.0f')(d) };


// draw axes and the line for bottom ninety percent
function drawbotChart() {
    const svg = d3.select("svg")
    
    svg
        .attr("viewBox", "0 0 960 960")

    var figureMarginTop = (window.innerHeight - (window.innerHeight*0.8))/ 2 ;

    var max = d3.max(data, d => +d.botninety)

    const titleText = svg 
        .append("text")
        .attr("class", "titletext")
        .attr("transform", "translate(480,30)")
        .attr("text-anchor", "middle")
        .text("Pay for the top 0.1%, 5%, and bottom 90%, 1947-2020")

    titleText

    const dateScale = d3.scaleTime()
        .domain([1947, 2020])
        .range([60, 900])

    const yScale = d3.scaleLinear()
        .domain([0, max])
        .range([450, 50])

    const ninetylineGenerator = d3
        .line()
        .x((d,i) => { return dateScale(d.year) })
        .y((d,i) => { return yScale(d.botninety) })
        
    const dateAxis = d3.axisBottom(dateScale)
        .tickFormat((d,i) => { return d })
        .tickFormat(d3.format('.0f'))
        .tickSizeOuter(0)

    const wageAxis = d3.axisLeft(yScale)
        .tickFormat(dollarFormat)
        // .tickValues([425000, 850000, 1275000, 1700000, 2125000, 2550000, 2975000, 3400000])
        // .tickSize(5)
        // .tickSizeOuter(0)
        // .tickPadding(5)

    svg 
        .append("g")
        .attr("transform", "translate(0,450)")
        .call(dateAxis)

    svg
        .append("path")
        .datum(data)
        .attr("class", "line")
        .attr("id", "botninetyline")
        .attr("d", ninetylineGenerator)
        .style("opacity", 0) // fade in
        .transition()
        .duration(600)
        .style("opacity", 1)

    svg 
        .append("g")
        .attr("transform", "translate(60,0)")
        .attr("id","botninetyaxis")
        .call(wageAxis)

    
}

// draw the line for top five percent

function drawfiveChart() {
    const svg = d3.select("svg")
    svg.attr("viewBox", "0 0 960 960")
    
    var max = d3.max(data, d => +d.topfive)

    const dateScale = d3.scaleTime()
        .domain([1947, 2020])
        .range([60, 900])

    const yScale = d3.scaleLinear()
        .domain([0, max])
        .range([450, 50])

    const wageAxis = d3.axisLeft(yScale)
        .tickFormat(dollarFormat)


    const fivelineGenerator = d3
        .line()
        .x((d,i) => { return dateScale(d.year) })
        .y((d,i) => { return yScale(d.topfive) })

    const ninetylineGenerator = d3
        .line()
        .x((d,i) => { return dateScale(d.year) })
        .y((d,i) => { return yScale(d.botninety) })


    svg
        .append("path")
        .datum(data)
        .attr("class", "line")
        .attr("id", "botninetyline5")
        .attr("d", ninetylineGenerator)
        .style("opacity",0) // fade in
        .transition()
        .duration(600)
        .style("opacity", 1)

    svg
        .append("path")
        .datum(data)
        .attr("class", "line")
        .attr("id", "topfiveline")
        .attr("d", fivelineGenerator)
        .style("opacity",0) // fade in
        .transition()
        .duration(600)
        .style("opacity", 1)

    svg 
        .append("g")
        .attr("transform", "translate(60,0)")
        .attr("id","topfiveaxis")
        .call(wageAxis)
    
}

function drawoneChart() {
    const svg = d3.select("svg")
    svg.attr("viewBox", "0 0 960 960")

    var max = d3.max(data, d => +d.topone)

    const dateScale = d3.scaleTime()
        .domain([1947, 2020])
        .range([60, 900])

    const yScale = d3.scaleLinear()
        .domain([0, max])
        .range([450, 50])

    const wageAxis = d3.axisLeft(yScale)
        .tickFormat(dollarFormat)

    const ninetylineGenerator = d3
        .line()
        .x((d,i) => { return dateScale(d.year) })
        .y((d,i) => { return yScale(d.botninety) })

    const fivelineGenerator = d3
        .line()
        .x((d,i) => { return dateScale(d.year) })
        .y((d,i) => { return yScale(d.topfive) })

    const onelineGenerator = d3
        .line()
        .x((d,i) => { return dateScale(d.year) })
        .y((d,i) => { return yScale(d.topone) })


    svg
        .append("path")
        .datum(data)
        .attr("class", "line")
        .attr("id", "botninetyline1")
        .attr("d", ninetylineGenerator)
        .style("opacity",0) // fade in
        .transition()
        .duration(600)
        .style("opacity", 1)

    svg
        .append("path")
        .datum(data)
        .attr("class", "line")
        .attr("id", "topfiveline1")
        .attr("d", fivelineGenerator)
        .style("opacity",0) // fade in
        .transition()
        .duration(600)
        .style("opacity", 1)
    
    svg
        .append("path")
        .datum(data)
        .attr("class", "line")
        .attr("id", "toponeline")
        .attr("d", onelineGenerator)
        .style("opacity",0) // fade in
        .transition()
        .duration(600)
        .style("opacity", 1)

    svg 
        .append("g")
        .attr("transform", "translate(60,0)")
        .attr("id","toponeaxis")
        .call(wageAxis)
    
}


function init() {

    // 1. force a resize on load to ensure proper dimensions are sent to scrollama
    handleResize();

    // 2. setup the scroller passing options
    // 		this will also initialize trigger observations
    // 3. bind scrollama event handlers (this can be chained like below)
    scroller
        .setup({
            step: "#scrolly article .step",
            offset: 0.33,
            debug: false
        })
        .onStepEnter(handleStepEnter);
}

// kick things off
init();
