/**
 * @author MC
 * (a)description  MetaboliteStyleForm : Display metabolites config
 */
Ext.define('metExploreViz.view.form.metaboliteStyleForm.MetaboliteStyleForm', {
    extend: 'Ext.panel.Panel',  
    alias: 'widget.metaboliteStyleForm',
    requires: [
        "metExploreViz.view.form.metaboliteStyleForm.MetaboliteStyleFormController",
        "metExploreViz.view.form.SelectDisplayMetaboliteLabel"
    ],
    controller: "form-metaboliteStyleForm-metaboliteStyleForm",
    
    region:'north',
    height: '100%',
    width:'100%', 
    margin:'0 0 0 0',
    flex:1,
    border:false,
    autoScroll:true,
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    items: 
    [
    {   
        id:'selectDisplayMetaboliteLabel',
        reference:'selectDisplayMetaboliteLabel',
        xtype:'selectDisplayMetaboliteLabel'  
    }
    ,
    {
        xtype: 'checkboxfield',
        boxLabel  : 'Uses aliases',
        margin:'5 5 5 5',
        checked   : false,
        reference:'checkboxAlias'
    },
    {   
        xtype: 'textfield',
        reference:'chooseStrokeMetabolite',
        margin:'5 5 5 5',
        fieldLabel: "Stroke width:",
        displayField: 'stroke',
        editable:true,
        width:'100%', 
        listeners: {
            change: function(newValue, oldValue){
                this.lastValue = newValue;
            }   
        }        
    }
    ,
    {   
        xtype: 'textfield',
        scale: 'small',
        reference:'chooseHeightMetabolite',
        margin:'5 5 5 5',
        fieldLabel: "Height :",
        displayField: 'height',
        editable:true,
        width:'100%', 
        listeners: {
            change: function(newValue, oldValue){
                this.lastValue = newValue;
            }   
        }        
    }
    ,
    {   
        xtype: 'textfield',
        reference:'chooseWidthMetabolite',
        margin:'5 5 5 5',
        fieldLabel: "Width :",
        displayField: 'width',
        editable:true,
        width:'100%', 
        listeners: {
            change: function(newValue, oldValue){
                this.lastValue = newValue;
            }   
        }        
    }
    ,
    {   
        xtype: 'textfield',
        reference:'chooseRxMetabolite',
        margin:'5 5 5 5',
        fieldLabel: "Rx :",
        displayField: 'rx',
        editable:true,
        width:'100%', 
        listeners: {
            change: function(newValue, oldValue){
                this.lastValue = newValue;
            }   
        }        
    }
    ,
    {   
        xtype: 'textfield',
        reference:'chooseRyMetabolite',
        margin:'5 5 5 5',
        fieldLabel: "Ry :",
        displayField: 'ry',
        editable:true,
        width:'100%', 
        listeners: {
            change: function(newValue, oldValue){
                this.lastValue = newValue;
            }   
        }        
    }
    ,
    {
        xtype: 'menuseparator'
    }
    ,
    {
        layout: {
            type: 'hbox',
            align: 'center',
            pack: 'center'
        },
        items:[{
            id :'vizExempleMetabolite',
            xtype : 'panel',
            margins:'0 0 0 0',
            closable: false,
            region:'center',
            height:100,
            width:100, 
            flex:1,
            split:true
        }]
    },
    {
        xtype:'button',
        iconCls:'refresh',
        margin:'5 5 5 0',
        reference: 'refreshMetaboliteStyle',
        action: 'refreshMetaboliteStyle'  
        
    }
    ]   
});
