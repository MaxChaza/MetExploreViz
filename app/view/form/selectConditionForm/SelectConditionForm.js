/**
 * @author MC
 * (a)description 
 */
Ext.define('metExploreViz.view.form.selectConditionForm.SelectConditionForm', {
    extend: 'Ext.panel.Panel',  
    alias: 'widget.selectConditionForm',
    requires: [
        'metExploreViz.view.form.SelectConditionType',
        'metExploreViz.view.form.selectCondition.SelectCondition',
        'metExploreViz.view.form.selectMapping.SelectMapping',
        "metExploreViz.view.form.selectConditionForm.SelectConditionFormController",
        "metExploreViz.view.form.selectConditionForm.SelectConditionFormModel"
    ],
    controller: "form-selectConditionForm-selectConditionForm",
    viewModel: {
        type: "form-selectConditionForm-selectConditionForm"
    },
    layout:{
       type:'vbox',
       align:'stretch'
    },
    // collapsible: true,
    // collapsed:false,
    region:'north',
    width:'100%', 
    margins:'0 0 0 0',
    split:true,
    animation: true,
    autoScroll: true,
    autoHeight: true,

    items: [
    {
        id:'selectMappingVisu',
        xtype:'selectMapping',
        disabled:true
    },
    {
        xtype: 'menuseparator'
    },
    {
        id:'selectConditionType',
        xtype:'selectConditionType',
        reference:'selectConditionType',
        disabled:true
    }
    ,
    {

        margin:'10 0 0 5',
        xtype      : 'fieldcontainer',
        defaultType: 'checkboxfield',
        reference : 'opacity', 
        hidden : true,
        items: [
            {
                boxLabel  : 'Opacity',
                name      : 'opacity',
                inputValue: true,
                id        : 'opacityCheck'
            }
        ]
    },
    {

        margin:'10 0 0 5',
        xtype      : 'fieldcontainer',
        defaultType: 'checkboxfield',
        reference : 'valueonarrow', 
        hidden : true,
        items: [
            {
                boxLabel  : 'Show values on arrows',
                name      : 'valueonarrow',
                inputValue: true,
                id        : 'valueonarrowCheck'
            }
        ]
    },
    {

        margin:'10 0 0 5',
        xtype      : 'fieldcontainer',
        defaultType: 'checkboxfield',
        reference : 'regroupValuesIntoClass',
        hidden : true,
        items: [
            {
                boxLabel  : 'Discretize flux values into 10 classes',
                name      : 'regroupValuesIntoClass',
                inputValue: true,
                id        : 'regroupValuesIntoClassCheck'
            }
        ]
    },
    {
        xtype      : 'fieldcontainer',
        defaultType: 'checkboxfield',
        label: 'Threshold',
        hidden : true,
        reference : 'threshold',
        layout:{
            type:'hbox',
            align:'stretch'
        },
        margin:'0 5 0 5',
        items: [
            {
                xtype: 'numberfield',
                fieldLabel: 'Threshold',
                minValue: 0,
                name: 'threshold',
                id: 'threshold'
            }
        ]
    },
    {   
        border:false,
        id:'chooseCondition',
        xtype:'panel',
        autoScroll: true,
        layout:{
           type:'hbox',
           align:'stretch'
        },
        items:[{
            id:'selectCondition',
            xtype:'selectCondition',
            reference:'selectCondition',
            disabled:true           
        }
        ]
    }
        ,{
            xtype: 'menuseparator'
    }
    ]  
});