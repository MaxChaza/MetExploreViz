
/**
 * @author MC
 * (a)description : Nodes drawing
 */

metExploreD3.GraphNode = {

	node :"",
	_MyThisGraphNode :"",
	panelParent :"",
	activePanel :"",
	taskClick :"",
	charKey :"",
	ctrlKey :"",
	groupFill:"",
	dblClickable:false,

	/*******************************************
    * Initialization of variables
    * @param {} parent : The panel where are the node
    */
    delayedInitialisation : function(parent) {

		metExploreD3.GraphNode.panelParent = parent;
		_MyThisGraphNode = metExploreD3.GraphNode;
		activePanel = metExploreD3.GraphNode;
	},

    /*******************************************
     * Permit to highlight a node : Select, Fix & grow up
     * @param {} d : a node
     */
    highlightANode : function(id) {
        d3.select("#viz").select("#D3viz")
            .selectAll("g.node")
            .filter(function(d){
                return d.getDbIdentifier()==id || d.getId()==id;
            })
            .each(function(d){
            	d.fixed=true;
            	// if(!d.isSelected())
                //     _MyThisGraphNode.selection(d, "viz")
                var transform = d3.select(this).attr("transform");
                var scale=transform.substring(transform.indexOf("scale"),transform.length);
                var scaleVal=scale.substring(6, scale.indexOf(')'));

                if(isNaN(scaleVal))
                    scaleVal=1;

                var nodes = d3.select("#viz").select("#D3viz").select("#graphComponent").selectAll("g.node");
                d3.select(this)
					.transition()
					.duration(2000)
					.attr("transform", "translate("+d.x+", "+d.y+") scale("+scaleVal*4+")")
            		.transition()
					.duration(4000)
					.attr("transform", "translate("+d.x+", "+d.y+") scale("+scaleVal+")");

                if(!d.isSelected())
                    _MyThisGraphNode.selection(d, "viz");
            });
	},

	/*******************************************
    * Permit to select neighbour of a node
    * @param {} d : a node
    */
	selectNeighbours : function(d, panel) {

		d3.select("#"+panel).select("#D3viz").select("#graphComponent")
			.selectAll("path.link.reaction")
			.filter(function(link){
				return link.getSource()==d || link.getTarget()==d;
			})
			.each(function(link){
				if(link.getSource()==d){
					if(!link.getTarget().isSelected())
						_MyThisGraphNode.selection(link.getTarget(), panel);
				}
				else{
					if(!link.getSource().isSelected())
						_MyThisGraphNode.selection(link.getSource(), panel);
				}
			});
	},

	/*******************************************
    * Permit to set name of a node
    * @param {} d : a node
    */
	changeName : function(node) {
		var me = this;
		var metaboliteStyle = metExploreD3.getMetaboliteStyle();
		var reactionStyle = metExploreD3.getReactionStyle();
		var generalStyle = metExploreD3.getGeneralStyle();
		
        var networkData = _metExploreViz.getSessionById("viz").getD3Data();

		var person = metExploreD3.displayPrompt("New label", "Enter new label", function(btn, text){
			if (text!=null && text!="" && btn=="ok") {
		       d3.select("#viz").select("#D3viz").select("#graphComponent")
					.selectAll("g.node")
					.filter(function(n){
						return node.getId() == n.getId();
					})
					.each(function(node){
					    node.setLabel(text);
						if(networkData.getNodes().length < generalStyle.getReactionThreshold() || !generalStyle.isDisplayedLabelsForOpt())
						{
                            var font = d3.select(this).select("text").style("font-family");
                            var fontSize = d3.select(this).select("text").style("font-size");
                            var fontBold = d3.select(this).select("text").style("font-weight");
                            var fontItalic = d3.select(this).select("text").style("font-style");
                            var fontUnderline = d3.select(this).select("text").style("text-decoration-line");
                            var opacity = d3.select(this).select("text").attr("opacity");
                            var x = d3.select(this).select("text").attr("x");
                            var y = d3.select(this).select("text").attr("y");
							var transform = d3.select(this).select("text").attr("transform");
							d3.select(this)
								.select("text")
								.remove();

							metExploreD3.GraphNode.addText(node, "viz");
                            d3.select(this).select("text").attr("opacity", opacity).attr("transform", transform).attr("x", x).attr("y", y)
								.style("font-family", font).style("font-size", fontSize).style("font-weight", fontBold).style("font-style", fontItalic).style("text-decoration-line", fontUnderline);
						}
					});
		    }
		});
	},

	/*******************************************
    * Permit to start drag and drop of nodes
    * @param {} d : Color in byte
    */
	dragstart : function(d, i) {
		// Get the panel where brush is used
		metExploreD3.GraphPanel.setActivePanel(d3.event.sourceEvent.target.viewportElement.parentNode.id);
		if(_MyThisGraphNode.activePanel=="" || _MyThisGraphNode.activePanel.search("node")!=-1)
			metExploreD3.GraphPanel.setActivePanel(d3.event.sourceEvent.target.parentNode.viewportElement.parentNode.id);
		
		// Stop the propagation of the event to bypass moving graph
		d3.event.sourceEvent.stopPropagation();

		var session = _metExploreViz.getSessionById(_MyThisGraphNode.activePanel);
			
		if(session!=undefined)  
		{	
			// For the right click you can't deselectionate the node
			if(d3.event.sourceEvent.target.classList.contains("backgroundlocker") || d3.event.sourceEvent.target.classList.contains("iconlocker")){
				if(d3.event.sourceEvent.button!=2){
					d.setLocked(!d.isLocked());
					d.fixed=d.isLocked();
					d3.select("#"+_MyThisGraphNode.activePanel)
						.selectAll('g.node')
						.filter(function(node){return node==d})
						.select('.locker')
						.classed('hide', false)
						.select('.iconlocker')
						.attr(
						"xlink:href",
						function(d) {
							if(d.isLocked())
								return "resources/icons/lock_font_awesome.svg";
							else
								return "resources/icons/unlock_font_awesome.svg";
						});
				}
			}
			else
			{	
				if(d3.event.sourceEvent.button==2){
					if(!d.isSelected()){
						_MyThisGraphNode.selection(d, _MyThisGraphNode.activePanel);

						// 78 = N like neighbour
						if(_MyThisGraphNode.charKey==78 && d.isSelected())
							_MyThisGraphNode.selectNeighbours(d, _MyThisGraphNode.activePanel);
					}
				}
				else
				{
					_MyThisGraphNode.selection(d, _MyThisGraphNode.activePanel);

					// 78 = N like neighbour
					if(_MyThisGraphNode.charKey==78 && d.isSelected())
						_MyThisGraphNode.selectNeighbours(d, _MyThisGraphNode.activePanel);
				}
			}

			d3.selectAll("#D3viz")
				.style("cursor", "move");
		
			var force = session.getForce();
			force.stop(); // stops the force auto positioning

			// If graphs are linked we move the same nodes
			if(session.isLinked()){

				var sessionsStore = _metExploreViz.getSessionsSet();
				
				for (var key in sessionsStore) {
					if(sessionsStore[key].isLinked() && _MyThisGraphNode.activePanel!=sessionsStore[key].getId())
					{
						var linkedForce = sessionsStore[key].getForce();
						linkedForce.stop();
					}
				}
			}
		}
	},

	/*******************************************
	* Change the style of reaction 
	*/
	refreshStyleOfReaction : function(){
		var reactionStyle = metExploreD3.getReactionStyle();
		
		var reactions = d3.select("#viz").select("#D3viz").select("#graphComponent")
			.selectAll("g.node")
			.filter(function(node){
				return node.getBiologicalType()=="reaction";
			});

		reactions
			.setNodeForm(
				reactionStyle.getWidth(),
				reactionStyle.getHeight(),
				reactionStyle.getRX(),
				reactionStyle.getRY(),
				reactionStyle.getStrokeColor(),
				reactionStyle.getStrokeWidth()
			);


		reactions.each(function(node){
			metExploreD3.GraphNode.addText(node, "viz");
		});

		var minDim = Math.min(reactionStyle.getWidth(), reactionStyle.getHeight());


		// Lock Image definition
		var box = reactions
			.selectAll(".locker")
			.attr(
				"viewBox",
				function(d) {
							+ " " + minDim;
				}
			)
			.attr("width", reactionStyle.getWidth())
			.attr("height", reactionStyle.getHeight())
			.attr("preserveAspectRatio", "xMinYMin")
			.attr("y", -reactionStyle.getHeight())
			.attr("x", -reactionStyle.getWidth())
			.attr("class", "locker")
			.classed('hide', true);

		box.select(".backgroundlocker")
			.attr("d", function(node){
				var pathBack = "M"+reactionStyle.getWidth()+","+reactionStyle.getHeight()+
					" L0,"+reactionStyle.getHeight()+
					" L0,"+reactionStyle.getRY()*2+
					" A"+reactionStyle.getRX()*2+","+reactionStyle.getRY()*2+",0 0 1 "+reactionStyle.getRX()*2+",0"+
					" L"+reactionStyle.getWidth()+",0"; 
				return pathBack;
			})
			.attr("opacity", "0.20")
			.attr("fill", "black");
		
		box.select(".iconlocker")
			.attr("y",function(node){
				return reactionStyle.getHeight()/4-(reactionStyle.getHeight()-reactionStyle.getRY()*2)/8;
			})
			.attr("x",function(node){
				return reactionStyle.getWidth()/4-(reactionStyle.getWidth()-reactionStyle.getRX()*2)/8;
			})
			.attr("width", "40%")
			.attr("height", "40%");

        reactions
            .select("text")
            .attr("opacity",reactionStyle.getLabelOpacity());
			

	},

	/*******************************************
	* Change the style of Metabolite  
	*/
	refreshStyleOfMetabolite : function(){
		var metaboliteStyle = metExploreD3.getMetaboliteStyle();
		
		var metabolites = d3.select("#viz").select("#D3viz").select("#graphComponent")
			.selectAll("g.node")
			.filter(function(node){
				return node.getBiologicalType()=="metabolite";
			});


		metabolites
			.filter(function(d) {
				return !d.getIsSideCompound();
			})
			.setNodeForm(
				metaboliteStyle.getWidth(),
				metaboliteStyle.getHeight(),
				metaboliteStyle.getRX(),
				metaboliteStyle.getRY(),
				undefined,
				metaboliteStyle.getStrokeWidth()
			);

		metabolites
			.filter(function(d) {
					return d.getIsSideCompound();
				})
			.setNodeForm(
				metaboliteStyle.getWidth()/2,
				metaboliteStyle.getHeight()/2,
				metaboliteStyle.getRX()/2,
				metaboliteStyle.getRY()/2,
				undefined,
				metaboliteStyle.getStrokeWidth()/2
			);
		var minDim = Math.min(metaboliteStyle.getWidth(), metaboliteStyle.getHeight());

		metabolites.each(function(node){
			metExploreD3.GraphNode.addText(node, "viz");
		});
		
		metabolites.selectAll('.structure_metabolite')
			.attr(
				"viewBox",
				function(d) { 
					console.log(minDim);
					return "0 0 " + minDim
							+ " " + minDim;
				}
			)
			.attr("width", minDim *8/10 + "px")
			.attr("height", minDim *8/10+ "px")
			.attr("x", (-minDim/2)+(minDim*1/10))
			.attr("preserveAspectRatio", "xMinYMin")
			.attr("y", (-minDim/2)+(minDim*1/10));

		// Lock Image definition
		var box = metabolites.selectAll(".locker")
			.attr(
				"viewBox",
				function(d) {
							+ " " + minDim;
				}
			)
			.attr("width",function(node){
				return metaboliteStyle.getWidth();
			})
			.attr("height",function(node){
				return metaboliteStyle.getHeight();
			})
			.attr("preserveAspectRatio", "xMinYMin")
			.attr("y",function(node){
				return -metaboliteStyle.getHeight();
			})
			.attr("x",function(node){
				return -metaboliteStyle.getWidth();
			})
			.attr("class", "locker")
			.classed('hide', true);

		box.select(".backgroundlocker")
			.attr("d", function(node){
				var pathBack = "M"+metaboliteStyle.getWidth()+","+metaboliteStyle.getHeight()+
					" L0,"+metaboliteStyle.getHeight()+
					" L0,"+metaboliteStyle.getRY()*2+
					" A"+metaboliteStyle.getRX()*2+","+metaboliteStyle.getRY()*2+",0 0 1 "+metaboliteStyle.getRX()*2+",0"+
					" L"+metaboliteStyle.getWidth()+",0";
				return pathBack;
				
			})
			.attr("opacity", "0.20")
			.attr("fill", "black");
		
		box.select(".iconlocker")
			.attr("y",function(node){
				return metaboliteStyle.getHeight()/4-(metaboliteStyle.getHeight()-metaboliteStyle.getRY()*2)/8;
				
			})
			.attr("x",function(node){
				return metaboliteStyle.getWidth()/4-(metaboliteStyle.getWidth()-metaboliteStyle.getRX()*2)/8;
			})
			.attr("width", "40%")
			.attr("height", "40%");

		var session = _metExploreViz.getSessionById("viz");
		
		var force = session.getForce();
		var metaboliteStyle = metExploreD3.getMetaboliteStyle();
		var reactionStyle = metExploreD3.getReactionStyle();

		var maxDimRea = Math.max(reactionStyle.getWidth(),reactionStyle.getHeight());
		var maxDimMet = Math.max(metaboliteStyle.getWidth(),metaboliteStyle.getHeight());
		var maxDim = Math.max(maxDimRea, maxDimMet);
		
		
		var linkStyle = metExploreD3.getLinkStyle();  
		force.linkDistance(function(link){
			if(link.getSource().getIsSideCompound() || link.getTarget().getIsSideCompound())
				return linkStyle.getSize()/2+maxDim;
			else
				return linkStyle.getSize()+maxDim;
		});
	    metabolites
		.select("text")
		.attr("opacity",metaboliteStyle.getLabelOpacity());
		
	},

	/*******************************************
	* Change the node position
	* @param {} d : The node to move
	* @param {} parent : The panel where the action is launched
	*/
	moveNode : function(d, panel){
		d3.select("#"+panel).select("#D3viz").select("#graphComponent")
			.selectAll("g.node")
			.filter(function(node){
				if(_MyThisGraphNode.ctrlKey)
					return node.isSelected();
				else
					return d.getId()==node.getId();
			})
			.each(function(node){

					node.px += d3.event.dx;
					node.py += d3.event.dy;
					node.x += d3.event.dx;
					node.y += d3.event.dy;
			});
	},

	/*******************************************
	* Updating both px,py,x,y on d
	* @param {} d : The node to move
	*/
	dragmove : function(d, i) {

        if(!d.isSelected() && !(d3.event.sourceEvent.target.classList.contains("backgroundlocker") || d3.event.sourceEvent.target.classList.contains("iconlocker"))){
            _MyThisGraphNode.selection(d, _MyThisGraphNode.activePanel);

            // 78 = N like neighbour
            if(_MyThisGraphNode.charKey==78 && d.isSelected())
                _MyThisGraphNode.selectNeighbours(d, _MyThisGraphNode.activePanel);
        }

        // with updating both px,py,x,y on d !
        _MyThisGraphNode.moveNode(d,_MyThisGraphNode.activePanel);

        _MyThisGraphNode.tick(_MyThisGraphNode.activePanel); // this is the key to make it work together

        var scaleactivePanel = metExploreD3.getScaleById(_MyThisGraphNode.activePanel);

        metExploreD3.GraphLink.tick(_MyThisGraphNode.activePanel, scaleactivePanel);

        var session = _metExploreViz.getSessionById(_MyThisGraphNode.activePanel);

        // If graphs are linked we move the same nodes
        if(session.isLinked()){

            var sessionsStore = _metExploreViz.getSessionsSet();

            for (var key in sessionsStore) {
                if(sessionsStore[key].isLinked()  && _MyThisGraphNode.activePanel!=sessionsStore[key].getId())
                {
                    var scalesess = metExploreD3.getScaleById(sessionsStore[key].getId());

                    _MyThisGraphNode.moveNode(d,sessionsStore[key].getId());
                    _MyThisGraphNode.tick(sessionsStore[key].getId()); // this is the key to make it work together
                    // with updating both px,py,x,y on d !
                    metExploreD3.GraphLink.tick(sessionsStore[key].getId(), scalesess);
                }
            }
        }
	},

	/*******************************************
	* Stop dragging
	* @param {} d : The node to move
	*/
	dragend : function(d, i) {
		var session = _metExploreViz.getSessionById(_MyThisGraphNode.activePanel);
		var mainSession = _metExploreViz.getSessionById("viz");
		
		if(session!=undefined)  
		{
			if(session.isLinked()){

				var sessionsStore = _metExploreViz.getSessionsSet();
				
				for (var key in sessionsStore) {
					if(sessionsStore[key].isLinked() && _MyThisGraphNode.activePanel!=sessionsStore[key].getId())
					{
						var animLinked = metExploreD3.GraphNetwork.isAnimated(mainSession.getId());
						if (animLinked=='true') {
							var mainforce = mainSession.getForce();// of course set the node to fixed so the force doesn't include the node in its auto positioning stuff
			        				
							if ((metExploreD3.GraphNetwork.isAnimated(_MyThisGraphNode.panelParent) == 'true') 
								|| (metExploreD3.GraphNetwork.isAnimated(_MyThisGraphNode.panelParent) == null)) {
								mainforce.resume();
							}
						}
						_MyThisGraphNode.tick(sessionsStore[key].getId()); // this is the key to make it work together
						// with updating both px,py,x,y on d !
						var scalesess = metExploreD3.getScaleById(sessionsStore[key].getId());
   						metExploreD3.GraphLink.tick(sessionsStore[key].getId(), scalesess);
					}
				}
			}
			else
			{
				var anim=metExploreD3.GraphNetwork.isAnimated(_MyThisGraphNode.activePanel);
				if (anim=='true') {
					var force = session.getForce();// of course set the node to fixed so the force doesn't include the node in its auto positioning stuff
	        				
					if ((metExploreD3.GraphNetwork.isAnimated(_MyThisGraphNode.activePanel) == 'true') 
						|| (metExploreD3.GraphNetwork.isAnimated(_MyThisGraphNode.activePanel) == null)) {
							force.resume();
					}
				}

				_MyThisGraphNode.tick(_MyThisGraphNode.activePanel);
				var scaleactivePanel = metExploreD3.getScaleById(_MyThisGraphNode.activePanel);
    
				metExploreD3.GraphLink.tick(_MyThisGraphNode.activePanel, scaleactivePanel);
				
			}

			d3.selectAll("#D3viz").style("cursor", "default");
		}
	},

	/*******************************************
	* To Select a node
	* @param {} d : The node to move
	* @param {} parent : The panel where the action is launched
	*/
	fixNodeOnRefresh : function(d, panel) {
		var session = _metExploreViz.getSessionById(panel);
		if(session!=undefined)  
		{
			// Change the node visualization
			if(d.isSelected()) 
			{ 
				_MyThisGraphNode.selectNode(d, panel);
			}
			else 
			{ 
				_MyThisGraphNode.unSelectNode(d, panel);
			}

			// Time out to avoid lag
			setTimeout(
			function() {
				if(session.isLinked()){

					var sessionsStore = _metExploreViz.getSessionsSet();

					for (var key in sessionsStore) {
						if(sessionsStore[key].isLinked() && panel!=sessionsStore[key].getId())
						{
							d3.select("#"+sessionsStore[key].getId()).select("#D3viz").select("#graphComponent")
								.selectAll("g.node")
								.filter(function(node){return d.getId()==node.getId();})
								// .attr("selected", function(node){return node.selected=!node.selected;})
								.each(function(node){node.setIsSelected(!node.isSelected())});

							if(d.isSelected()) 
							{ 
								_MyThisGraphNode.selectNode(d, sessionsStore[key].getId());	
							}
							else
							{
								_MyThisGraphNode.unSelectNode(d, sessionsStore[key].getId());
							}				
						}
					}
				}
			}
		, 200);
		}
	},

	/*******************************************
	* To Select a node
	* @param {} d : The node to move
	* @param {} parent : The panel where the action is launched
	*/
	selection : function(d, panel) {
		var session = _metExploreViz.getSessionById(panel);
		if(session!=undefined)  
		{
			// Change the node statute
			d3.select("#"+panel).select("#D3viz").select("#graphComponent")
				.selectAll("g.node")
				.filter(function(node){return d.getDbIdentifier()==node.getDbIdentifier() && !node.getIsSideCompound();})
				.each(function(node){node.setIsSelected(!node.isSelected())});

			// Chage the node statute
			d3.select("#"+panel).select("#D3viz").select("#graphComponent")
				.selectAll("g.node")
				.filter(function(node){return d.getId()==node.getId() && node.getIsSideCompound();})
				.each(function(node){node.setIsSelected(!node.isSelected())});

			// Change the node visualization
			if(d.isSelected()) 
			{ 
				_MyThisGraphNode.selectNode(d, panel);
			}
			else 
			{ 
				_MyThisGraphNode.unSelectNode(d, panel);
			}

			// Time out to avoid lag
			setTimeout(
			function() {
				if(session.isLinked()){

					var sessionsStore = _metExploreViz.getSessionsSet();

					for (var key in sessionsStore) {
						if(sessionsStore[key].isLinked() && panel!=key)
						{

							// Chage the node statute
                            var nodesComp = d3.select("#"+sessionsStore[key].getId()).select("#D3viz").select("#graphComponent")
                                .selectAll("g.node");

                            nodesComp
								.filter(function(node){return d.getDbIdentifier()==node.getDbIdentifier() && !node.getIsSideCompound();})
                                .each(function(node){node.setIsSelected(!node.isSelected())});

                            // Chage the node statute
                            nodesComp
                                .filter(function(node){return d.getId()==node.getId() && node.getIsSideCompound();})
                                .each(function(node){node.setIsSelected(!node.isSelected())});

                            if(d.isSelected())
							{ 
								_MyThisGraphNode.selectNode(d, key);
							}
							else
							{
								_MyThisGraphNode.unSelectNode(d, key);
							}				
						}
					}
				}
			}
		, 200);
		}
	},

	/*******************************************
	* To Select a node in visualization
	* @param {} d : The node to move
	* @param {} parent : The panel where the action is launched
	*/
	selectNode : function(d, panel){
		var reactionStyle = metExploreD3.getReactionStyle();
		var session = _metExploreViz.getSessionById(panel);
			
		var metabolite_Store = metExploreD3.getMetabolitesSet();
		var reaction_Store = metExploreD3.getReactionsSet();


		var content = 
			"<b>Name:</b> " + d.getName() 
			+"<br/><b>Biological type:</b> " + d.getBiologicalType() +
			((d.getCompartment()!=undefined) ? "<br/><b>Compartment:</b> " + d.getCompartment() : "" )+
			((d.getDbIdentifier()!=undefined) ? "<br/><b>Database identifier:</b> " + d.getDbIdentifier() : "" )+
			((d.getEC()!=undefined) ? "<br/><b>EC number:</b> " + d.getEC() : "" )+
			((d.getReactionReversibility()!=undefined) ? "<br/><b>Reaction reversibility:</b> " + d.getReactionReversibility() : "" )+
			((d.getIsSideCompound()!=undefined) ? "<br/><b>SideCompound:</b> " + d.getIsSideCompound() : "" )+
			((d.getMappingDatasLength()!=0) ? ((d.getMappingDatasLength()==1) ? "<br/><b>Mapping:</b><br/><table style='width:100%; margin-left: 30px; padding-right: 30px;'>" : "<br/><b>Mappings:</b><br/><table style='width:100%; margin-left: 30px; padding-right: 30px;'>"): "");

		d.getMappingDatas().forEach(function(map){
			content+="<tr><td>" + map.getMappingName() +"</td><td>"+ map.getConditionName() +"</td><td>"+ map.getMapValue() +"</td></tr>";
		});

		content+="</table>";
		
		if(d.getSvg()!="" && d.getSvg()!=undefined && d.getSvg()!="undefined"){
			content+='<br/><img src="resources/images/structure_metabolite/'+d.getSvg()+'"/>';
		}

		// Fix the node
		// Add  node in the list of selected nodes
        // Chage the node statute
        var nodes = d3.select("#"+panel).select("#D3viz").select("#graphComponent")
            .selectAll("g.node");

        var nodenotsc = nodes
            .filter(function(node){return d.getDbIdentifier()==node.getDbIdentifier() && !node.getIsSideCompound();});

        var nodeissc = nodes
            .filter(function(node){return d.getId()==node.getId() && node.getIsSideCompound();});

        // Chage the node state
        nodenotsc.each(function(node){session.addSelectedNode(node.getId());});
        nodeissc.each(function(node){session.addSelectedNode(node.getId());});


		// We define the text for a metabolie WITHOUT the coresponding SVG image 
        nodenotsc.select('.fontSelected').style("fill-opacity", '0.4');
        nodeissc.select('.fontSelected').style("fill-opacity", '0.4');

		//_MyThisGraphNode.addText(d, panel);
	},

	/*******************************************
	* To Unselect a node in visualization
	* @param {} d : The node to move
	* @param {} parent : The panel where the action is launched
	*/
	unSelectNode : function(d, panel){
		var session = _metExploreViz.getSessionById(panel);

        var nodes = d3.select("#"+panel).select("#D3viz").select("#graphComponent")
            .selectAll("g.node");

        var nodenotsc = nodes
            .filter(function(node){return d.getDbIdentifier()==node.getDbIdentifier() && !node.getIsSideCompound();});

        var nodeissc = nodes
            .filter(function(node){return d.getId()==node.getId() && node.getIsSideCompound();});

        // Chage the node state
        nodenotsc.select('.fontSelected').style("fill-opacity", '0');
        nodeissc.select('.fontSelected').style("fill-opacity", '0');

        nodeissc.each(function(node){
				session.removeSelectedNode(node.getId()); 
			});
        nodenotsc.each(function(node){
				session.removeSelectedNode(node.getId());
			});
	},

	/*******************************************
	* To remove text on node in visualization
	* @param {} d : The node to move
	* @param {} parent : The panel where the action is launched
	*/
	removeText : function(d, panel){
		d3.select("#"+panel).select("#D3viz").select("#graphComponent")
			.selectAll("g.node")
			.filter(function(node){return d.getId()==node.getId();})
			.select("text")
			.remove();
	},

	/*******************************************
	* To add text on node in visualization
	* @param {} d : The node to move
	* @param {} parent : The panel where the action is launched
	*/
	addText : function(d, panel){
		var metaboliteStyle = metExploreD3.getMetaboliteStyle();
		var reactionStyle = metExploreD3.getReactionStyle();
		var sessionMain = _metExploreViz.getSessionById('viz');

		if(d.getBiologicalType() =='metabolite'){
			var minDim = Math.min(metaboliteStyle.getWidth(),metaboliteStyle.getHeight());
  		 	
	 		// if there is no text we define it for a metabolite WITHOUT the corresponding SVG image
			if(d3.select("#"+panel).select("#D3viz").select("#graphComponent")
				.selectAll("g.node")
				.filter(function(node){return d.getId()==node.getId();}).select("text")=="")
            {
            	d3.select("#"+panel).select("#D3viz").select("#graphComponent")
					.selectAll("g.node")
					.filter(function(node){return d.getId()==node.getId();})
	            	.addNodeText(metaboliteStyle);


			}
			// set corresponding event handler
            var name = metaboliteStyle.getDisplayLabel(d, metaboliteStyle.getLabel())
            metExploreD3.GraphStyleEdition.changeNodeLabel(d, panel, name);
            if (metExploreD3.GraphStyleEdition.editMode==true) {
                metExploreD3.GraphStyleEdition.startDragLabel(panel);
            }
            else {
                metExploreD3.GraphStyleEdition.endDragLabel(panel);
                metExploreD3.GraphNode.applyEventOnNode(panel);
			}

  		 	if( d.getSvg()!="undefined" && d.getSvg()!=undefined && d.getSvg()!=""){ 
	            if(d3.select("#"+panel).select("#D3viz").select("#graphComponent")
						.selectAll("g.node")
						.filter(function(node){return d.getId()==node.getId();}).select("image").empty())
	            {
					// Image definition
		             d3.select("#"+panel).select("#D3viz").select("#graphComponent")
						.selectAll("g.node")
						.filter(function(node){return d.getId()==node.getId();})
						.append("svg")
						.attr("viewBox",function(d) {return "0 0 "+minDim+" "+minDim;})
						.attr("width", minDim *8/10 + "px")
						.attr("height", minDim *8/10+ "px")
						.attr("x", (-minDim/2)+(minDim*1/10))
						.attr("preserveAspectRatio", "xMinYMin")
						.attr("y", (-minDim/2)+(minDim*1/10))
						.attr("class", "structure_metabolite")
						.append("image")
						.attr("xlink:href",
							function(d) {
								return "resources/images/structure_metabolite/"
										+ d.getSvg();
							}
						)
						.attr("width", "100%").attr("height", "100%");
				}
			}
	        
	    }
	    
	    // Same thing for a reaction
	    if(d.getLabelVisible() ==true && d.getBiologicalType() =='reaction'){
  		 		
			if(d3.select("#"+panel).select("#D3viz").select("#graphComponent")
					.selectAll("g.node")
					.filter(function(node){return d.getId()==node.getId();}).text()=="")
	        {
	        	d3.select("#"+panel).select("#D3viz").select("#graphComponent")
					.selectAll("g.node")
					.filter(function(node){return d.getId()==node.getId();})
					.addNodeText(reactionStyle);
			}
            // set corresponding event handler
            var name = reactionStyle.getDisplayLabel(d, reactionStyle.getLabel());
            metExploreD3.GraphStyleEdition.changeNodeLabel(d, panel, name);
            if (metExploreD3.GraphStyleEdition.editMode==true) {
                metExploreD3.GraphStyleEdition.startDragLabel(panel);
            }
            else {
                metExploreD3.GraphStyleEdition.endDragLabel(panel);
                metExploreD3.GraphNode.applyEventOnNode(panel);
            }
		} 
	},

	/*******************************************
	* To add text on node in visualization
	* @param {} parent : The panel where the action is launched
	*/
	addTextAllPanels : function(){
 		var sessions = _metExploreViz.getSessionsSet();
				
		for (var key in sessions) {	
			d3.select("#"+sessions[key].getId()).select("#D3viz").select("#graphComponent")
				.selectAll("g.node")
				.each(function(node){
					metExploreD3.GraphNode.addText(node, sessions[key].getId());
				});
		}	
	},

	/*******************************************
	* To remove text on node in visualization
	* @param {} parent : The panel where the action is launched
	*/
	removeText : function(panel){
 		// if there is no text we define it for a metabolie WITHOUT the coresponding SVG image 
		d3.select("#"+panel).select("#D3viz").select("#graphComponent")
			.selectAll("g.node")
			.select("text")
			.remove();
	},

	/*******************************************
	* To remove text on node in visualization
	* @param {} parent : The panel where the action is launched
	*/
	removeTextAllPanels : function(panel){
 		var sessions = _metExploreViz.getSessionsSet();
				
		for (var key in sessions) {						
			metExploreD3.GraphNode.removeText(sessions[key].getId());
		}
	},

	/*******************************************
	* To Search nodes in visualization
	* @param {} selectedVal : The value of search field text
	*/
	searchNode : function(selectedVal) {
        var mask = metExploreD3.createLoadMask("Search nodes", "viz");
        metExploreD3.showMask(mask);
	    //find the node
		var upperCaseSelectedVal = selectedVal.toUpperCase();

	    var svg = d3.select('#viz').select('#D3viz').select('#graphComponent');

        var selected = svg.selectAll("g.node").filter(function (d, i) {

        	var equalName = false;
        	if(d.getName()!=undefined)
        		equalName = d.getName().toUpperCase().indexOf(upperCaseSelectedVal) > -1;

			if(d.getLabel()!=undefined)
        		equalName = d.getLabel().toUpperCase().indexOf(upperCaseSelectedVal) > -1;

        	var equalEc = false;
        	if(d.getEC()!=undefined)
        		equalEc = d.getEC().toUpperCase().indexOf(upperCaseSelectedVal) > -1;

        	var equalDbId = false;
        	if(d.getDbIdentifier()!=undefined)
        		equalDbId = d.getDbIdentifier().toUpperCase().indexOf(upperCaseSelectedVal) > -1;

        	var equalCompartment = false;
        	if(d.getCompartment()!=undefined)
        		equalCompartment = d.getCompartment().toUpperCase().indexOf(upperCaseSelectedVal) > -1;

        	var equalBiologicalType = false;
        	if(d.getBiologicalType()!=undefined)
        		equalBiologicalType = d.getBiologicalType().toUpperCase().indexOf(upperCaseSelectedVal) > -1;

            return equalName || equalEc || equalDbId || equalCompartment || equalBiologicalType;
        });

		if(selected.size()==0){
            metExploreD3.hideMask(mask);
            metExploreD3.displayMessage("Warning", 'The node "' + selectedVal + '" doesn\'t exist.')
        }
		else
		{

            var scaleViz = metExploreD3.getScaleById("viz");
            var zoom = scaleViz.getZoom();

            d3.select("#viz").select("#D3viz").select("#graphComponent")
				.transition()
				.duration(750)
				.attr("transform", "translate(0,0)scale(1)")
                .each('end', function(){
                    zoom.translate([0,0]);

                    zoom.scale(1);
                    scaleViz.setZoomScale(1);

					var maxX = -100000;
					var	maxY = -100000;
					var minX= 100000;
					var	minY = 100000;

					selected.each(
						function(aSelectedNode){
							if(maxX<aSelectedNode.x)
								maxX=aSelectedNode.x;
							if(maxY<aSelectedNode.y)
								maxY=aSelectedNode.y;
							if(minX>aSelectedNode.x)
								minX=aSelectedNode.x;
							if(minY>aSelectedNode.y)
								minY=aSelectedNode.y;

						});

					var dx = maxX - minX,
						dy = maxY - minY;


					var rectPanel = d3.select("#viz").select("#D3viz").node().getBoundingClientRect();

					var width = parseInt(metExploreD3.GraphPanel.getWidth("viz").replace("px",""));
					var height = parseInt(metExploreD3.GraphPanel.getHeight("viz").replace("px",""));

					// var scale = 1;
					var scale =(Math.min(height/dy, width/dx))*0.7;

					var transX = scale*(rectPanel.left - minX);
					var transY = scale*(rectPanel.top - minY);


					d3.select("#viz").select("#D3viz").select("#graphComponent")
						.transition()
						.duration(750)
						.attr("transform", "translate("+transX+","+transY+")scale("+scale+")")
						.each('end', function(){
							metExploreD3.GraphLink.tick("viz", scale);
							metExploreD3.GraphNode.tick("viz");
							metExploreD3.hideMask(mask);
						});

					zoom.translate([transX,transY]);
					zoom.scale(scale);
					scaleViz.setZoomScale(scale);

                    selected.each(
                        function(aSelectedNode){
                            _MyThisGraphNode.highlightANode(aSelectedNode, 'viz');
                        });
				});
        }
	},

    initShortCut: function () {
        d3.select("body")
            .on("keydown", function() {
                _MyThisGraphNode.charKey = d3.event.keyCode;
                _MyThisGraphNode.ctrlKey = d3.event.ctrlKey;
                _MyThisGraphNode.altKey = d3.event.altKey;
                var activesession = _metExploreViz.getSessionById(_MyThisGraphNode.activePanel);

                //H	72
                if(_MyThisGraphNode.charKey==72 && !_MyThisGraphNode.altKey && activesession.getSelectedNodes().length>0)
                {
                    metExploreD3.GraphFunction.horizontalAlign(_MyThisGraphNode.activePanel);
                }

                if(_MyThisGraphNode.charKey==72 && _MyThisGraphNode.altKey && activesession.getSelectedNodes().length>0)
                {
                    metExploreD3.GraphFunction.horizontalReverse(_MyThisGraphNode.activePanel);
                }

                //V 86
                if(_MyThisGraphNode.charKey==86 && !_MyThisGraphNode.altKey && activesession.getSelectedNodes().length>0)
                {
                    metExploreD3.GraphFunction.verticalAlign(_MyThisGraphNode.activePanel);
                }

                if(_MyThisGraphNode.charKey==86 && _MyThisGraphNode.altKey && activesession.getSelectedNodes().length>0)
                {
                    metExploreD3.GraphFunction.verticalReverse(_MyThisGraphNode.activePanel);
                }



                // 65=A
                if(_MyThisGraphNode.charKey==65 && _MyThisGraphNode.ctrlKey)
                {
                    d3.select("#"+_MyThisGraphNode.activePanel).select("#D3viz").select("#graphComponent").selectAll("g.node")
                        .each(function(node){
                            if(!node.isSelected())
                            {
                                _MyThisGraphNode.selection(node, _MyThisGraphNode.activePanel);
                            }
                        });
                }
            })
            .on("keyup", function(e) {
                // 46=Suppr
                var activesession = _metExploreViz.getSessionById(_MyThisGraphNode.activePanel);
                if(_MyThisGraphNode.charKey==46 && activesession.getSelectedNodes().length>0)
                {
                    metExploreD3.displayMessageYesNo("Selected nodes",'Do you want remove selected nodes?',function(btn){
                        if(btn=="yes")
                        {
                            metExploreD3.GraphNetwork.removeSelectedNode(_MyThisGraphNode.activePanel)
                        }
                    });
                }

                _MyThisGraphNode.charKey = 'none';
                _MyThisGraphNode.ctrlKey = d3.event.ctrlKey;
            });
    },

    /*******************************************
	* To add nodes in visualization
	* @param {} panel : The panel where the action is launched
	*/
	refreshNode : function(parent) {

		// Load user's preferences
		var reactionStyle = metExploreD3.getReactionStyle();
		
		var metaboliteStyle = metExploreD3.getMetaboliteStyle();
		var generalStyle = metExploreD3.getGeneralStyle();

		var session = _metExploreViz.getSessionById(parent);
		var sessionMain = _metExploreViz.getSessionById('viz');

        document.addEventListener("keydown", function(e) {
			// 83=S
            if (e.keyCode == 83 && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)) {
                e.preventDefault();
                metExploreD3.GraphUtils.saveNetworkJSON();
            }
        }, false);

        this.initShortCut();

		metExploreD3.GraphNode.panelParent = parent;

		_MyThisGraphNode = metExploreD3.GraphNode;

		/***************************/
		// Var which permit to drag
		/***************************/
		var node_drag = d3.behavior.drag()
			.on("dragstart",_MyThisGraphNode.dragstart)
			.on("drag", _MyThisGraphNode.dragmove)
			.on("dragend", _MyThisGraphNode.dragend);



		var networkData=session.getD3Data();
	    var h = parseInt(metExploreD3.GraphPanel.getHeight(_MyThisGraphNode.panelParent));
	    var w = parseInt(metExploreD3.GraphPanel.getWidth(_MyThisGraphNode.panelParent));

	    // Create function to manage double click
	    d3.selectAll("#D3viz")
			.on("mouseup", this.unselectIfDBClick);
		        
	 
	 	var scale = metExploreD3.getScaleById(parent);


		// For each node we append a division of the class "node"
		metExploreD3.GraphNode.node = d3.select("#"+metExploreD3.GraphNode.panelParent).select("#D3viz").select("#graphComponent").selectAll("g.node")
			.data(networkData.getNodes()).enter()
				.append("svg:g").attr("class", "node")
				.attr("id", function(node){ return "node"+node.getId(); })
				.call(node_drag)
				.style("fill", "white");
				// Here it's the position by default for the beginning of force algorithm
				// .on("click", selection)
				// .style(
				// 	"stroke-dasharray", function(d) {
				// 		if (d.getReactionReversibility()) {
				// 			return "2,2";
				// 		} else {
				// 			return "";
				// 		}
				// 	}
				// );

        metExploreD3.GraphNode.applyEventOnNode(parent);

		// d3.selection.prototype.test = function() {
		//     this.append("rect")
		// 	.attr("class", function(d) { return d.getBiologicalType(); })
		// 	.attr("id", function(d) { return d.getId(); })
		// 	.attr("identifier", function(d) { return d.getId(); })
		// 	.attr("width", metaboliteStyle.getWidth())
		// 	.attr("height", metaboliteStyle.getHeight())
		// 	.attr("rx", metaboliteStyle.getRX())
		// 	.attr("ry", metaboliteStyle.getRY())
		// 	.attr("transform", "translate(-" + metaboliteStyle.getWidth() / 2 + ",-"
		// 							+ metaboliteStyle.getHeight() / 2
		// 							+ ")")
		// 	.style("stroke", metaboliteStyle.getStrokeColor())
		// 	.style("stroke-width", metaboliteStyle.getStrokeWidth());
		// };

		// For each metabolite we append a division of the class "rect" with the metabolite style by default or create by the user
		metExploreD3.GraphNode.node.filter(function(d) { return d.getBiologicalType() == 'metabolite' })
			.filter(function(d){ return !d.isDuplicated(); })
			.addNodeForm(
				metaboliteStyle.getWidth(),
				metaboliteStyle.getHeight(),
				metaboliteStyle.getRX(),
				metaboliteStyle.getRY(),
				metaboliteStyle.getStrokeColor(),
				metaboliteStyle.getStrokeWidth()
			);

		// Duplicated metabolites
		metExploreD3.GraphNode.node.filter(function(d) { return d.getBiologicalType() == 'metabolite' })
			.filter(function(d){ 
				return d.isDuplicated(); })
			.style("stroke-opacity",0.5)
			.each(function(node){
				var clone = new NodeData(
					node.getName(), 
					node.getCompartment(), 
					node.getDbIdentifier(), 
					node.getEC(), 
					node.getIdentifier(), 
					node.getReactionReversibility(), 
					node.getIsSideCompound(), 
					node.getBiologicalType(), 
					node.isSelected(), 
					node.getLabelVisible(), 
					node.getSvg(), 
					node.getSvgWidth(), 
					node.getSvgHeight(), 
					undefined, 
					node.isDuplicated(), 
					node.getIdentifier(), 
					node.getPathways(), 
					node.isLocked(), 
					node.getAlias(), 
					node.getLabel());

				metExploreD3.fireEventParentWebSite("sideCompound", clone);	
			})
			.addNodeForm(
				metaboliteStyle.getWidth()/2,
				metaboliteStyle.getHeight()/2,
				metaboliteStyle.getRX()/2,
				metaboliteStyle.getRY()/2,
				metaboliteStyle.getStrokeColor(),
				metaboliteStyle.getStrokeWidth()/2
			);
			

		// For each reaction we append a division of the class "rect" with the reaction style by default or create by the user
		// For each reaction we append a division of the class "rect" with the reaction style by default or create by the user
		metExploreD3.GraphNode.node
			.filter(function(d) { return d.getBiologicalType() == 'reaction' })
			.addNodeForm(
				reactionStyle.getWidth(),
				reactionStyle.getHeight(),
				reactionStyle.getRX(),
				reactionStyle.getRY(),
				reactionStyle.getStrokeColor(),
				reactionStyle.getStrokeWidth()
			);

		
		
		if (networkData.getNodes().length < generalStyle.getReactionThreshold() || !generalStyle.isDisplayedLabelsForOpt()) {
			var minDim = Math.min(metaboliteStyle.getWidth(),metaboliteStyle.getHeight());
			// We define the text for a metabolie WITHOUT the coresponding SVG image 
			metExploreD3.GraphNode.node
				.filter(function(d) { return d.getLabelVisible() == true; })
				.filter(function(d) { return d.getBiologicalType() == 'metabolite'; })
				.filter(function(d) { return d.getSvg() == "undefined" || d.getSvg()==undefined || d.getSvg()==""; })
				.addNodeText(metaboliteStyle);

			// We define the text for a metabolie WITH the coresponding SVG image 
			// Text definition
			metExploreD3.GraphNode.node
				.filter(function(d) { return d.getLabelVisible() == true; })
				.filter(function(d) { return d.getBiologicalType() == 'metabolite'; })
				.filter(function(d) { return d.getSvg() != "undefined" && d.getSvg()!=undefined && d.getSvg()!=""; })
				.addNodeText(metaboliteStyle);

			// Image definition
			metExploreD3.GraphNode.node
				.filter(
					function(d) {
						return (d.getBiologicalType() == 'metabolite' && d.getSvg() != "undefined" && d.getSvg()!=undefined && d.getSvg()!="");
					})
				.append("svg")
				.attr(
					"viewBox",
					function(d) {
						return "0 0 " + minDim
								+ " " + minDim;
					})
				.attr("width", minDim *8/10 + "px")
				.attr("height", minDim *8/10+ "px")
				.attr("x", (-minDim/2)+(minDim*1/10))
				.attr("preserveAspectRatio", "xMinYMin")
				.attr("y", (-minDim/2)+(minDim*1/10))
				.attr("class", "structure_metabolite")
				.append("image")
				.attr(
					"xlink:href",
					function(d) {
						//return "resources/images/structure_metabolite/"
						return "resources/images/structure_metabolite/"
								+ d.getSvg();
					})
				.attr("width", "100%")
				.attr("height", "100%");
			

			// Lock Image definition
			var box = metExploreD3.GraphNode.node
				.insert("svg", ":first-child")
				.attr(
					"viewBox",
					function(d) {
								+ " " + minDim;
					}
				)
				.attr("width",function(node){
					if(node.getBiologicalType()=="metabolite")
						return metaboliteStyle.getWidth();
					if(node.getBiologicalType()=="reaction")
						return reactionStyle.getWidth();
				})
				.attr("height",function(node){
					if(node.getBiologicalType()=="metabolite")
						return metaboliteStyle.getHeight();
					if(node.getBiologicalType()=="reaction")
						return reactionStyle.getHeight();
				})
				.attr("preserveAspectRatio", "xMinYMin")
				.attr("y",function(node){
					if(node.getBiologicalType()=="metabolite")
						return -metaboliteStyle.getHeight();
					if(node.getBiologicalType()=="reaction")
						return -reactionStyle.getHeight();
				})
				.attr("x",function(node){
					if(node.getBiologicalType()=="metabolite")
						return -metaboliteStyle.getWidth();
					if(node.getBiologicalType()=="reaction")
						return -reactionStyle.getWidth();
				})
				.attr("class", "locker")
				.classed('hide', true);

			box.append("svg:path")
				.attr("class", "backgroundlocker")
				.attr("d", function(node){
					if(node.getBiologicalType()=="metabolite")
					{
						var pathBack = "M"+metaboliteStyle.getWidth()+","+metaboliteStyle.getHeight()+
							" L0,"+metaboliteStyle.getHeight()+
							" L0,"+metaboliteStyle.getRY()*2+
							" A"+metaboliteStyle.getRX()*2+","+metaboliteStyle.getRY()*2+",0 0 1 "+metaboliteStyle.getRX()*2+",0"+
							" L"+metaboliteStyle.getWidth()+",0";
						return pathBack;

					}
					if(node.getBiologicalType()=="reaction")
					{
						var pathBack = "M"+reactionStyle.getWidth()+","+reactionStyle.getHeight()+
							" L0,"+reactionStyle.getHeight()+
							" L0,"+reactionStyle.getRY()*2+
							" A"+reactionStyle.getRX()*2+","+reactionStyle.getRY()*2+",0 0 1 "+reactionStyle.getRX()*2+",0"+
							" L"+reactionStyle.getWidth()+",0"; 
						return pathBack;
							
					}
					
				})
				.attr("opacity", "0.20")
				.attr("fill", "black");
			
			box.append("image")
				.attr("class", "iconlocker")
				.attr("y",function(node){
					if(node.getBiologicalType()=="metabolite")
						return metaboliteStyle.getHeight()/4-(metaboliteStyle.getHeight()-metaboliteStyle.getRY()*2)/8;
					if(node.getBiologicalType()=="reaction")
						return reactionStyle.getHeight()/4-(reactionStyle.getHeight()-reactionStyle.getRY()*2)/8;
				})
				.attr("x",function(node){
					if(node.getBiologicalType()=="metabolite")
						return metaboliteStyle.getWidth()/4-(metaboliteStyle.getWidth()-metaboliteStyle.getRX()*2)/8;
					if(node.getBiologicalType()=="reaction")
						return reactionStyle.getWidth()/4-(reactionStyle.getWidth()-reactionStyle.getRX()*2)/8;
				})
				.attr("width", "40%")
				.attr("height", "40%");
			
			// We define the text for a reaction
			metExploreD3.GraphNode.node
					.filter(function(d) {
						return d.getLabelVisible() == true;
					})
					.filter(function(d) {
						return d.getBiologicalType() == 'reaction';
					})
					.addNodeText(reactionStyle);
			
		}

		metExploreD3.GraphNode.node
				.filter(function(d) { return d.isSelected(); })
				.each( function(aSelectedNode){
					_MyThisGraphNode.fixNodeOnRefresh(aSelectedNode, 'viz');
        		});


		metExploreD3.GraphNode.node
			.filter(function(d) { return d.isLocked(); })
			.each(function(d) { d.fixed=true; });

		metExploreD3.GraphNode.node
	        .filter(function(node){
	        	return node.getMappingDatasLength()>0 && session.getActiveMapping()!=""; 
	        })
	        .filter(function(node){
	        	var mappingData = node.getMappingDataByNameAndCond(session.getActiveMapping(), session.isMapped());
	        	return (mappingData!=null && session.getColorMappingById(mappingData.getMapValue())!=null); 
	        })
			.attr("mapped",function(node){
				var mappingData = node.getMappingDataByNameAndCond(session.getActiveMapping(), session.isMapped());
	        	
				if(session.getMappingDataType()=="Continuous"){
					if(session.getColorMappingsSet()[0]<session.getColorMappingsSet()[1]){
						maxValue = session.getColorMappingsSet()[1];
						minValue = session.getColorMappingsSet()[0];
					}
					else
					{
						maxValue = session.getColorMappingsSet()[0];
						minValue = session.getColorMappingsSet()[1];
					}
					
					var generalStyle = _metExploreViz.getGeneralStyle();
					var colorMin=generalStyle.getColorMinMappingContinuous();
					var colorMax=generalStyle.getColorMaxMappingContinuous();

					var colorScale = d3.scale.linear()
					    .domain([parseFloat(minValue), parseFloat(maxValue)])
					    .range([colorMin, colorMax]);
					
					return colorScale(parseFloat(mappingData.getMapValue()));
				}

				var color = session.getColorMappingById(mappingData.getMapValue()).getValue();
				return color;
			})
			.style("fill",function(node){
				var mappingData = node.getMappingDataByNameAndCond(session.getActiveMapping(), session.isMapped());
	        	d3.select(this)
					.insert("rect", ":first-child")
					.attr("class", "stroke")
					.attr("width", parseInt(d3.select(this).select("."+node.getBiologicalType()).attr("width"))+10)
					.attr("height", parseInt(d3.select(this).select("."+node.getBiologicalType()).attr("height"))+10)
					.attr("rx", parseInt(d3.select(this).select("."+node.getBiologicalType()).attr("rx"))+5)
					.attr("ry",parseInt(d3.select(this).select("."+node.getBiologicalType()).attr("ry"))+5)
					.attr("transform", "translate(-" + parseInt(parseInt(d3.select(this).select("."+node.getBiologicalType()).attr("width"))+10) / 2 + ",-"
											+ parseInt(parseInt(d3.select(this).select("."+node.getBiologicalType()).attr("height"))+10) / 2
											+ ")")
					.style("opacity", '0.5')
					.style("fill", 'red');
				if(session.getMappingDataType()=="Continuous"){
					if(parseFloat(session.getColorMappingsSet()[0].getName())<parseFloat(session.getColorMappingsSet()[1].getName())){
						maxValue = parseFloat(session.getColorMappingsSet()[1].getName());
						minValue = parseFloat(session.getColorMappingsSet()[0].getName());
					}
					else
					{
						maxValue = parseFloat(session.getColorMappingsSet()[0].getName());
						minValue = parseFloat(session.getColorMappingsSet()[1].getName());
					}
					
					var generalStyle = _metExploreViz.getGeneralStyle();
					var colorMin=generalStyle.getColorMinMappingContinuous();
					var colorMax=generalStyle.getColorMaxMappingContinuous();

					var colorScale = d3.scale.linear()
						    .domain([parseFloat(minValue), parseFloat(maxValue)])
						    .range([colorMin, colorMax]);
						   
					return colorScale(parseFloat(mappingData.getMapValue()));

				}
				var color = session.getColorMappingById(mappingData.getMapValue()).getValue();
				return color;
			});

		// Sort compartiments store
		/*	
		metExploreD3.sortCompartmentInBiosource();
 		
 		// Change reactions stroke color by compartment
 		for(var i=0 ; i<metExploreD3.getCompartmentInBiosourceLength() ; i++){
 		
 			metExploreD3.GraphNode.node
 			.filter(function(d) {
 				return (d.getBiologicalType() =='metabolite' && d.getCompartment()==metExploreD3.getCompartmentInBiosourceSet()[i].getIdentifier() );
 			})
            .selectAll("rect")
            .style("stroke",metExploreD3.getCompartmentInBiosource()[i].getColor()); 
        }*/


		// metExploreD3.GraphNode.groupFill = function(d, i) { 
		// 	// Sort compartiments store
		// 	console.log(d.key);
		// 	console.log(i);
		// 	console.log(metExploreD3.getCompartmentInBiosourceSet()[i]);
		// 	metExploreD3.sortCompartmentInBiosource();
	 // 		var color;
	 // 		// Change reactions stroke color by compartment
	 // 		for(var j=0 ; j<metExploreD3.getCompartmentInBiosourceLength() ; j++){
	 // 			if(d.key==metExploreD3.getCompartmentInBiosourceSet()[j].getIdentifier() )
	 // 				color = metExploreD3.getCompartmentInBiosource()[j].getColor();
	 //        return color;
		// };
		// 62771 ms for recon before refactoring
		// 41465 ms now
		// var endall = new Date().getTime();
		// var timeall = endall - startall;
		// console.log("----Viz: FINISH refresh/ all "+timeall);
	},

	/*******************************************
	* Fonction call for each update
	* @param {} panel : The panel where the action is launched
	*/
	tick :function(panel) {
		d3.select("#"+panel).select("#D3viz").select("#graphComponent")
			.selectAll("g.node")
			.attr("cx", function(d) {
				return d.x;
			})
			.attr("cy", function(d) {
				return d.y;
			})
			.attr("transform", function(d) {
				//  scale("+ +")
				var scale = 1;
				if(d3.select(this)!=null){
					var transformString = d3.select(this).attr("transform");
					if(d3.select(this).attr("transform")!=null){
						var indexOfScale = transformString.indexOf("scale(");
						if(indexOfScale!=-1)
							scale = parseInt(transformString.substring(indexOfScale+6, transformString.length-1));
					}
				}
				return "translate(" + d.x + "," + d.y + ") scale("+scale+")";
			});

		if(panel=="viz"){
			var sessionsStore = _metExploreViz.getSessionsSet();
			var session = _metExploreViz.getSessionById(panel);
			if(session.isLinked()){
				for (var key in sessionsStore) {
					if(sessionsStore[key].isLinked() && panel!=sessionsStore[key].getId() && d3.select("#"+sessionsStore[key].getId()).select("#D3viz").select("#graphComponent")[0][0]!=null)
					{
						d3.select("#"+sessionsStore[key].getId()).select("#D3viz").select("#graphComponent")
							.selectAll("g.node")
							.each(function(node){
								d3.select("#viz").select("#D3viz").select("#graphComponent")
									.selectAll("g.node")
									.each(function(d){
										if(d.getId() == node.getId())
										{
											// Align nodes with the main graph
											node.x= d.x;
											node.y = d.y;
										}
									});
							});

						var scaleSess = metExploreD3.getScaleById(sessionsStore[key].getId());
    
						metExploreD3.GraphLink.tick(sessionsStore[key].getId(), scaleSess);
						_MyThisGraphNode.tick(sessionsStore[key].getId());
					}
				}
			}
		}
	},

	/*******************************************
	* Return data corresponding to the node
	* @param {} panel : The panel where the action is launched
	*/
	selectNodeData : function(node){
		return d3.select(node).datum();
	}, 

	/*******************************************
    * Function to select node (front-end)  
    * @param {} node : a set of nodes 
    */
    selectNodeFromGrid: function(id){
		d3.select("#viz").select("#D3viz")
            .selectAll("g.node")
            .filter(function(d){
                return d.getDbIdentifier()==id || d.getId()==id;
            })
            .each(function(d){
                if(!d.isSelected())
                    _MyThisGraphNode.selection(d, "viz")
            });
	},

	/*******************************************
	* Assign color according to metabolite compartment
	* @param {} selection : The selection of
	*/
	colorStoreByCompartment: function(selection){
		for(var i=0 ; i<metExploreD3.getCompartmentInBiosourceLength() ; i++){
	 		
 			selection
	 			.filter(function(d) {
	 				return (d.getBiologicalType() =='metabolite' 
	 					&& d.getCompartment()==metExploreD3.getCompartmentInBiosourceSet()[i].getIdentifier() );
	 			})
	            .selectAll("rect")
	            .style("stroke",metExploreD3.getCompartmentInBiosourceSet()[i].getColor()); 
        }
	},

	unselectAll : function(me) {
        var session = _metExploreViz.getSessionById(_MyThisGraphNode.activePanel);
        d3.select(me).select("#graphComponent")
            .selectAll("g.node")
            .filter(function(d) {  return d.isSelected(); })
            .each(function(d) { _MyThisGraphNode.selection(d, _MyThisGraphNode.activePanel); });
        session.removeAllSelectedNodes();
	},

	unselectIfDBClick : function() {
		var session = _metExploreViz.getSessionById(_MyThisGraphNode.activePanel);

		if(_MyThisGraphNode.dblClickable && d3.event.button==0){
			metExploreD3.GraphPanel.setActivePanel(this.parentNode.id);
            _MyThisGraphNode.unselectAll(this);
		}
		else
		{
			if(d3.event.button==0){
				_MyThisGraphNode.dblClickable = true;
				
				_MyThisGraphNode.taskClick = metExploreD3.createDelayedTask(
					function(){
                        _MyThisGraphNode.dblClickable=false;
                	}
                );

				metExploreD3.fixDelay(_MyThisGraphNode.taskClick, 400); 
			}
			else
			{
				
			}
		}

		if(_MyThisGraphNode.dblClickable && d3.event.button==1){
			metExploreD3.GraphPanel.setActivePanel(this.parentNode.id);
         	d3.select(this).select("#graphComponent")
				.selectAll("g.node")
		        .filter(function(d) { return d.isLocked(); })
		        .each(function(d) { d.fixed=false; d.setLocked(false); });
		}
		else
		{
			if(d3.event.button==1){
				_MyThisGraphNode.dblClickable = true;

				_MyThisGraphNode.taskClick = metExploreD3.createDelayedTask(
					function(){
                        _MyThisGraphNode.dblClickable=false;
                	}
                );

				metExploreD3.fixDelay(_MyThisGraphNode.taskClick, 400); 
			}
			else
			{

			}
		}	 
		if(session!=undefined)  
		{
			// We stop the previous animation
			if(session.isLinked()){
				var sessionMain = _metExploreViz.getSessionById('viz');
				if(sessionMain!=undefined)
				{
					var animLinked=metExploreD3.GraphNetwork.isAnimated(sessionMain.getId());
					if (animLinked=='true') {
						var force = sessionMain.getForce();
						if(force!=undefined)  
						{		
							if(metExploreD3.GraphNetwork.isAnimated(sessionMain.getId()) == 'true' 
								|| metExploreD3.GraphNetwork.isAnimated(sessionMain.getId()) == null) {
									force.start();
							}
						}
					}
				}
			}
			else
			{	
				
				var force = session.getForce();
				var animLinked=metExploreD3.GraphNetwork.isAnimated(session.getId());
				if (animLinked=='true') {
					var force = session.getForce();
					if(force!=undefined)  
					{		
						if((metExploreD3.GraphNetwork.isAnimated(session.getId()) == 'true') 
							|| (metExploreD3.GraphNetwork.isAnimated(session.getId())  == null)) {
								force.start();
						}
					}
				}
			}
		}
	},

	/*******************************************
	* To load nodes in visualization
	* @param {} panel : The panel where the action is launched
	*/
	loadNode : function(parent) {
		// Load user's preferences
		var reactionStyle = metExploreD3.getReactionStyle();
		
		var metaboliteStyle = metExploreD3.getMetaboliteStyle();
		var generalStyle = metExploreD3.getGeneralStyle();

		var session = _metExploreViz.getSessionById(parent);

		this.initShortCut();

		metExploreD3.GraphNode.panelParent = parent;

		_MyThisGraphNode = metExploreD3.GraphNode;

		
		var networkData=session.getD3Data();
	    var h = parseInt(d3.select("#"+_MyThisGraphNode.panelParent).select("#D3viz")
			.style("height"));
	    var w = parseInt(d3.select("#"+_MyThisGraphNode.panelParent).select("#D3viz")
			.style("width"));

	    // Create function to manage double click
	    d3.selectAll("#D3viz")
			.on("mouseup", this.unselectIfDBClick)
	 
	 	var scale = metExploreD3.getScaleById(parent);

	 	/***************************/
		// Var which permit to drag
		/***************************/
		var node_drag = d3.behavior.drag()
			.on("dragstart",_MyThisGraphNode.dragstart)
			.on("drag", _MyThisGraphNode.dragmove)
			.on("dragend", _MyThisGraphNode.dragend);

		// For each node we append a division of the class "node"
		metExploreD3.GraphNode.node = d3.select("#"+metExploreD3.GraphNode.panelParent).select("#D3viz").select("#graphComponent").selectAll("g.node")
			.data(networkData.getNodes()).enter()
				.append("svg:g").attr("class", "node")
				.attr("id", function(node){ return "node"+node.getId(); })
				.call(node_drag)
				.style("fill", function(d) { // Here we choose the color of the node if it's selected or not
					if (d.isSelected() == false) {
						return 'white';
					} else {
						return "grey";
					}
				});
				// Here it's the position by default for the beginning of force algorithm
				// .on("click", selection)
				// .style(
				// 	"stroke-dasharray", function(d) {
				// 		if (d.getReactionReversibility()) {
				// 			return "2,2";
				// 		} else {
				// 			return "";
				// 		}
				// 	}
				// )

		metExploreD3.GraphNode.applyEventOnNode(parent);

			metExploreD3.GraphNode.node
		        .filter(function(node){
		        	return node.getMappingDatasLength()>0 && session.getActiveMapping()!=""; 
		        })
				.attr("mapped",function(node){
					var mappingData = node.getMappingDataByNameAndCond(session.getActiveMapping(), session.isMapped());
					return session.getColorMappingById(mappingData.getMapValue());
				})
				.style("fill",function(node){
					var mappingData = node.getMappingDataByNameAndCond(session.getActiveMapping(), session.isMapped());
					return session.getColorMappingById(mappingData.getMapValue());
				});


		// For each metabolite we append a division of the class "rect" with the metabolite style by default or create by the user
		metExploreD3.GraphNode.node.filter(function(d) { return d.getBiologicalType() == 'metabolite' })
			.append("rect")
			.attr("class", function(d) {
							return d.getBiologicalType();
							})
			.attr("id", function(d) {
							return d.getId();
							})
			.attr("identifier", function(d) {
							return d.getId();
							})
			.attr("width", metaboliteStyle.getWidth())
			.attr("height", metaboliteStyle.getHeight())
			.attr("rx", metaboliteStyle.getRX())
			.attr("ry", metaboliteStyle.getRY())
			.attr("transform", "translate(-" + metaboliteStyle.getWidth() / 2 + ",-"
									+ metaboliteStyle.getHeight() / 2
									+ ")")
			.style("stroke", metaboliteStyle.getStrokeColor())
			.style("stroke-width", metaboliteStyle.getStrokeWidth());
		
		// to manage the selection visualization
		metExploreD3.GraphNode.node.filter(function(d) { return d.getBiologicalType() == 'metabolite' ;})
			.append("rect").attr("class","fontSelected")
			.attr("width", metaboliteStyle.getWidth())
			.attr("height", metaboliteStyle.getHeight())
			.attr("rx", metaboliteStyle.getRX())
			.attr("ry", metaboliteStyle.getRY())
			.attr( "transform", "translate(-" + metaboliteStyle.getWidth() / 2 + ",-" + metaboliteStyle.getHeight() / 2 + ")")
			.style("fill-opacity", '0')
			.style("fill", '#000');

		// For each reaction we append a division of the class "rect" with the reaction style by default or create by the user
		metExploreD3.GraphNode.node.filter(function(d) {
						return d.getBiologicalType() == 'reaction';
					})
			.append("rect").attr("class", function(d) {
						return d.getBiologicalType();
					})
			.attr("id", function(d) {
						return d.getId();
					})
			.attr("width", reactionStyle.getWidth())
			.attr("height", reactionStyle.getHeight())
			.attr("rx", reactionStyle.getRX())
			.attr("ry", reactionStyle.getRY())
			.attr( "transform", "translate(-" + reactionStyle.getWidth() / 2 + ",-" + reactionStyle.getHeight() / 2 + ")")
			.style("stroke", reactionStyle.getStrokeColor())
			.style("stroke-width", reactionStyle.getStrokeWidth())
			
		metExploreD3.GraphNode.node.filter(function(d) {
						return d.getBiologicalType() == 'reaction';
					})
			.append("rect").attr("class","fontSelected")
			.attr("width", reactionStyle.getWidth())
			.attr("height", reactionStyle.getHeight())
			.attr("rx", reactionStyle.getRX())
			.attr("ry", reactionStyle.getRY())
			.attr( "transform", "translate(-" + reactionStyle.getWidth() / 2 + ",-" + reactionStyle.getHeight() / 2 + ")")
			.style("fill-opacity", '0')
			.style("fill", '#000');

		
		// Sort compartiments store
		metExploreD3.sortCompartmentInBiosource();
 		
 		// Change reactions stroke color by compartment
 		for(var i=0 ; i<metExploreD3.getCompartmentInBiosourceLength() ; i++){
 		
 			metExploreD3.GraphNode.node
 			.filter(function(d) {
 				return (d.getBiologicalType() =='metabolite' && d.getCompartment()==metExploreD3.getCompartmentInBiosourceSet()[i].getIdentifier() );
 			})
            .selectAll("rect")
            .style("stroke",metExploreD3.getCompartmentInBiosourceSet()[i].getColor()); 
        }
		
		if (networkData.getNodes().length < generalStyle.getReactionThreshold() || !generalStyle.isDisplayedLabelsForOpt()) {
			var minDim = Math.min(metaboliteStyle.getWidth(),metaboliteStyle.getHeight());
			// We define the text for a metabolie WITHOUT the coresponding SVG image 
			metExploreD3.GraphNode.node.filter(function(d) { return d.getLabelVisible() == true; })
				.filter(function(d) { return d.getBiologicalType() == 'metabolite'; })
				.filter(function(d) { return d.getSvg() == "undefined" || d.getSvg()==undefined || d.getSvg()==""; })
				.addNodeText(metaboliteStyle);

			// We define the text for a metabolie WITH the coresponding SVG image 
			// Text definition
			metExploreD3.GraphNode.node
				.filter(function(d) { return d.getLabelVisible() == true; })
				.filter(function(d) { return d.getBiologicalType() == 'metabolite'; })
				.filter(function(d) { return d.getSvg() != "undefined" && d.getSvg()!=undefined && d.getSvg()!=""; })
				.addNodeText(metaboliteStyle);

			// Image definition
			metExploreD3.GraphNode.node
				.filter(
					function(d) {
						return (d.getBiologicalType() == 'metabolite' && d.getSvg() != "undefined" && d.getSvg()!=undefined && d.getSvg()!="");
					})
				.append("svg")
				.attr(
					"viewBox",
					function(d) {
						return "0 0 " + minDim
								+ " " + minDim;
				})
				.attr("width", minDim *8/10 + "px")
				.attr("height", minDim *8/10+ "px")
				.attr("x", (-minDim/2)+(minDim*1/10))
				.attr("preserveAspectRatio", "xMinYMin")
				.attr("y", (-minDim/2)+(minDim*1/10))
				.attr("class", "structure_metabolite")
				.append("image")
				.attr(
						"xlink:href",
						function(d) {
							return "resources/images/structure_metabolite/"
									+ d.getSvg();
						})
				.attr("width", "100%").attr(
						"height", "100%");

			// We define the text for a reaction
			metExploreD3.GraphNode.node
					.filter(function(d) {
						return d.getLabelVisible() == true;
					})
					.filter(function(d) {
						return d.getBiologicalType() == 'reaction';
					})
					.addNodeText(reactionStyle);
			
		}

		// Sort compartiments store
		/*	
		metExploreD3.sortCompartmentInBiosource();
 		
 		// Change reactions stroke color by compartment
 		for(var i=0 ; i<metExploreD3.getCompartmentInBiosourceLength() ; i++){
 		
 			metExploreD3.GraphNode.node
 			.filter(function(d) {
 				return (d.getBiologicalType() =='metabolite' && d.getCompartment()==metExploreD3.getCompartmentInBiosourceSet()[i].getIdentifier() );
 			})
            .selectAll("rect")
            .style("stroke",metExploreD3.getCompartmentInBiosource()[i].getColor()); 
        }*/
		metExploreD3.GraphNode.loadPath(parent);

		// metExploreD3.GraphNode.groupFill = function(d, i) { 
		// 	// Sort compartiments store
		// 	console.log(d.key);
		// 	console.log(i);
		// 	console.log(metExploreD3.getCompartmentInBiosourceSet()[i]);
		// 	metExploreD3.sortCompartmentInBiosource();
	 // 		var color;
	 // 		// Change reactions stroke color by compartment
	 // 		for(var j=0 ; j<metExploreD3.getCompartmentInBiosourceLength() ; j++){
	 // 			if(d.key==metExploreD3.getCompartmentInBiosourceSet()[j].getIdentifier() )
	 // 				color = metExploreD3.getCompartmentInBiosource()[j].getColor();
	 //        return color;
		// };
		// 62771 ms for recon before refactoring
		// 41465 ms now
		// var endall = new Date().getTime();
		// var timeall = endall - startall;
		// console.log("----Viz: FINISH refresh/ all "+timeall);
	},

	/*****************************************************
	* Set side compounds from array of nodes
	* @param {} sideCompounds : An array of id
	* @return {} bool : true if at less one is find
	*/
	loadSideCompounds : function(sideCompounds, func) {
	    var array = [];
	  	sideCompounds.forEach(function(sideCompound){
	  		var obj = {};
	  		obj.value=sideCompound;
			metExploreD3.fireEventParentWebSite("sideCompoundFromFile", obj);
	    	var node = _metExploreViz.getSessionById("viz").getD3Data().getNodeByDbIdentifier(sideCompound);

			if(node!=null){
				if(metExploreD3.getMetabolitesSet()!=undefined){
					var theMeta = metExploreD3.getMetaboliteById(metExploreD3.getMetabolitesSet(), node.getId());
					if(theMeta!= null)
						theMeta.set("sideCompound", true);
				}	
				node.setIsSideCompound(true);	
				array.push(node);
			}	
	    });
	    if (func!=undefined) {func()};
	    return array.length > 0;
	},

	/*******************************************
	* To load nodes in visualization
	* @param {} panel : The panel where the action is launched
	*/
	setIsSideCompoundById : function(idM, val) { 
        var networkData = _metExploreViz.getSessionById("viz").getD3Data();
		var nodes = networkData.getNodes();
       	if(nodes!=undefined)
        {
            var node=networkData.getNodeById(idM);
            if(node!=undefined)
                node.setIsSideCompound(val);
            
            var sessions =  _metExploreViz.getSessionsSet();
            for (var key in sessions) {                     
                if(sessions[key].getId()!='viz')
                {
                    var nodeLinked = sessions[key].getD3Data().getNodeById(idM)
                    nodeLinked.setIsSideCompound(val);
                    if(nodeLinked!=undefined)
                        nodeLinked.setIsSideCompound(val);
                }
            }    
        }

        var network = JSON.parse(_metExploreViz.getDataFromWebSite());

        network.nodes
	        .filter(function(node){
	        	return node.id==idM;
	        })
	        .forEach(function(node){
	        	node.isSideCompound=true;
	        });
	    _metExploreViz.setDataFromWebSite(JSON.stringify(network));
    },

	/*******************************************
	* To load alias in visualization
	* @param {} dbId : The dbId of element
	* @param {} alias : The alias value
	*/
	setAliasByDBId : function(dbId, alias) { 
		var me = this;
        var networkData = _metExploreViz.getSessionById("viz").getD3Data();
		var nodes = networkData.getNodes();
       	if(nodes!=undefined)
        {
            var node=networkData.getNodeByDbIdentifier(dbId);
            if(node!=undefined)
                node.setAlias(alias);
            
            var sessions =  _metExploreViz.getSessionsSet();
            for (var key in sessions) {                     
                if(sessions[key].getId()!='viz')
                {
                    var nodeLinked = sessions[key].getD3Data().getNodeByDbIdentifier(dbId)
                    nodeLinked.setAlias(alias);
                    if(nodeLinked!=undefined)
                        nodeLinked.setAlias(alias);
                }
            } 
            
			var network = JSON.parse(_metExploreViz.getDataFromWebSite());

			network.nodes
				.filter(function(node){
					return node.dbIdentifier==dbId;
				})
				.forEach(function(node){
					node.alias=alias;
				});

			var metaboliteStyle = metExploreD3.getMetaboliteStyle();
			var reactionStyle = metExploreD3.getReactionStyle();
			var generalStyle = metExploreD3.getGeneralStyle();

			var nodes = d3.select("#viz").select("#D3viz").select("#graphComponent")
				.selectAll("g.node") 

			if(metaboliteStyle.isUseAlias()){
					nodes
						.filter(function(n){
							return node.getId() == n.getId();
						})
						.filter(function(n){
							return node.getBiologicalType() == 'metabolite';
						})
						.each(function(node){
							node.setLabel(alias);
							if(networkData.getNodes().length < generalStyle.getReactionThreshold() || !generalStyle.isDisplayedLabelsForOpt())
							{
								d3.select(this)
									.select("text")
									.remove();

								metExploreD3.GraphNode.addText(node, "viz");
							}
						});
			}

			if(reactionStyle.isUseAlias()){
					nodes
						.filter(function(n){
							return node.getId() == n.getId();
						})
						.filter(function(n){
							return node.getBiologicalType() == 'reac';
						})
						.each(function(node){
							node.setLabel(alias);
							if(networkData.getNodes().length < generalStyle.getReactionThreshold() || !generalStyle.isDisplayedLabelsForOpt())
							{
								metExploreD3.GraphNode.removeText(node, "viz");
								metExploreD3.GraphNode.addText(node, "viz");
							}
						});
			}
			_metExploreViz.setDataFromWebSite(JSON.stringify(network));   
        }

    },

	/*******************************************
	* To load nodes in visualization
	* @param {} panel : The panel where the action is launched
	*/
	setIsReversibleById : function(idR, val) { 
        var networkData = _metExploreViz.getSessionById("viz").getD3Data();
		var nodes = networkData.getNodes();
       	if(nodes!=undefined)
        {
            var node=networkData.getNodeById(idR);
            if(node!=undefined)
                node.setReactionReversibility(val);
            
            var sessions =  _metExploreViz.getSessionsSet();
            for (var key in sessions) {                     
                if(sessions[key].getId()!='viz')
                {
                    var nodeLinked = sessions[key].getD3Data().getNodeById(idR)
                    nodeLinked.setReactionReversibility(val);
                    if(nodeLinked!=undefined)
                        nodeLinked.setReactionReversibility(val);
                }
            }    
        }
    },

	/*******************************************
	* Init the visualization of links
	* @param {} parent : The panel where the action is launched
	* @param {} component : pathway or compartment
	*/
	loadPath : function(parent, component) {
		var session = _metExploreViz.getSessionById(parent);

		if(component=="Compartments"){
			var metabolites = d3.select("#"+parent).select("#D3viz").select("#graphComponent").selectAll("g.node").filter(function(d) { return d.getBiologicalType() == 'metabolite'; });
		
			session.groups = metExploreD3.getCompartmentsGroup();
			metExploreD3.GraphNetwork.initCentroids(parent);
		}
		else
		{
			session.groups = metExploreD3.getPathwaysGroup(parent);
			metExploreD3.GraphNetwork.initCentroids(parent);
		}


        session.groupPath = function(d) {
        	var scale = metExploreD3.getScaleById(parent);
			if(d.values!=undefined)
			{				
				if(d.values.length>0)
				{
					if(d.values.length>2)
					{
					
						return "M" + 
					      d3.geom.hull(d.values.map(function(i) { return [i.x, i.y]; }))
					        .join("L")
					    + "Z";
					}
					else
					{			
						var fakeNodes = [];
						d.values.forEach(function(val){
							fakeNodes.push([val.x,val.y]);
						});
						var dx, dy;
						for (var i = d.values.length ; i < 3; i++) {
							dx = d.values[0].x*(1+0.00001*i);
							dy = d.values[0].y*(1+0.000011*i);
							fakeNodes.push([dx, dy]);
						};
						
						return "M" + 
					      d3.geom.hull(fakeNodes)
					        .join("L")
					    + "Z";
					}
				}
			}
		};

		metExploreD3.GraphNode.groupFill = function(d, i) {

			// Sort compartiments store
			if(component=="Pathways")
                var components = metExploreD3.getPathwaysSet(parent);
			else
                var components = metExploreD3.getCompartmentInBiosourceSet();


			var acomponent = components.find(function(c){
				return c.getName()==d.key;
			});
			return acomponent.getColor();
		};
            // Change reactions stroke color by compartment

		var pathTab = "M0,0L10,10Z";

		// If you want to use selection on compartments path
		// d3.select("#"+metExploreD3.GraphNode.panelParent).select("#D3viz").select("graphComponent").selectAll("path")
		// 	.enter().insert("path", "g.node")


		d3.select("#"+parent).select("#D3viz").selectAll("path.convexhull")
		    .data(session.groups)
		    .enter()
		    	.insert("path", ":first-child")
			.attr("class", String)
		    .attr("d", function(d){ return pathTab; })
				.attr("class", function(d){ return d.key; })
				.classed("convexhull", true)
				.attr("id", function(d){ return d.key; })
				.style("fill", metExploreD3.GraphNode.groupFill)
				.style("stroke", metExploreD3.GraphNode.groupFill)
				.style("stroke-width", 40)
				.style("stroke-linejoin", "round")
				.style("opacity", .15)

	},
	
	/*******************************************
	* Fix all selected node
	*/
	fixSelectedNode : function() {
		metExploreD3.GraphNode.node
			.filter(function(node){ return node.isSelected();})
			.each(function(node){
				node.setLocked(true);
				node.fixed=node.isLocked();
			})		
	},
	unfixSelectedNode : function () {
        metExploreD3.GraphNode.node
            .filter(function(node){ return node.isSelected();})
            .each(function(node){
                node.setLocked(false);
                node.fixed=node.isLocked();
            })
    },

	applyEventOnNode : function (parent) {
        var reactionStyle = metExploreD3.getReactionStyle();
        var metaboliteStyle = metExploreD3.getMetaboliteStyle();
        metExploreD3.GraphNode.node
            .filter(function(d){ return !d.isDuplicated(); })
            .on("mouseenter", function(d) {

            	if (!metExploreD3.GraphStyleEdition.editMode) {
                    var transform = d3.select(this).attr("transform");
                    var scale = transform.substring(transform.indexOf("scale"), transform.length);
                    var scaleVal = scale.substring(6, scale.indexOf(')'));

                    if (isNaN(scaleVal))
                        scaleVal = 1;

                    d3.select(this).attr("transform", "translate(" + d.x + ", " + d.y + ") scale(" + scaleVal * 2 + ")");
                    // Prevent movement of the node label during mouseenter
                    var labelElement = d3.select(this).select("text");
                    var newY = (labelElement.attr("y")) ? labelElement.attr("y") / 2 : 0;
                    var newX = (labelElement.attr("x")) ? labelElement.attr("x") / 2 : 0;
                    var labelTranslate = d3.transform(labelElement.attr("transform")).translate;
                    var labelScale = d3.transform(labelElement.attr("transform")).scale;
                    if (metExploreD3.GraphStyleEdition.editMode) {
                        labelElement.attr("transform", "translate(" + (labelTranslate[0] / 2) + ", " + labelTranslate[1] / 2 + ") scale(" + (labelScale[0] / 2) + ", " + (labelScale[1] / 2) + ")");
                    }
                    else {
                        labelElement.attr("y", newY);
                        labelElement.attr("x", newX);
                        labelElement.attr("transform", "translate(" + (labelTranslate[0] / 2) + ", " + labelTranslate[1] / 2 + ") scale(" + labelScale + ")");
                    }
                    // Prevent movement of the node image during mouseenter
                    var imageElement = d3.select(this).select(".imageNode");
                    if (!imageElement.empty()) {
                        var imageTranslate = d3.transform(imageElement.attr("transform")).translate;
                        var imageScale = d3.transform(imageElement.attr("transform")).scale;
                        imageElement.attr("transform", "translate(" + (imageTranslate[0] / 2) + ", " + imageTranslate[1] / 2 + ") scale(" + (imageScale[0] / 2) + ", " + (imageScale[1] / 2) + ")");
                    }
                }

                var links = d3.select("#"+parent).select("#D3viz").select("#graphComponent").selectAll("path.link.reaction");

                if(d.getBiologicalType()=="reaction"){

                    links.filter(function(link){return d.getId()==link.getSource().getId();})
						.filter(function (link) {

							var linksover = d3.select(this.parentNode).selectAll("path.link");
							var last = linksover[0][linksover.size()-1];
							this.parentNode.appendChild(this, last);

							return d3.select(this).style("stroke") !== "rgb(0, 0, 255)";
                        })
                        .style("stroke", "green")
                        .style("stroke-width", "1.5");

                    links.filter(function(link){return d.getId()==link.getTarget().getId();})
                        .filter(function (link) {

							var linksover = d3.select(this.parentNode).selectAll("path.link");
							var last = linksover[0][linksover.size()-1];
							this.parentNode.appendChild(this, last);

                            return d3.select(this).style("stroke") !== "rgb(0, 0, 255)";
                        })
                        .style("stroke", "red")
                        .style("stroke-width", "1.5");
                }
                else
                {
                    links.filter(function(link){return d.getId()==link.getSource().getId();})
                        .filter(function (link) {
							var linksover = d3.select(this.parentNode).selectAll("path.link");
							var last = linksover[0][linksover.size()-1];
							this.parentNode.appendChild(this, last);

                            return d3.select(this).style("stroke") !== "rgb(0, 0, 255)";
                        })
                        .style("stroke", "red")
                        .style("stroke-width", "1.5");

                    links.filter(function(link){return d.getId()==link.getTarget().getId();})
                        .filter(function (link) {
							var linksover = d3.select(this.parentNode).selectAll("path.link");
							var last = linksover[0][linksover.size()-1];
							this.parentNode.appendChild(this, last);

                            return d3.select(this).style("stroke") !== "rgb(0, 0, 255)";
                        })
                        .style("stroke", "green")
                        .style("stroke-width", "1.5");
                }
            })
            .on("mouseover", function(d) {
                var nodes = d3.select("#"+parent).select("#D3viz").select("#graphComponent").selectAll("g.node");

                d3.select(this)
                    .each(function(node){
                        var last = nodes[0][nodes.size()-1];
                        this.parentNode.insertBefore(this, last);
                    });

                d.fixed = true;
                if(parent=="viz")
                {
                    d3.select("#"+parent)
                        .selectAll('g.node')
                        .filter(function(node){return node==d})
                        .select('.locker')
                        .classed('hide', false)
                        .select('.iconlocker')
                        .attr(
                            "xlink:href",
                            function(d) {
                                if(d.isLocked())
                                    return "resources/icons/lock_font_awesome.svg";
                                else
                                    return "resources/icons/unlock_font_awesome.svg";
                            });
                }
            })
            .on("mouseleave", function(d) {

                metExploreD3.GraphNode.node
                    .filter(function (node) {
                        return node == d
                    })
                    .select('.locker')
                    .classed('hide', true);

                
                if (!metExploreD3.GraphStyleEdition.editMode) {
                    var transform = d3.select(this).attr("transform");
                    var scale = transform.substring(transform.indexOf("scale"), transform.length);
                    var scaleVal = scale.substring(6, scale.indexOf(')'));
                    if (isNaN(scaleVal))
                        scaleVal = 1;

                    d3.select(this).attr("transform", "translate(" + d.x + ", " + d.y + ") scale(" + scaleVal / 2 + ")");
                    // Prevent  movement of the node label during mouseleave
                    var labelElement = d3.select(this).select("text");
                    var newY = (labelElement.attr("y")) ? labelElement.attr("y") * 2 : 0;
                    var newX = (labelElement.attr("x")) ? labelElement.attr("x") * 2 : 0;
                    var labelTranslate = d3.transform(labelElement.attr("transform")).translate;
                    var labelScale = d3.transform(labelElement.attr("transform")).scale;
                    if (metExploreD3.GraphStyleEdition.editMode) {
                        labelElement.attr("transform", "translate(" + (labelTranslate[0] * 2) + ", " + labelTranslate[1] * 2 + ") scale(" + labelScale[0] * 2 + ", " + labelScale[1] * 2 + ")")
                    }
                    else {
                        labelElement.attr("y", newY);
                        labelElement.attr("x", newX);
                        labelElement.attr("transform", "translate(" + (labelTranslate[0] * 2) + ", " + labelTranslate[1] * 2 + ") scale(" + labelScale + ")");
                    }
                    // Prevent  movement of the node label during mouseleave
                    var imageElement = d3.select(this).select(".imageNode");
                    if (!imageElement.empty()) {
                        var imageTranslate = d3.transform(imageElement.attr("transform")).translate;
                        var imageScale = d3.transform(imageElement.attr("transform")).scale;
                        imageElement.attr("transform", "translate(" + (imageTranslate[0] * 2) + ", " + imageTranslate[1] * 2 + ") scale(" + (imageScale[0] * 2) + ", " + (imageScale[1] * 2) + ")");
                    }
                }

                if(!d.isLocked())
                    d.fixed = false;
                var linkStyle = metExploreD3.getLinkStyle();

				d3.select("#"+parent).select("#D3viz").select("#graphComponent")
                    .selectAll("path.link.reaction")
                    .filter(function(link){return d.getId()==link.getSource().getId() || d.getId()==link.getTarget().getId();})
                    .filter(function (link) {
                        return d3.select(this).style("stroke") !== "rgb(0, 0, 255)";
                    })
                    .style("stroke",linkStyle.getStrokeColor())
                    .style("stroke-width", "0.5").each(function(){
                    var linksover = d3.select(this.parentNode).selectAll("path.link");
                    var first = linksover[0][0];
                    this.parentNode.insertBefore(this, first);
                });


                if(d.getBiologicalType()=="reaction"){
                    d3.select(this).selectAll("rect").selectAll(".reaction, .fontSelected").transition()
                        .duration(750)
                        .attr("width", reactionStyle.getWidth())
                        .attr("height", reactionStyle.getHeight())
                        .attr( "transform", "translate(-" + reactionStyle.getWidth() / 2 + ",-" + reactionStyle.getHeight() / 2 + ")");
                }
                else
                {

                    d3.select(this).selectAll("rect").selectAll(".metabolite, .fontSelected").transition()
                        .duration(750)
                        .attr("width", metaboliteStyle.getWidth())
                        .attr("height", metaboliteStyle.getHeight())
                        .attr("transform", "translate(-" + metaboliteStyle.getWidth() / 2 + ",-"
                            + metaboliteStyle.getHeight() / 2
                            + ")");
                }
            });

        metExploreD3.GraphNode.node
            .filter(function(d){ return d.isDuplicated(); })
            .on("mouseenter", function(d) {
                if (!metExploreD3.GraphStyleEdition.editMode) {
                    var transform = d3.select(this).attr("transform");
                    var scale = transform.substring(transform.indexOf("scale"), transform.length);
                    var scaleVal = scale.substring(6, scale.indexOf(')'));

                    if (isNaN(scaleVal))
                        scaleVal = 1;

                    d3.select(this).attr("transform", "translate(" + d.x + ", " + d.y + ") scale(" + scaleVal * 2 + ")");
                    // Prevent movement of the node label during mouseenter
                    var labelElement = d3.select(this).select("text");
                    var newY = (labelElement.attr("y")) ? labelElement.attr("y") / 2 : 0;
                    var newX = (labelElement.attr("x")) ? labelElement.attr("x") / 2 : 0;
                    var labelTranslate = d3.transform(labelElement.attr("transform")).translate;
                    var labelScale = d3.transform(labelElement.attr("transform")).scale;
                    if (metExploreD3.GraphStyleEdition.editMode) {
                        labelElement.attr("transform", "translate(" + (labelTranslate[0] / 2) + ", " + labelTranslate[1] / 2 + ") scale(" + (labelScale[0] / 2) + ", " + (labelScale[1] / 2) + ")");
                    }
                    else {
                        labelElement.attr("y", newY);
                        labelElement.attr("x", newX);
                        labelElement.attr("transform", "translate(" + (labelTranslate[0] / 2) + ", " + labelTranslate[1] / 2 + ") scale(" + labelScale + ")");
                    }
                    // Prevent movement of the node image during mouseenter
                    var imageElement = d3.select(this).select(".imageNode");
                    if (!imageElement.empty()) {
                        var imageTranslate = d3.transform(imageElement.attr("transform")).translate;
                        var imageScale = d3.transform(imageElement.attr("transform")).scale;
                        imageElement.attr("transform", "translate(" + (imageTranslate[0] / 2) + ", " + imageTranslate[1] / 2 + ") scale(" + (imageScale[0] / 2) + ", " + (imageScale[1] / 2) + ")");
                    }
                }

                var links = d3.select("#"+parent).select("#D3viz").select("#graphComponent").selectAll("path.link.reaction");

                if(d.getBiologicalType()=="reaction"){

                    links
						.filter(function(link){
							return d.getId()==link.getSource().getId();
						})
                        .style("stroke", "green")
                        .style("stroke-width", "1.5")
						.each(function() {
							var linksover = d3.select(this.parentNode).selectAll("path.link");
							var last = linksover[0][linksover.size()-1];
							this.parentNode.appendChild(this, last);
						});

                    links
						.filter(function(link){
							return d.getId()==link.getTarget().getId();
						})
                        .style("stroke", "red")
                        .style("stroke-width", "1.5")
						.each(function() {
							var linksover = d3.select(this.parentNode).selectAll("path.link");
							var last = linksover[0][linksover.size()-1];
							this.parentNode.appendChild(this, last);
						});
                }
                else
                {
                    links
						.filter(function(link){
							return d.getId()==link.getSource().getId();
						})
                        .style("stroke", "red")
                        .style("stroke-width", "1.5")
                        .each(function() {
                            var linksover = d3.select(this.parentNode).selectAll("path.link");
                            var last = linksover[0][linksover.size()-1];
                            this.parentNode.appendChild(this, last);
                        });

                    links
						.filter(function(link){
							return d.getId()==link.getTarget().getId();
						})
                        .style("stroke", "green")
                        .style("stroke-width", "1.5")
                        .each(function() {
                            var linksover = d3.select(this.parentNode).selectAll("path.link");
                            var last = linksover[0][linksover.size()-1];
                            this.parentNode.appendChild(this, last);
                        });
                }
            })
            .on("mouseover", function(d) {
                var nodes = d3.select("#"+parent).select("#D3viz").select("#graphComponent").selectAll("g.node");
                d3.select(this)
                    .each(function(node){
                        var last = nodes[0][nodes.size()-1];
                        this.parentNode.insertBefore(this, last);
                    });

                d.fixed = true;
                if(parent=="viz")
                {
                    d3.select("#"+parent)
                        .selectAll('g.node')
                        .filter(function(node){return node==d})
                        .select('.locker')
                        .classed('hide', false)
                        .select('.iconlocker')
                        .attr(
                            "xlink:href",
                            function(d) {
                                if(d.isLocked())
                                    return "resources/icons/lock_font_awesome.svg";
                                else
                                    return "resources/icons/unlock_font_awesome.svg";
                            });
                }

                if(d.getBiologicalType()=="reaction"){
                    d3.select("#"+parent).select("#D3viz").select("#graphComponent")
                        .selectAll("path.link.reaction")
                        .filter(function(link){return d.getId()==link.getSource().getId();})
                        .style("stroke", "green");

                    d3.select("#"+parent).select("#D3viz").select("#graphComponent")
                        .selectAll("path.link.reaction")
                        .filter(function(link){return d.getId()==link.getTarget().getId();})
                        .style("stroke", "red");
                }
                else
                {
                    d3.select("#"+parent).select("#D3viz").select("#graphComponent")
                        .selectAll("path.link.reaction")
                        .filter(function(link){return d.getId()==link.getSource().getId();})
                        .style("stroke", "red");

                    d3.select("#"+parent).select("#D3viz").select("#graphComponent")
                        .selectAll("path.link.reaction")
                        .filter(function(link){return d.getId()==link.getTarget().getId();})
                        .style("stroke", "green");
                }
            })
            .on("mouseleave", function(d) {
                metExploreD3.GraphNode.node
                    .filter(function (node) {
                        return node == d
                    })
                    .select('.locker')
                    .classed('hide', true);

                if (!metExploreD3.GraphStyleEdition.editMode) {
                    var transform = d3.select(this).attr("transform");
                    var scale = transform.substring(transform.indexOf("scale"), transform.length);
                    var scaleVal = scale.substring(6, scale.indexOf(')'));
                    if (isNaN(scaleVal))
                        scaleVal = 1;

                    d3.select(this).attr("transform", "translate(" + d.x + ", " + d.y + ") scale(" + scaleVal / 2 + ")");
                    // Prevent  movement of the node label during mouseleave
                    var labelElement = d3.select(this).select("text");
                    var newY = (labelElement.attr("y")) ? labelElement.attr("y") * 2 : 0;
                    var newX = (labelElement.attr("x")) ? labelElement.attr("x") * 2 : 0;
                    var labelTranslate = d3.transform(labelElement.attr("transform")).translate;
                    var labelScale = d3.transform(labelElement.attr("transform")).scale;
                    if (metExploreD3.GraphStyleEdition.editMode) {
                        labelElement.attr("transform", "translate(" + (labelTranslate[0] * 2) + ", " + labelTranslate[1] * 2 + ") scale(" + labelScale[0] * 2 + ", " + labelScale[1] * 2 + ")")
                    }
                    else {
                        labelElement.attr("y", newY);
                        labelElement.attr("x", newX);
                        labelElement.attr("transform", "translate(" + (labelTranslate[0] * 2) + ", " + labelTranslate[1] * 2 + ") scale(" + labelScale + ")");
                    }
                    // Prevent  movement of the node label during mouseleave
                    var imageElement = d3.select(this).select(".imageNode");
                    if (!imageElement.empty()) {
                        var imageTranslate = d3.transform(imageElement.attr("transform")).translate;
                        var imageScale = d3.transform(imageElement.attr("transform")).scale;
                        imageElement.attr("transform", "translate(" + (imageTranslate[0] * 2) + ", " + imageTranslate[1] * 2 + ") scale(" + (imageScale[0] * 2) + ", " + (imageScale[1] * 2) + ")");
                    }
                }

                if(!d.isLocked())
                    d.fixed = false;
                var linkStyle = metExploreD3.getLinkStyle();


                d3.select("#"+parent).select("#D3viz").select("#graphComponent")
                    .selectAll("path.link.reaction")
                    .filter(function(link){
                        return d.getId()==link.getSource().getId() || d.getId()==link.getTarget().getId();
                    })
                    .style("stroke",linkStyle.getStrokeColor())
                    .style("stroke-width", "0.5")
                    .each(function(){
                        var linksover = d3.select(this.parentNode).selectAll("path.link");
                        var first = linksover[0][0];
                        this.parentNode.insertBefore(this, first);
                    });

                if(d.getBiologicalType()=="reaction"){
                    d3.select(this).selectAll("rect").selectAll(".reaction, .fontSelected").transition()
                        .duration(750)
                        .attr("width", reactionStyle.getWidth())
                        .attr("height", reactionStyle.getHeight())
                        .attr( "transform", "translate(-" + reactionStyle.getWidth() / 2 + ",-" + reactionStyle.getHeight() / 2 + ")");
                }
                else
                {

                    d3.select(this).selectAll("rect").selectAll(".reaction, .fontSelected").transition()
                        .duration(750)
                        .attr("width", metaboliteStyle.getWidth())
                        .attr("height", metaboliteStyle.getHeight())
                        .attr("transform", "translate(-" + metaboliteStyle.getWidth() / 2 + ",-"
                            + metaboliteStyle.getHeight() / 2
                            + ")");
                }
            });

    }

}
