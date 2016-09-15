d3.selection.enter.prototype =

	d3.selection.prototype.addNodeForm = function(width, height, rx, ry, stroke, strokewidth) {
	    this.append("rect")
				.attr("class", function(d) { return d.getBiologicalType(); })
				.attr("id", function(d) { return d.getId(); })
				.attr("identifier", function(d) { return d.getId(); })
				.attr("width", width)
				.attr("height", height)
				.attr("rx", rx)
				.attr("ry", ry)
				.attr("transform", "translate(-" + width/2 + ",-"
										+ height/2
										+ ")")
				.style("stroke", stroke)
				.style("stroke-width", strokewidth);

		this.append("rect").attr("class","fontSelected")
			.attr("width", width)
			.attr("height", height)
			.attr("rx", rx)
			.attr("ry", ry)
			.attr( "transform", "translate(-" + width/2 + ",-" + height/2 + ")")
			.style("fill-opacity", '0')
			.style("fill", '#000');
	};

	d3.selection.prototype.setNodeForm = function(width, height, rx, ry, stroke, strokewidth) {
		this.style("opacity", 1)
	    	.select("rect")
			.attr("width", width)
			.attr("height", height)
			.attr("rx", rx)
			.attr("ry", ry)
			.attr("transform", "translate(-" + width/2 + ",-"
									+ height/2
									+ ")")
			.style("stroke", stroke)
			.style("stroke-width", strokewidth);

		this.select(".fontSelected")
			.attr("width", width)
			.attr("height", height)
			.attr("rx", rx)
			.attr("ry", ry)
			.attr( "transform", "translate(-" + width/2 + ",-" + height/2 + ")")
			.style("stroke-width", strokewidth);
	};

	d3.selection.prototype.addSlider = function(title, start, end) {
		
                    
        var sliderThis=this;
        
        // safe layer for slider ability (provide correct & smooth mouse move)
        var rect = sliderThis.append("svg:rect")
			.attr("class", "layer")
			.attr("width", 120)
		  .style("fill", "#CCC")
			.attr("height", 2);
        
        // util
        var _dragSliderLine;      

        var sliderCircle = sliderThis.append("circle")    
	        .attr("class", "cursor")    
			.attr("cx", 10)
			.attr("cy", 1)
			.attr("r", 6)
			.style("fill", "#5FA2DD")
			.attr("stroke-width", 1);  
         
        var circledrag = d3.behavior.drag()
			.on("dragstart",function(d, i){
				d3.event.sourceEvent.stopPropagation();
				d3.selectAll("#D3viz").style("cursor", "move");
				
				start();
				
				// console.log(d);console.log(d3.event);console.log(i);
			})
			.on("drag",function(d, i){
				if(d3.event.x>=10 && d3.event.x<=110)
				{
					sliderThis.select('.cursor')
						.attr("cx", d3.event.x)
						.attr("x", d3.event.x);
				}
			})
			.on("dragend",function(d, i){
				// console.log(d);console.log(d3.event);console.log(i);
				var x = sliderThis.select('.cursor')
						.attr("cx");
				end(x-10);
			});

        sliderCircle.call(circledrag);
	};

