/**
 * @author MC
 * ButtonImportMappingController : Allows mapping import from a tab file
 * This class is the controller for the ButtonImportMapping view
 */
Ext.define('metExploreViz.view.button.buttonImportMapping.ButtonImportMappingController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.buttonImportMapping',

    init: function() {
		var me=this,
		view      = me.getView();

		// Listener which allows opening file manager of client side
        view.lookupReference('importMappingHidden').on({
			change:function(){
				metExploreD3.GraphUtils.handleFileSelect(view.lookupReference('importMappingHidden').fileInputEl.dom, me.loadData);
			},
			scope:me
		});

		view.on({
			reloadMapping:function(){
				view.reset();
			},
			scope:me
		});
	},

	/*****************************************************
	 * Parse file and map data
     * @param tabTxt : file content
     * @param title : file title
     */
	loadData : function(tabTxt, title) {
		var data = tabTxt;
		tabTxt = tabTxt.replace(/\r/g, "");
	    var lines = tabTxt.split('\n');

	    var firstLine = lines.splice(0, 1);
	    firstLine = firstLine[0].split('\t');

	    var targetName = firstLine.splice(0, 1);
	    var array = [];

		if(targetName[0]=="reactionDBIdentifier" || targetName[0]=="metaboliteDBIdentifier" || targetName[0]=="reactionId" || targetName[0]=="metaboliteId" || targetName[0]=="inchi")
		{
		    var mapping = new Mapping(title, firstLine, targetName[0], array);
		    _metExploreViz.addMapping(mapping);

		    for (var i = lines.length - 1; i >= 0; i--) {
		    	lines[i] = lines[i].split('\t');
		    }

		    // Launch mapping
		    metExploreD3.GraphMapping.mapNodeData(mapping, lines);
		    metExploreD3.fireEventArg('selectMappingVisu', "jsonmapping", mapping);
		}
		else
		{
			// Warning for bad syntax file
			metExploreD3.displayWarning("Syntaxe error", 'File have bad syntax. See <a target="_blank" href="http://metexplore.toulouse.inra.fr/metexploreViz/doc/documentation.php#import">MetExploreViz documentation</a>.');
		}
	}
});
