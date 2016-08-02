/**
 * This class is the controller for the main view for the application. It is specified as
 * the "controller" of the Main view class.
 *
 * TODO - Replace this content of this view to suite the needs of your application.
 */
Ext.define('metExploreViz.view.button.buttonImportToNetwork.ButtonImportToNetworkController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.buttonImportToNetwork',
   
    init: function() {
		var me=this,
		viewModel = me.getViewModel(),
		view      = me.getView();		

		view.lookupReference('importNetwork').on({
			change: function () {
				metExploreD3.GraphUtils.handleFileSelect(view.lookupReference('importNetwork').fileInputEl.dom, metExploreD3.GraphPanel.refreshPanel);
				// me.sbmlTOjson('./sbmlBioModel.xml');
            },
            scope : me
		});

		view.on({
			reloadMapping:me.reloadMapping,
			scope:me
		});
	},

	sbmlL1TOjson : function(url){

		d3.xml(url, function(error, data) {
			if (error) throw error;
			// Convert the XML document to an array of objects.
			// Note that querySelectorAll returns a NodeList, not a proper Array,
			// so we must use map.call to invoke array methods.
			var id = -1;
			nodes = {};
			data.querySelectorAll("species").forEach(function(metabolite) {
				if(metabolite.getAttribute("boundaryCondition")!=undefined) {

					if (metabolite.getAttribute("boundaryCondition") == "false") {
						id++;
						nodes[metabolite.getAttribute("id")] = {
							id: id,
							name: metabolite.getAttribute("name"),
							dbIdentifier: metabolite.getAttribute("id"),
							isSideCompound: false,
							biologicalType: "metabolite",
							compartment: metabolite.getAttribute("compartment")
						};
					}
				}
				else {
					if (metabolite.getAttribute("id")[0] == "M"){
						console.log(metabolite.getAttribute("id")[0]);
						id++;
						nodes[metabolite.getAttribute("id")] = {
							id: id,
							name: metabolite.getAttribute("name"),
							dbIdentifier: metabolite.getAttribute("id"),
							isSideCompound: false,
							biologicalType: "metabolite",
							compartment: metabolite.getAttribute("compartment")
						};
					}
				}
			});


			var links = [];

			data.querySelectorAll("reaction").forEach(function(reaction) {
				
				id++;
				reaction.querySelector("listOfReactants").querySelectorAll("speciesReference")
					.forEach(function (reactant) {
						console.log(reactant.getAttribute("species"));
						console.log(nodes[reactant.getAttribute("species")]);
						var idReactant = nodes[reactant.getAttribute("species")].id;
						links.push({
                        	id			: idReactant+" -- "+id,
                        	source		: idReactant,
                        	target		: id,
                        	interaction	: 'in',
							reversible	: (reaction.getAttribute("reversible")==undefined) ? true : reaction.getAttribute("reversible")
						})
					});
				
				reaction.querySelector("listOfProducts").querySelectorAll("speciesReference")
					.forEach(function (products) {
						var idProducts = nodes[products.getAttribute("species")].id;
						links.push({
                        	id			: idProducts+" -- "+id,
                        	source		: id,
                        	target		: idProducts,
                        	interaction	: 'out',
                        	reversible	: (reaction.getAttribute("reversible")==undefined) ? true : reaction.getAttribute("reversible")
						})
					});

				nodes[reaction.getAttribute("id")] = {
					id: id,
					name: reaction.getAttribute("name"),
					dbIdentifier: reaction.getAttribute("id"),
					reactionReversibility: (reaction.getAttribute("reversible")==undefined) ? true : reaction.getAttribute("reversible"),
					biologicalType:"reaction"
				};
			});
			var arrayNodes = [];

			for (var key in nodes)  {
				arrayNodes.push(nodes[key]);
			}
			console.log({
				nodes:arrayNodes,
				links:links
			});

			metExploreD3.GraphPanel.refreshPanel(
				JSON.stringify ({
				nodes:arrayNodes,
				links:links
			}));
		});

	},

	sbmlL2TOjson : function(url){

		d3.xml(url, function(error, data) {
			if (error) throw error;
			// Convert the XML document to an array of objects.
			// Note that querySelectorAll returns a NodeList, not a proper Array,
			// so we must use map.call to invoke array methods.
			var id = -1;
			nodes = {};
			data.querySelectorAll("species").forEach(function(metabolite) {
				if(metabolite.getAttribute("boundaryCondition")!=undefined) {

					if (metabolite.getAttribute("boundaryCondition") == "false") {
						id++;
						nodes[metabolite.getAttribute("id")] = {
							id: id,
							name: metabolite.getAttribute("name"),
							dbIdentifier: metabolite.getAttribute("id"),
							isSideCompound: false,
							biologicalType: "metabolite",
							compartment: metabolite.getAttribute("compartment")
						};
					}
				}
				else {
					if (metabolite.getAttribute("id")[0] == "M"){
						console.log(metabolite.getAttribute("id")[0]);
						id++;
						nodes[metabolite.getAttribute("id")] = {
							id: id,
							name: metabolite.getAttribute("name"),
							dbIdentifier: metabolite.getAttribute("id"),
							isSideCompound: false,
							biologicalType: "metabolite",
							compartment: metabolite.getAttribute("compartment")
						};
					}
				}
			});


			var links = [];

			data.querySelectorAll("reaction").forEach(function(reaction) {

				id++;
				reaction.querySelector("listOfReactants").querySelectorAll("speciesReference")
					.forEach(function (reactant) {
						console.log(reactant.getAttribute("species"));
						console.log(nodes[reactant.getAttribute("species")]);
						var idReactant = nodes[reactant.getAttribute("species")].id;
						links.push({
                        	id			: idReactant+" -- "+id,
                        	source		: idReactant,
                        	target		: id,
                        	interaction	: 'in',
							reversible	: (reaction.getAttribute("reversible")==undefined) ? true : reaction.getAttribute("reversible")
						})
					});

				reaction.querySelector("listOfProducts").querySelectorAll("speciesReference")
					.forEach(function (products) {
						var idProducts = nodes[products.getAttribute("species")].id;
						links.push({
                        	id			: idProducts+" -- "+id,
                        	source		: id,
                        	target		: idProducts,
                        	interaction	: 'out',
                        	reversible	: (reaction.getAttribute("reversible")==undefined) ? true : reaction.getAttribute("reversible")
						})
					});

				nodes[reaction.getAttribute("id")] = {
					id: id,
					name: reaction.getAttribute("name"),
					dbIdentifier: reaction.getAttribute("id"),
					reactionReversibility: (reaction.getAttribute("reversible")==undefined) ? true : reaction.getAttribute("reversible"),
					biologicalType:"reaction"
				};
			});
			var arrayNodes = [];

			for (var key in nodes)  {
				arrayNodes.push(nodes[key]);
			}
			console.log({
				nodes:arrayNodes,
				links:links
			});

			metExploreD3.GraphPanel.refreshPanel(
				JSON.stringify ({
				nodes:arrayNodes,
				links:links
			}));
		});

	},

	sbmlL3TOjson : function(url){

		d3.xml(url, function(error, data) {
			if (error) throw error;
			// Convert the XML document to an array of objects.
			// Note that querySelectorAll returns a NodeList, not a proper Array,
			// so we must use map.call to invoke array methods.
			var id = -1;
			nodes = {};
			data.querySelectorAll("species").forEach(function(metabolite) {
				if(metabolite.getAttribute("boundaryCondition")!=undefined) {

					if (metabolite.getAttribute("boundaryCondition") == "false") {
						id++;
						nodes[metabolite.getAttribute("id")] = {
							id: id,
							name: metabolite.getAttribute("name"),
							dbIdentifier: metabolite.getAttribute("id"),
							isSideCompound: false,
							biologicalType: "metabolite",
							compartment: metabolite.getAttribute("compartment")
						};
					}
				}
				else {
					if (metabolite.getAttribute("id")[0] == "M"){
						console.log(metabolite.getAttribute("id")[0]);
						id++;
						nodes[metabolite.getAttribute("id")] = {
							id: id,
							name: metabolite.getAttribute("name"),
							dbIdentifier: metabolite.getAttribute("id"),
							isSideCompound: false,
							biologicalType: "metabolite",
							compartment: metabolite.getAttribute("compartment")
						};
					}
				}
			});


			var links = [];

			data.querySelectorAll("reaction").forEach(function(reaction) {

				id++;
				reaction.querySelector("listOfReactants").querySelectorAll("speciesReference")
					.forEach(function (reactant) {
						console.log(reactant.getAttribute("species"));
						console.log(nodes[reactant.getAttribute("species")]);
						var idReactant = nodes[reactant.getAttribute("species")].id;
						links.push({
                        	id			: idReactant+" -- "+id,
                        	source		: idReactant,
                        	target		: id,
                        	interaction	: 'in',
							reversible	: (reaction.getAttribute("reversible")==undefined) ? true : reaction.getAttribute("reversible")
						})
					});

				reaction.querySelector("listOfProducts").querySelectorAll("speciesReference")
					.forEach(function (products) {
						var idProducts = nodes[products.getAttribute("species")].id;
						links.push({
                        	id			: idProducts+" -- "+id,
                        	source		: id,
                        	target		: idProducts,
                        	interaction	: 'out',
                        	reversible	: (reaction.getAttribute("reversible")==undefined) ? true : reaction.getAttribute("reversible")
						})
					});

				nodes[reaction.getAttribute("id")] = {
					id: id,
					name: reaction.getAttribute("name"),
					dbIdentifier: reaction.getAttribute("id"),
					reactionReversibility: (reaction.getAttribute("reversible")==undefined) ? true : reaction.getAttribute("reversible"),
					biologicalType:"reaction"
				};
			});
			var arrayNodes = [];

			for (var key in nodes)  {
				arrayNodes.push(nodes[key]);
			}
			console.log({
				nodes:arrayNodes,
				links:links
			});

			metExploreD3.GraphPanel.refreshPanel(
				JSON.stringify ({
				nodes:arrayNodes,
				links:links
			}));
		});

	},

	reloadMapping : function(bool){
	    if(_metExploreViz.getMappingsLength()!=0){
	    	var component = Ext.getCmp('comparisonSidePanel');
	        if(component!= undefined){
				
				var comboMapping = Ext.getCmp('selectMappingVisu');
				var store = comboMapping.getStore();
				store.loadData([], false);
				comboMapping.clearValue();
	            //take an array to store the object that we will get from the ajax response
				var records = [];
				console.log(bool);
				// comboMapping.bindStore(store);
				if(bool){

					var mappings = _metExploreViz.getMappingsSet();
					mappings.forEach(function(mapping){
						records.push(new Ext.data.Record({
		                    name: mapping.getName()
		                }));

						store.each(function(mappingName){
							records.push(new Ext.data.Record({
			                    name: mappingName.getData().name
			                }));
						});
					});

					store.loadData(records, false);
				}        	

                if(store.getCount()==0)
                	comboMapping.setDisabled(true);
	        }
	    }

		var comboCond = Ext.getCmp('selectCondition');
		var addCondition = Ext.getCmp('addCondition');
		var selectConditionType = Ext.getCmp('selectConditionType');
		
		if(addCondition!=undefined && selectCondition!=undefined && selectConditionType!=undefined){					
			comboCond.clearValue();

			addCondition.setDisabled(true);
			addCondition.setTooltip('You must choose a condition to add it');
				
			comboCond.setDisabled(true);
			selectConditionType.setDisabled(true);

		}

		var networkVizSession = _metExploreViz.getSessionById("viz");
		var that = this;
		// If the main network is already mapped we inform the user: OK/CANCEL
		// if(networkVizSession.isMapped()!='false')	
		// {
	        	
		// 	var newMapping ='true';
		// 	me.closeMapping(newMapping);
		// }
	}
});
