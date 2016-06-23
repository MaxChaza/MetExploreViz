Ext.define('metExploreViz.view.menu.viz_ColorMenu.Viz_ColorMenuController', {
	extend: 'Ext.app.ViewController',
	alias: 'controller.menu-vizColorMenu-vizColorMenu',

/**
 * Aplies event linsteners to the view
 */
	init:function(){
		var me 		= this,
		viewModel   = me.getViewModel(),
		view      	= me.getView();
		
		view.on({
			setGeneralStyle : function(){
				console.log("vizColorMenusetGeneralStyle", view.lookupReference('highlightCompartments'));
				var s_GeneralStyle = _metExploreViz.getGeneralStyle();
				console.log(s_GeneralStyle.isDisplayedConvexhulls());
				console.log(s_GeneralStyle.useClusters());
				if(s_GeneralStyle.isDisplayedConvexhulls()=="Compartments"){
					view.lookupReference('highlightCompartments').setChecked(true);  
					metExploreD3.fireEvent("vizIdDrawing", "enableMakeClusters");
					
					if(s_GeneralStyle.useClusters()){
						Ext.getCmp("vizIdDrawing").lookupReference('makeClusters').setIconCls("unmakeClusters");
						Ext.getCmp("vizIdDrawing").lookupReference('makeClusters').setTooltip('Release force for clusters');
						Ext.getCmp("vizIdDrawing").lookupReference('makeClusters').setText("Unmake clusters");
					}
					else
					{
						Ext.getCmp("vizIdDrawing").lookupReference('makeClusters').setIconCls("makeClusters");
						Ext.getCmp("vizIdDrawing").lookupReference('makeClusters').setTooltip('Make clusters in function of highlighted component');
						Ext.getCmp("vizIdDrawing").lookupReference('makeClusters').setText("Make clusters");
					}
				} 
				else
				{
					if(s_GeneralStyle.isDisplayedConvexhulls()=="Pathways"){
						view.lookupReference('highlightPathways').setChecked(true);  
						metExploreD3.fireEvent("vizIdDrawing", "enableMakeClusters");
						
						if(s_GeneralStyle.useClusters()){
							Ext.getCmp("vizIdDrawing").lookupReference('makeClusters').setIconCls("unmakeClusters");
							Ext.getCmp("vizIdDrawing").lookupReference('makeClusters').setTooltip('Release force for clusters');
							Ext.getCmp("vizIdDrawing").lookupReference('makeClusters').setText("Unmake clusters");
						}
						else
						{
							Ext.getCmp("vizIdDrawing").lookupReference('makeClusters').setIconCls("makeClusters");
							Ext.getCmp("vizIdDrawing").lookupReference('makeClusters').setTooltip('Make clusters in function of highlighted component');
							Ext.getCmp("vizIdDrawing").lookupReference('makeClusters').setText("Make clusters");
						}
					}
					else
					{
						view.lookupReference('highlightCompartments').setChecked(false);  
						view.lookupReference('highlightPathways').setChecked(false);  
						metExploreD3.fireEvent("vizIdDrawing", "disableMakeClusters");

						Ext.getCmp("vizIdDrawing").lookupReference('makeClusters').setIconCls("makeClusters");
						Ext.getCmp("vizIdDrawing").lookupReference('makeClusters').setTooltip('Make clusters in function of highlighted component');
						Ext.getCmp("vizIdDrawing").lookupReference('makeClusters').setText("Make clusters");
					}
				}
			},
			scope:me
		});

		view.lookupReference('invertColors').on({
			click : me.invertColors,
			scope : me
		});

        view.lookupReference('blackWhite').on({
			click : me.blackWhite,
			scope : me
		});
	},
	invertColors: function (item, checked){
        var me 		= this;

        if(item.checked){
			d3.select("#viz").select("#D3viz")
				.classed("invertColorViz", true); 
        }
        else
        {
			d3.select("#viz").select("#D3viz")
				.classed("invertColorViz", false); 
		}
    },
	blackWhite: function (item, checked){
        var me 		= this;

		if(item.checked){
			d3.select("#viz").select("#D3viz")
				.classed("blackWhiteViz", true); 
        }
        else
        {
			d3.select("#viz").select("#D3viz")
				.classed("blackWhiteViz", false); 
		}
    },
    highlightComponents : function(component){

    	var me 		= this,
		viewModel   = me.getViewModel(),
		view      	= me.getView();

		var s_GeneralStyle = _metExploreViz.getGeneralStyle();
		
		s_GeneralStyle.setDisplayConvexhulls(false);
		metExploreD3.GraphLink.displayConvexhulls('viz');
		metExploreD3.GraphNetwork.tick('viz');	

		s_GeneralStyle.setDisplayConvexhulls(component);
		metExploreD3.GraphLink.displayConvexhulls('viz');
		metExploreD3.GraphNetwork.tick('viz');	
		metExploreD3.fireEvent("vizIdDrawing", "enableMakeClusters");
	},
    hideComponents : function(){

    	var me 		= this,
		viewModel   = me.getViewModel(),
		view      	= me.getView();

		var s_GeneralStyle = _metExploreViz.getGeneralStyle();
		
		s_GeneralStyle.setDisplayConvexhulls(false);
		metExploreD3.GraphLink.displayConvexhulls('viz');
		metExploreD3.GraphNetwork.tick('viz');	
		metExploreD3.fireEvent("generalStyleForm", "setGeneralStyle");
		metExploreD3.fireEvent("vizIdDrawing", "disableMakeClusters");
	}
});