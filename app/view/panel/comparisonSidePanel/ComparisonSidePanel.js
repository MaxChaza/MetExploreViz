/**
 * @author MC
 * (a)description 
 */
Ext.define('metExploreViz.view.panel.comparisonSidePanel.ComparisonSidePanel', {
	extend: 'Ext.panel.Panel',	
	alias: 'widget.comparisonSidePanel',
	requires: [
        "metExploreViz.view.panel.comparisonSidePanel.ComparisonSidePanelController",
        "metExploreViz.view.panel.comparisonSidePanel.ComparisonSidePanelController",
        "metExploreViz.view.form.selectConditionForm.SelectConditionForm",
        "metExploreViz.view.form.drawingStyleForm.DrawingStyleForm",
        "metExploreViz.view.form.captionForm.CaptionForm"
    ],
 	controller: "panel-comparisonSidePanel-comparisonSidePanel",
	/*requires: ['MetExplore.view.form.V_SelectConditionForm',
	           'MetExplore.view.form.V_UpdateStyleForm'
	           ],
*/
	collapsible: true,
	collapsed:true,
	width: '20%',
	height: '100%',
	margins:'0 0 2 0',
	split:true,
	layout:'accordion', 
	closable: false,
	region: 'west',
	// hidden:true,
	items: [
	{
	   title:'Omics',
	   id:'selectConditionForm',
	   xtype:'selectConditionForm'   
	}
	//{
	//  title:'Compare',
	//  id:'updateSelectionForm',
	//  xtype:'updateSelectionForm',
	//  layout:{
	//   type:'vbox',
	//   align:'stretch'
	//  }
	// }
	,
	{
		title:'Pathways',
		id:'captionFormPathways',
		xtype:'captionForm'
	}
	,
	{
		title:'Compartments',
		id:'captionFormCompartments',
		xtype:'captionForm'
	},
	{
        title:'Drawing parameters',
        id:'drawingStyleForm',
		xtype:'drawingStyleForm'
	},
	{
		title:'Cycle',
		reference: 'cycleDetection',
		id:'cycleDetection',
		xtype:'panel',
		autoScroll: true,
		autoHeight: true,
		collapsed: true,
		hidden: true,
		items:[{
			xtype:'button',
			text:'Draw Cycle',
			margin: '10 10 10 10',
			align:'stretch',
			width:'95%',
			reference:'buttonDrawCycle',
			hidden: true
		},{
			xtype:'menuseparator'
		},{
			xtype:'fieldcontainer',
			id:'cycleDetectionPanel',
			reference:'cycleDetectionPanel'
		},{
			xtype:'button',
			text:'Hide cycle',
			margin: '10 10 10 10',
			align:'stretch',
			width:'50%',
			reference:'buttonHideCycle',
			hidden: true
		}]
	}
	]
});