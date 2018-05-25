/**
 * @author Fabien Jourdan
 * (a)description Menu export network viz
 */

Ext.define('metExploreViz.view.menu.viz_ImportMenu.Viz_ImportMenu', {
    extend: 'Ext.menu.Menu', 
    alias: 'widget.vizImportMenu',
    
    requires: [
        'metExploreViz.view.menu.viz_ImportMenu.Viz_ImportMenuController',
        'metExploreViz.view.menu.viz_ImportMenu.Viz_ImportMenuModel'
    ],

    controller: "menu-vizImportMenu-vizImportMenu",
    viewModel: {
        type: "menu-vizImportMenu-vizImportMenu"
    },
   
    items:  [
        {
            text: 'Import mapping from tab file',
            reference:'importMapping',
            tooltip:'Import mapping from tab file',
            iconCls:'importData'
        },
        {
            hidden:true,
            id:'buttonMap',   
            xtype:'buttonImportMapping'/*,text: 'Refresh/Build network'*/
        }
        ,
        {
            text: 'Import side compounds from tab file',
            reference:'importSideCompounds',
            tooltip:'Import side compounds from tab file',
            iconCls:'importData'
        },
        {
            hidden:true,
            id:'buttonSide',   
            xtype:'buttonImportSideCompounds'/*,text: 'Refresh/Build network'*/
        },
        {
            text: 'Import coordinates',
            reference:'importCoordinates',
            iconCls:'importCoordinates'
        },
        {
            hidden:true,
            id:'buttonImportCoords',
            xtype:'buttonImportCoordinates'/*,text: 'Refresh/Build network'*/
        },
        // Ajout
        {
            text: 'Image Mapping',
            menu: {
                items: [
                    {
                        text: 'By Name',
                        reference: 'importImageMappingName',
                        tooltip: 'Import image for mapping by name'
                    },
                    {
                        text: 'By Id',
                        reference: 'importImageMappingID',
                        tooltip: 'Import image for mapping by id'

                    }]
            }
        },
        /*{
            text: 'Image Mapping',
            reference: 'importImageMapping',
            tooltip: 'Import image for mapping'
        },*/
        {
            xtype: 'buttonImportImage',
            reference: 'importImageMappingHidden',
            buttonConfig: {
                text: 'Add logo',
                width: '100%',
                ui: 'default-toolbar'
            },
            buttonOnly: true,
            multiple: true,
            hidden: true
        }
        // Fin Ajout
        // {
        //     text: 'Import saved network from JSON file',
        //     reference:'importSavedNetwork',
        //     tooltip:'Import saved network from JSON file',
        //     iconCls:'importData'
        // },
        // {
        //     hidden:true,
        //     id:'buttonImportSavedNetwork',   
        //     xtype:'buttonImportSavedNetwork'
        // }
    ]
});

