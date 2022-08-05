      d3.select("#g-wageschart_svg-box").classed("hidden", true)
      
      function hideNote() {
        // annotation: #path-1, #text-1, #path-2, #text-2
        d3.select("#path-1").classed('hidden', true)
        d3.select("#text-1").classed('hidden', true)
        d3.select("#path-2").classed('hidden', true)
        d3.select("#text-2").classed('hidden', true)
      }
      
      hideNote()

      d3.select("#step-one").on('stepout', function(e) {
        if(e.detail.direction === 'up') {
          // undo the changes from step one
          hideNote()
        }
      })

      d3.select("#step-one").on('stepin', function(e) {
        console.log("Got to step one")
        // undo changes from step two
        d3.selectAll("[data-name='africa'] path").style('stroke', 'none')

        // do changes for step one
        d3.select("#path-1").classed('hidden', false)
        d3.select("#text-1").classed('hidden', false)
        d3.select("#path-2").classed('hidden', false)
        d3.select("#text-2").classed('hidden', false)
      })

      d3.select("#step-two").on('stepin', function(e) {

        // undo changes from step one
        hideNote()

        // do changes for step two
        console.log("Got to step two")
        d3.selectAll("[data-name='africa'] path").style('stroke', 'black')
      })

      d3.select("#step-three").on('stepin', function(e) {
        // undo changes from step two
        d3.selectAll("[data-name='africa'] path").style('stroke', 'none')
      })


// start of somethign newwwwwww


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
          var stepH = Math.floor(window.innerHeight * 0.75);
          step.style("height", stepH + "px");
      
          var figureHeight = window.innerHeight * 0.8;
          var figureMarginTop = (window.innerHeight - figureHeight)/ 2 ;
      
          figure
              .style("height", figureHeight + "px")
              .style("top", figureMarginTop + "px");
      
          // 3. tell scrollama to update new element dimensions
          scroller.resize();
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
          }
      
          if (response.index === 1) {
              drawfiveChart();
          }
          
          if (response.index === 2) {
              drawoneChart();
          }
      
          // figure.select("p").text(response.index + 1);
      
      }
      
      // draw axes and the line for bottom ninety percent
      function drawbotChart() {
          const svg = d3.select("svg")
          
          svg
              .attr("viewBox", "0 0 960 960")
      
          var figureMarginTop = (window.innerHeight - (window.innerHeight*0.8))/ 2 ;
      
          var max = d3.max(data, d => +d.botninety)
      
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
              .tickFormat((d,i) => { return d.year})
              .tickSizeOuter(0)
      
          const wageAxis = d3.axisLeft(yScale)
              // .tickValues([425000, 850000, 1275000, 1700000, 2125000, 2550000, 2975000, 3400000])
              // .tickSize(5)
              // .tickSizeOuter(0)
              // .tickPadding(5)
      
          svg 
              .append("g")
              .attr("transform", "translate(0,450)")
              .call(dateAxis)
              .style("top", figureMarginTop + "px");
      
          svg 
              .append("g")
              .attr("transform", "translate(60,0)")
              .call(wageAxis)
              .style("top", figureMarginTop + "px");
      
          svg
              .append("path")
              .datum(data)
              .attr("class", "line")
              .attr("id", "botninetyline")
              .attr("d", ninetylineGenerator)
              .style("opacity",0) // fade in
              .transition()
              .duration(600)
              .style("opacity", 1)
      
          
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
      
          const fivelineGenerator = d3
              .line()
              .x((d,i) => { return dateScale(d.year) })
              .y((d,i) => { return yScale(d.topfive) })
      
          const ninetylineGenerator = d3
              .line()
              .x((d,i) => { return dateScale(d.year) })
              .y((d,i) => { return yScale(d.botninety) })
          
          svg 
              .append("g")
              .attr("transform", "translate(60,0)")
              .call(wageAxis)
              // .style("top", figureMarginTop + "px");
      
          svg
              .append("path")
              .datum(data)
              .attr("class", "line")
              .attr("id", "botninetyline")
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
              .attr("transform", "translate(0,50)")
              .style("opacity",0) // fade in
              .transition()
              .duration(600)
              .style("opacity", 1)
          
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
              .append("g")
              .attr("transform", "translate(60,0)")
              .call(wageAxis)
              // .style("top", figureMarginTop + "px");
      
          svg
              .append("path")
              .datum(data)
              .attr("class", "line")
              .attr("id", "botninetyline")
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
              .attr("transform", "translate(0,50)")
              .style("opacity",0) // fade in
              .transition()
              .duration(600)
              .style("opacity", 1)
          
          svg
              .append("path")
              .datum(data)
              .attr("class", "line")
              .attr("id", "topfiveline")
              .attr("d", onelineGenerator)
              .attr("transform", "translate(0,50)")
              .style("opacity",0) // fade in
              .transition()
              .duration(600)
              .style("opacity", 1)
          
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
      