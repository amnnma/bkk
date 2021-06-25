
var w = 1800;
var h = 2000;
var svg = d3.select("div#container").append("svg").attr("preserveAspectRatio", "xMinYMin meet").style("background-color","white")
.attr("viewBox", "0 0 " + w + " " + h)
.classed("svg-content", true);
    

var color = d3.scaleThreshold()
              .domain([1, 10, 50, 100, 150, 200, 250, 300])
              .range(d3.schemeGreens[9]);

var x = d3.scaleSqrt()
    .domain([0, 450])
    .rangeRound([100, 500]);
 

var g = svg.append("g")
    .attr("class", "key")
    .attr("transform", "translate(0,40)");


g.selectAll("rect")
  .data(color.range().map(function(d) {
      d = color.invertExtent(d);
      if (d[0] == null) d[0] = x.domain()[0];
      if (d[1] == null) d[1] = x.domain()[1];
      return d;
    }))
  .enter().append("rect")
    .attr("height", 10)
    .attr("x", function(d) { return x(d[0]); })
    .attr("width", function(d) { return x(d[1]) - x(d[0]); })
    .attr("fill", function(d) { return color(d[0]); });

g.append("text")
    .attr("class", "caption")
    .attr("x", x.range()[0])
    .attr("y", -6)
    .attr("fill", "#000")
    .attr("text-anchor", "start")
    .attr("font-weight", "bold")
    .text("อัตราส่วนพื้นที่สีเขียวต่อประชากร (ตร.ม./คน)");


g.call(d3.axisBottom(x)
    .tickSize(13)
    .tickValues(color.domain()))
  .select(".domain")
    .remove();


var projection = d3.geoMercator().scale(60000).rotate([-100.6331, -13.2]).translate([w/2, h/2]);
var path = d3.geoPath().projection(projection);


var bkk= d3.json("./PUBLICG_9Type.json");
var amp = d3.csv("./PUBLICG_9Type.csv"); 
        

Promise.all([bkk, amp]).then(function(values){            
    var features = values[0].features;

    features.forEach(function(feature) {
        if(feature.geometry.type == "Polygon") {
            feature.geometry.coordinates.forEach(function(ring) {
                ring.reverse();
            })
        }
    })
    // 

var div = d3.select("body").append("div")	
        .attr("class", "tooltip")				
        .style("opacity", 0);  
	
   
    svg.append("g")
      .selectAll("path")
      .data(features)
      .enter().append("path")
      .attr("fill", function(d) { return color(d.properties.G9TYPE_POP); })
      .attr("d", path)
      .attr('vector-effect', 'non-scaling-stroke').style('stroke', 'white').style('stroke-width', 0.5).style("opacity",1)
      
      .on("mouseover", function(d) {		
            div.transition()		
                .duration(40)		
                .style("opacity", 0.8);		
            div.html(                                                                
                "<center>" + d.properties.AMP_NAMT + "</center>" + 
                "<p> จำนวนประชากร: " + d.properties.POP61 + "</p>" +
				"<p> พื้นที่: " + d.properties.G9TYPE_ARE + " km<span>2<span></p>" +  
                "<p> อัตราส่วนพื้นที่สีเขียวต่อประชากร: " + d.properties.G9TYPE_POP + "</p>" 
            )	
                .style("left", (d3.event.pageX) + "px")	
                .style("top", (d3.event.pageY) + "px") 
			d3.select(this)
					.style('opacity', '1').style('stroke', 'white').style('stroke-width', 1.8) .style("opacity",1.5)
            })	
        
        .on("mouseout", function(d) {                                               
            div.transition()		
                .duration(500).style('pointer-events', 'none')
                .style("opacity", 0);
			d3.select(this)
				.style('opacity', 1)
				.style('stroke','white')
				.style('stroke-width', 0.8)
        });
    });
//  