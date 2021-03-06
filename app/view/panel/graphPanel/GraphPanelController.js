Ext.define('metExploreViz.view.panel.graphPanel.GraphPanelController', {
	extend: 'Ext.app.ViewController',
	alias: 'controller.panel-graphpanel-graphpanel',

	// requires:['metexplore.model.d3.Network','metexplore.global.Graph'],


/**
 * Aplies event linsteners to the view
 */
	init:function(){
		var me 		= this,
		viewModel   = me.getViewModel(),
		view      	= me.getView();

		Ext.QuickTips.init();
		// Ext.tip.QuickTipManager.init();
		
		view.on({
			setLoadButtonHidden : me.changeoption,
			afterrefresh : function(){
				var buttonCopyNetwork = view.lookupReference('buttonCopyNetwork');
				var buttonSaveNetwork = view.lookupReference('buttonSaveNetwork');
				var vizMiningMenu = view.lookupReference('vizMiningMenuID');
                var vizImportMenuID = view.lookupReference('vizImportMenuID');
                var vizExportMenuID = view.lookupReference('vizExportMenuID');
                var vizSaveMenuID = view.lookupReference('vizSaveMenuID');
                var vizDrawingMenu = view.lookupReference('vizDrawingMenuID');
                var vizLoadMenu = view.lookupReference('vizLoadMenuID');
                var searchNode = view.lookupReference('searchNode');

				if(searchNode!=undefined)
				{
					searchNode.setDisabled(false);
				}	

				if(buttonCopyNetwork!=undefined)
				{
					buttonCopyNetwork.setDisabled(false);
					buttonCopyNetwork.setTooltip('The graph will be copied in an other frame');
				}	

				if(buttonSaveNetwork!=undefined)
				{
					buttonSaveNetwork.setDisabled(false);
					buttonSaveNetwork.setTooltip('The graph will be saved in json file');
				}	

                if(vizMiningMenu!=undefined)
				{
	                vizMiningMenu.setDisabled(false); 
	                vizMiningMenu.setTooltip('Sub-network extraction/visualisation');
                }

                if(vizExportMenuID!=undefined)
				{
	                vizExportMenuID.setDisabled(false); 
					vizExportMenuID.setTooltip('Export network as an image');
                }

                if(vizImportMenuID!=undefined)
				{
	                vizImportMenuID.setDisabled(false); 
					vizImportMenuID.setTooltip('Import data on nodes');
                }

                if(vizSaveMenuID!=undefined)
				{
	                vizSaveMenuID.setDisabled(false); 
					vizSaveMenuID.setTooltip('Save drawing');
                }

                if(vizDrawingMenu!=undefined)
				{
	                vizDrawingMenu.setDisabled(false); 
	                vizDrawingMenu.setTooltip('Change network drawing');
	            }

                if(vizLoadMenu!=undefined)
				{
	                vizLoadMenu.setDisabled(false); 
	                vizLoadMenu.setTooltip('Load a network in the visualisation');
	            }
			},
			initSearch : me.initSearch,
			scope:me
		});

		view.on({
			afterrefresh : me.drawCaption,
			scope:me
		});
		
		view.lookupReference('searchNodeButton').on({
			click : me.searchNode,
			scope : me
		});

		view.lookupReference('enterEditMode').on({
			click : me.enterEditMode,
			scope : me
		});
	},

	changeoption : function(){
		var me 		= this,
		view      	= me.getView();

		if(metExploreD3.getGeneralStyle().loadButtonIsHidden()){
			metExploreD3.hideInitialLoadButtons();
			if(!view.lookupReference('vizLoadMenuID').hidden)
				view.lookupReference('vizLoadMenuID').setHidden(true);
		}
	},

	drawCaption : function(){
		metExploreD3.GraphCaption.drawCaption();
	},

	/*****************************************************
	* init field
	*/
	initSearch : function() {
		var me 		= this,
		viewModel   = me.getViewModel(),
		view      	= me.getView();
		if(view.lookupReference("searchNodeTextField").getValue()!="")
		{
			view.lookupReference("searchNodeTextField").reset();
		}
	},


	/*****************************************************
	* Search node in the visualisation by name, ec, compartment
	*/
	searchNode : function() {
		var me 		= this,
		viewModel   = me.getViewModel(),
		view      	= me.getView();
		if(view.lookupReference("searchNodeTextField").getValue()=="happyfox")
		{
			d3.select("#viz").select("#D3viz")
				.style("background-image","url('resources/images/easteregg/foxegg.jpg')")
				.style("background-repeat","round");
		}
		if(view.lookupReference("searchNodeTextField").getValue()=="joyeuxnoel")
		{
			d3.select("#viz").select("#D3viz").select("#graphComponent").selectAll("g.linkGroup").selectAll("*").remove();
			d3.select("#viz").select("#D3viz").select("#graphComponent").selectAll("g.node").selectAll("*").remove();

			d3.select("#viz").select("#D3viz").select("#graphComponent").selectAll("g.node")
				.filter(
					function(d) {
						return (d.getBiologicalType() == 'reaction');
					}
				)
				.append("image")
				.attr("xlink:href","resources/images/easteregg/giftegg.svg")
				.attr("width", "50px")
				.attr("height", "50px")
				.attr("transform", "translate(-25,-25)");

			d3.select("#viz").select("#D3viz").select("#graphComponent").selectAll("g.node")
				.filter(
					function(d) {
						return (d.getBiologicalType() == 'metabolite');
					}
				)
				.append("image")
				.attr("xlink:href","resources/images/easteregg/sapinegg.svg")
				.attr("width", "70px")
				.attr("height", "70px")
				.attr("transform", "translate(-35,-35)");
		}

		if(view.lookupReference("searchNodeTextField").getValue()=="halloween")
		{
			d3.select("#viz").select("#D3viz")
				.style("background-image","url('resources/images/easteregg/happyhalloween.png')")
				.style("background-repeat","round");
			
			d3.select("#viz").select("#D3viz").select("#graphComponent").selectAll("g.linkGroup").selectAll("*").remove();
			d3.select("#viz").select("#D3viz").select("#graphComponent").selectAll("g.node").selectAll("*").remove();

			d3.select("#viz").select("#D3viz").select("#graphComponent").selectAll("g.node")
				.filter(
					function(d) {
						return (d.getBiologicalType() == 'reaction');
					}
				)
				.append("image")
				.attr("xlink:href","resources/images/easteregg/pumpkin.png")
				.attr("width", "70px")
				.attr("height", "70px")
				.attr("transform", "translate(-25,-25)");

			var metabolites = d3.select("#viz").select("#D3viz").select("#graphComponent").selectAll("g.node")
				.filter(
					function(d) {
						return (d.getBiologicalType() == 'metabolite');
					}
				)

			metabolites
				.filter(
					function(d, i) {
						return (i <= metabolites[0].length/4*3);
					}
				)
				.append("image")
				.attr("xlink:href","resources/images/easteregg/bat.gif")
				.attr("width", "70px")
				.attr("height", "70px")
				.attr("transform", "translate(-35,-35)");
			
			metabolites
				.filter(
					function(d, i) {
						return (i > metabolites[0].length/6*5 && i!=metabolites[0].length-1);
					}
				)
				.append("image")
				.attr("xlink:href","resources/images/easteregg/witch.png")
				.attr("width", "120px")
				.attr("height", "120px")
				.attr("transform", "translate(-35,-35)");

			metabolites
				.filter(
					function(d, i) {
						return (i == metabolites[0].length-1);
					}
				)
				.append("image")
				.attr("xlink:href","resources/images/easteregg/feedme.png")
				.attr("width", "170px")
				.attr("height", "170px")
				.attr("transform", "translate(-35,-35)");

		}

		if(view.lookupReference("searchNodeTextField").getValue()=="worldchampion")
		{
			// d3.select("#viz").select("#D3viz")
			// 	.style("background-image","url('resources/images/easteregg/happyhalloween.png')")
			// 	.style("background-repeat","round");
			
			d3.select("#viz").select("#D3viz").select("#graphComponent").selectAll("g.node").selectAll("*").remove();

			d3.select("#viz").select("#D3viz").select("#graphComponent").selectAll("g.node")
				.filter(
					function(d) {
						return (d.getBiologicalType() == 'reaction');
					}
				)
				.append("image")
				.attr("xlink:href","resources/images/easteregg/wc/drapeau-tricolore.png")
				.attr("width", "70px")
				.attr("height", "70px")
				.attr("transform", "translate(-35,-35)");

			var metabolites = d3.select("#viz").select("#D3viz").select("#graphComponent").selectAll("g.node")
				.filter(
					function(d) {
						return (d.getBiologicalType() == 'metabolite');
					}
				)

			metabolites
				.filter(
					function(d, i) {
						return (i > 5);
					}
				)
				.append("image")
				.attr("xlink:href","resources/images/easteregg/wc/drapeau-tricolore.png")
				.attr("width", "70px")
				.attr("height", "70px")
				.attr("transform", "translate(-35,-35)");

			metabolites
				.filter(
					function(d, i) {
						return (i == 0 || i == 1);
					}
				)
				.append("image")
				.attr("xlink:href","resources/images/easteregg/wc/coupe_du_monde.png")
				.attr("width", "120px")
				.attr("height", "120px")
				.attr("transform", "translate(-60,-60)");

			metabolites.filter(
					function(d, i) {
						return (i == 2);
					}
				)
				.append("image")
				.attr("xlink:href","resources/images/easteregg/wc/zizou.png")
				.attr("width", "300px")
				.attr("height", "300px")
				.attr("transform", "translate(-150,-150)");

			metabolites
				.filter(
					function(d, i) {
						return (i == 3);
					}
				)
				.append("image")
				.attr("xlink:href","resources/images/easteregg/wc/francais.png")
				.attr("width", "300px")
				.attr("height", "300px")
				.attr("transform", "translate(-150,-150)");

			metabolites
				.filter(
					function(d, i) {
						return (i == 5 || i == 4);
					}
				)
				.append("image")
				.attr("xlink:href","resources/images/easteregg/wc/star.png")
				.attr("width", "100px")
				.attr("height", "100px")
				.attr("transform", "translate(-50,-50)");

		}

		metExploreD3.GraphNode.searchNode(view.lookupReference("searchNodeTextField").getValue());
	},

	/*****************************************************
	* Update the network to fit the cart content
	*/
	refresh : function() {
		var vizComp = Ext.getCmp("viz");
		if(vizComp!=undefined){
			var myMask = new Ext.LoadMask({
				target:vizComp,
				msg:"Refresh in process...", 
				msgCls:'msgClsCustomLoadMask'});
			myMask.show();

			var that = this;
	        setTimeout(
						function() {
				
				// var startall = new Date().getTime();
				//var start = new Date().getTime();
				// console.log("----Viz: START refresh/init Viz");
				
			    that.initData();

			    // Init of metabolite network
				metExploreD3.GraphNetwork.refreshSvg('viz');

				// 62771 ms for recon before refactoring
				// 41465 ms now
				// var endall = new Date().getTime();
				// var timeall = endall - startall;
				// console.log("----Viz: FINISH refresh/ all "+timeall);
				myMask.hide();
				var graphCmp = Ext.getCmp('graphPanel');
				if(graphCmp!=undefined)
					graphCmp.fireEvent('afterrefresh');
		    }, 100);
		}
	},

	

	/*****************************************************
	* Fill the data models with the store reaction
	*/
	initData : function(){
		
		var networkVizSession = Ext.getStore('S_NetworkVizSession').getById("viz");
		
		// Reset visualisation---less than a ms
		networkVizSession.reset();

		var networkDataStore = Ext
				.getStore('S_NetworkData');
		
		var networkData = new NetworkData('viz');

		var graph = networkVizSession.getGraph();

		/*****Ajout FV*******/

		/**
		 * 1) cart : mettre toutes les reactions dans node
		 * mettre idReaction dans un tableau (ListId) 2) Store
		 * LinkReactionMetabolite contient tous les edges pour
		 * le BioSource Filtrer le store pour avoir les edges
		 * des reactions du cart : filtre sur tableau ListId 3)
		 * pour chaque element du store filtre ajouter edge
		 */

		
		/*******************************************************/
		// console.log('storeAnnotReaction',storeAnnotReaction);
		// We go through each reaction of the cart and create
		// the related edges and nodes.
		/*******************************************************/
		var reactiondbIdentifier = "";
		var reactionID = "";
		var reactionName = "";

		// Get store content---few ms
		var cart = Ext.getStore('S_Cart');
		var ListIdReactions = [];
		var ListIdMetabolites = [];
		var storeAnnotR = Ext.getStore('S_AnnotationReaction');

		storeAnnotR.filter('field', 'reversible');

		cart
				.each(function(reaction) {

					reactiondbIdentifier = reaction
							.get('dbIdentifier');
					reactionID = reaction.get('id');
					ListIdReactions.push(reactionID);
					reactionName = reaction.get('name');// $("<div/>").html(reaction.get('name')).text();
					
					// Recherche annotation reversible
					var rec = storeAnnotR.findRecord('id',
							reactionID + '_reversible', 0,
							false, true, true);
					var ec=reaction.get('ec');

					if (rec)
						var reactionReversibility = rec
								.get('newV');
					else
						var reactionReversibility = reaction
								.get('reversible');

					networkData.addNode(reactionName,
							undefined, reactiondbIdentifier,
							reactionID, reactionReversibility,
							'reaction', false, true, undefined,
							undefined, undefined,undefined,reaction.get('alias'), ec);
					// Add node in the graph
					graph.addNode(reactionID);

					// If reaction is reversible, create the
					// back version of the node
					if (reaction.get('reversible')) {
						var idBack = reactionID + "_back";
						graph.addNode(idBack);
					}
				});

		var lenR = ListIdReactions.length;
		
		// Filtre store Link recupere les links de la liste des idReaction contenus dans cart
		var storeLink = Ext
				.getStore('S_LinkReactionMetabolite');

		storeLink.filterBy(function(record, id) {
			if (Ext.Array.indexOf(ListIdReactions, record
					.get("idReaction")) !== -1) {
				return true;
			}
			return false;
		}, this);

		var storeM = Ext.getStore('S_Metabolite');
		var storeAnnotM = Ext
				.getStore('S_AnnotationMetabolite');
		storeAnnotM.filter('field', 'sideCompound');

		var metaboliteID = "";
		var reactionID = "";
		var interaction = "";
		var reactionReversibility = true;
		var edgeID = "";

		var metaboliteName = "";
		var compartment = "";
		var dbMetabolite = "";
		var svgWidth = 0;
		var svgHeight = 0;

		var metaboliteMapIndex = 0;
		var reactionMapIndex = 0;
		var metaboliteMapIndex = 0;

		var idBack = "";

		storeLink
				.each(function(link) {

					metaboliteID = link.get('idMetabolite');
					reactionID = link.get('idReaction');
					interaction = link.get('interaction');

					// Recherche annotation reversible
					var rec = storeAnnotR.findRecord('id',
							reactionID + '_reversible');

					if (rec)
						reactionReversibility = rec.get('newV');
					else
						reactionReversibility = link
								.get('reversible');

					rec = storeAnnotM.findRecord('id',
							metaboliteID);
					if (rec)
						sideCompound = rec.get('newV');
					else
						sideCompound = link.get('side');

					edgeID = link.get('edgeId');
					var metaboliteMapIndex = ListIdMetabolites.indexOf(metaboliteID);
					//console.log(sideCompound);
					 if (sideCompound == 0
					 		|| sideCompound == 'false') {
					 	var isSsideCompoud = false;
					 }
					 else
					 	var isSsideCompoud = true;

						if (metaboliteMapIndex == -1) {
							/**
							 * metabolite non encore ajoute dans
							 * noeud*
							 */
							ListIdMetabolites
									.push(metaboliteID);

							var metabolite = storeM
									.getById(metaboliteID);
                            metaboliteName = metabolite
                                .get('name');
                            var alias = metabolite
                                .get('alias');
							compartment = metabolite
									.get('compartment');
							dbMetabolite = metabolite
									.get('dbIdentifier');
							var metaboliteSVG = metabolite
									.getSvgHW();
							svgWidth = 0;
							svgHeight = 0;
							if (metaboliteSVG != "undefined") {
								svgWidth = metaboliteSVG.width;
								svgHeight = metaboliteSVG.height;
							}

							networkData.addNode(metaboliteName,
									compartment, dbMetabolite,
									metaboliteID, undefined,
									'metabolite', false, true,
									metaboliteSVG.svg,
									svgWidth, svgHeight,isSsideCompoud,undefined,undefined,undefined,undefined,undefined,undefined,alias);

							metaboliteMapIndex = ListIdMetabolites
									.indexOf(metaboliteID);
						}

						reactionMapIndex = ListIdReactions
								.indexOf(reactionID);
						metaboliteMapIndex = metaboliteMapIndex
								+ lenR;

						if (reactionReversibility) {
							idBack = reactionID + "_back";
							if (interaction == 'in') {
								networkData.addLink(edgeID,
										metaboliteMapIndex,
										reactionMapIndex,
										interaction, 'true');
								// Add the edge reaction back ->
								// substrate
								graph.addEdge(idBack,
										metaboliteID);
								// Add also the regular edge
								// substrate -> reaction
								graph.addEdge(metaboliteID,
										reactionID);

							} else {
								networkData.addLink(edgeID,
										reactionMapIndex,
										metaboliteMapIndex,
										interaction, 'true');
								// Add the edge reaction back ->
								// substrate
								graph.addEdge(metaboliteID,
										idBack);
								// Add also the regular edge
								// substrate -> reaction
								graph.addEdge(reactionID,
										metaboliteID);
							}
						} else {
							if (interaction == 'in') {
								networkData.addLink(edgeID,
										metaboliteMapIndex,
										reactionMapIndex,
										interaction, 'false');
								graph.addEdge(metaboliteID,
										reactionID);

							} else {
								networkData.addLink(edgeID,
										reactionMapIndex,
										metaboliteMapIndex,
										interaction, 'false');
								// Add the edge substrate ->
								// reaction
								graph.addEdge(reactionID,
										metaboliteID);
							}
						}
					//}
				});
		storeLink.clearFilter();
		storeAnnotM.clearFilter();
		storeAnnotR.clearFilter();

		/***** Fin Ajout FV****/

		// Graph creation takes between 1 and 2s
		// var end = new Date().getTime();
		// var time = end - start;
		// console.log(networkVizSession);
		// console.log("----Viz: END refresh/Network creation
		// "+time);
		
		networkData.setId('viz');
		networkDataStore.add(networkData);

		networkVizSession.setD3Data(networkData);
	},

	/*******************************************
    * Export a json which describe a metabolic network. 
    */
	exportJSON : function() {
		var storeNetworkData = Ext.getStore('S_NetworkData');
		var storeReaction = metExploreD3.getReactionsSet();
		var storeMetabolite = metExploreD3.getMetabolitesSet();
		var storeCompartmentInBioSource = Ext.getStore('S_CompartmentInBioSource');
		var stringJSON = "";
		stringJSON+="{\"reaction\":[";
		var storeReactionMap  = Ext.create('Ext.data.Store',{
		    fields : ['id','ec','name','reversible']
		});

		storeReaction.each(function(reaction){
			storeNetworkData.getStoreById('viz').getNodes().forEach(function(node){
				if(node.getId() == reaction.get('id')){
					storeReactionMap.add({
					    id: node.getId(),
						ec: reaction.get('ec'),
					    name: node.getName(),
					    reversible: node.getReactionReversibility()
					});
				}
			});
		})
			
		for(var i=0 ; i<storeReactionMap.getCount() ; i++){
			stringJSON+=Ext.JSON.encode(storeReactionMap.getRange()[i].data);
			if(i!=storeReactionMap.getCount()-1)
				stringJSON+=',\n';
		}
		stringJSON+="],\n\n\"metabolite\":[";
		var storeMetaboliteMap  = Ext.create('Ext.data.Store',{
		    fields : ['id','name','chemicalFormula','compartment','inchi']
		});

		// var storeMapping = Ext.getStore('S_Mapping');

		storeNetworkData.getStoreById('viz').getNodes().forEach(function(node){
			storeMetabolite.each(function(metabolite){
				if(node.getId() == metabolite.get('id')){
					var mapped = metabolite.get('mapped')>0;
					// if(metabolite.get('mapped')>0){
					// 	storeMapping.each(function(map){
					// 		arrayId = map.get('idMapped').split(',');
					// 		arrayId.forEach(function(id){
					// 			if(id==node.getId())
					// 			{
					// 				var ndCond = map.get('condName').length;
					// 				for(var i =0; i<ndCond ; i++){

					// 				}
					// 			}
					// 		});
					// 	});		
					// }
					storeMetaboliteMap.add({
					    id: node.getId(),
						name: metabolite.get('name'),
						formula: metabolite.get('chemicalFormula'),
						compartment: metabolite.get('compartment'),
						inchi: metabolite.get('inchi'),
						mapped: mapped
					});
				}
			});
			if(node.isSideCompound()){
				var idNode = node.getId();
				idNode = idNode.split('-');
				var metabolite = storeMetabolite.getMetaboliteById(idNode[0]);
				var mapped = metabolite.get('mapped')>0;
				// if(metabolite.get('mapped')>0){
				// 	storeMapping.each(function(map){
				// 		arrayId = map.get('idMapped').split(',');
				// 		arrayId.forEach(function(id){
				// 			if(id==node.getId())
				// 			{
				// 				var ndCond = map.get('condName').length;
				// 				for(var i =0; i<ndCond ; i++){

				// 				}
				// 			}
				// 		});
				// 	});		
				// }
				storeMetaboliteMap.add({
				    id: node.getId(),
					name: metabolite.get('name'),
					formula: metabolite.get('chemicalFormula'),
					compartment: metabolite.get('compartment'),
					inchi: metabolite.get('inchi'),
					mapped: mapped
				});
			}
		})
			
		for(var i=0; i<storeMetaboliteMap.getCount() ; i++){
			stringJSON+=Ext.JSON.encode(storeMetaboliteMap.getRange()[i].data);
			if(i!=storeMetaboliteMap.getCount()-1)
				stringJSON+=',\n';
		}	

		stringJSON+="],\n\n\"link\":[";
		var storeLinkMap  = Ext.create('Ext.data.Store',{
		    fields : ['source','target','interaction']
		});

		storeNetworkData.getStoreById('viz').getLinks().forEach(function(link){
			storeLinkMap.add({
				source: link.source.getId(),
			    target: link.target.getId(),
			    interaction: link.interaction
			});
		});
			
		for(var i=0; i<storeLinkMap.getCount() ; i++){
			stringJSON+=Ext.JSON.encode(storeLinkMap.getRange()[i].data);
			if(i!=storeLinkMap.getCount()-1)
				stringJSON+=',\n';
		}	
	
		stringJSON+="],\n\n\"compartment\":[";
		var storeCompartment  = Ext.create('Ext.data.Store',{
		    fields : ['name','color']
		});

		storeCompartmentInBioSource.each(function(compartmentInBioSource){
			storeCompartment.add({
			    name: compartmentInBioSource.get('name'),
				color: compartmentInBioSource.get('color')
			});
		});
			
		for(var i=0; i<storeCompartment.getCount() ; i++){
			stringJSON+=Ext.JSON.encode(storeCompartment.getRange()[i].data);
			if(i!=storeCompartment.getCount()-1)
				stringJSON+=',\n';
		}	
		stringJSON+=']}\n';
			
		return stringJSON;
	},

	/*******************************************
    * Export a json file which describe a metabolic network. 
    */
	exportJsonFile : function() {
		var stringJSON = this.exportJSON();
		var link = document.createElement('a');
		link.download = 'data.json';
		var blob = new Blob([stringJSON], {type: 'text/plain'});
		link.href = window.URL.createObjectURL(blob);
		link.click();
	},

	/*******************************************
    * Export a XGMML file which describe a metabolic network. 
    */
	exportXGMML: function(){

		if (lib.javascript.metExploreViz.globals.Session.idUser == ""
			|| lib.javascript.metExploreViz.globals.Session.idUser == -1) {
			var winWarning = Ext.create("Ext.window.MessageBox", {
				height : 300
			});

			winWarning
			.alert('Warning',
			'You are not connected, the job will be available only during your session. ');

			winWarning.setPosition(50);
		}

		var svg = encodeURIComponent(metExploreD3.GraphUtils.exportMainSVG());
		var json = encodeURIComponent(this.exportJSON().replace(/\n/g,''));

		var bs = {"analysis_title":'Xgmml Export', "java_class": "metexplore.XgmmlExporter", "json": json, "svg": svg};
		Ext.Ajax.request({
			url:'src/php/application_binding/launchJavaApplication.php',
			method:'POST',
			params: bs,
			success: function(response, opts) {
				var json=Ext.decode(response.responseText);


				if (json["success"] == false) {
					Ext.Msg
					.alert("Failed",
					"Problem in getting results from the server (success = false)");
					return;

				} else {

					var message = json["message"];

					var win = Ext.create("Ext.window.MessageBox", {
						height : 300
					});

					win.show({
						title : "Application message",
						msg : message
					});

					var sidePanel = Ext.ComponentQuery.query("sidePanel")[0];
					var gridJobs = sidePanel.down("gridJobs");
					gridJobs.expand();

					Ext.getStore("S_Analyses").reload();

				}
			}, 
			failure: function(response, opts) { 
				Ext.MessageBox.alert('Server-side failure with status code ' + response.status); 
			}
		});
	},
    enterEditMode: function () {
        metExploreD3.GraphStyleEdition.toggleEditMode();
		if (metExploreD3.GraphStyleEdition.editMode){
            Ext.getCmp('enterEditMode').setText("Exit edit mode");
            Ext.getCmp('enterEditMode').setTooltip("Exit edit mode");
		}
		else {
            Ext.getCmp('enterEditMode').setText("Enter edit mode");
            Ext.getCmp('enterEditMode').setTooltip("Enter edit mode");
		}
        (metExploreD3.GraphStyleEdition.editMode) ? Ext.getCmp('editModePanel').show() : Ext.getCmp('editModePanel').hide();
    }
});