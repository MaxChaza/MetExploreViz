/**
 * @author Adrien Rohan
 * (a)description : Style Edition
 */

metExploreD3.GraphStyleEdition = {

    editMode: false,
    curvedPath: false,
    allDrawnCycles: [],


    /*******************************************
     * Enter or exit style edition mode
     */
    toggleEditMode : function () {
        // Enter edition mode, revealing the editModePanel, stopping force layout, and initiating label dragging, or leave the edition Mode
        var GraphNodes = d3.select("#viz").select("#D3viz").select("#graphComponent").selectAll("g.node");
        if (metExploreD3.GraphStyleEdition.editMode==false) {
            metExploreD3.GraphStyleEdition.editMode=true;
            console.log('edit mode entered');
            metExploreD3.GraphNetwork.animationButtonOff('viz');
            var force = _metExploreViz.getSessionById("viz").getForce();
            force.stop();
            d3.select("#viz").select("#buttonAnim").select("image").remove();
            metExploreD3.GraphStyleEdition.startDragLabel();
            var component = Ext.getCmp('editModePanel');
        }
        else {
            metExploreD3.GraphStyleEdition.editMode=false;
            console.log('edit mode exited');
            metExploreD3.GraphNetwork.animationButtonOff('viz');
            metExploreD3.GraphStyleEdition.endDragLabel();
            metExploreD3.GraphNode.applyEventOnNode('viz');
        }
    },

    /*******************************************
     * Allow moving of node label on drag
     */
    startDragLabel : function () {
        // Apply drag event on node labels
        var GraphNodes = d3.select("#viz").select("#D3viz").select("#graphComponent").selectAll("g.node");
        var labelDrag = metExploreD3.GraphStyleEdition.createDragBehavior();
        if (metExploreD3.GraphStyleEdition.editMode){
            GraphNodes.selectAll("text").style("pointer-events", "auto");
            GraphNodes.selectAll("text").call(labelDrag);
        }
    },

    /*******************************************
     * End moving of node label on drag
     */
    endDragLabel : function () {
        // Remove drag event on node labels
        var GraphNodes = d3.select("#viz").select("#D3viz").select("#graphComponent").selectAll("g.node");
        if (!metExploreD3.GraphStyleEdition.editMode) {
            GraphNodes.selectAll("text").style("pointer-events", "none");
        }
        GraphNodes.selectAll("rect").on("mouseover", null).on("mouseenter", null).on("mouseleave", null).on("mousedown", null).on("touchstart", null);
        //
    },

    /*******************************************
     * Create drag-and-drop behavior
     */
    createDragBehavior : function () {
        var deltaX;
        var deltaY;
        var element;
        var drag = d3.behavior.drag()
            .on ("dragstart", function (d,i) {
                d3.event.sourceEvent.stopPropagation();
                element = this;
                var cX = d3.select(this).attr("x");
                var cY = d3.select(this).attr("y");
                deltaX = cX - d3.mouse(element)[0];
                deltaY = cY - d3.mouse(element)[1];
                d3.selectAll("#D3viz")
                    .style("cursor", "move");
                d3.select(this)
                    .each(function(d){
                        this.parentNode.parentNode.appendChild(this.parentNode);
                    });
            })
            .on("drag", function (d,i) {
                if (d3.select(this).attr("transform")) {
                    var transformScale = d3.transform(d3.select(this).attr("transform")).scale;
                    d3.select(this).attr("transform", "translate(" + (d3.event.x + deltaX) + ", " + (d3.event.y + deltaY) + ") scale(" + transformScale[0] + ", " + transformScale[1] + ")");
                }
                else{
                    d3.select(this).attr("transform", "translate(" + (d3.event.x + deltaX) + ", " + (d3.event.y + deltaY) + ")");
                }
                d3.select(this).attr("x", d3.mouse(element)[0] + deltaX);
                d3.select(this).attr("y", d3.mouse(element)[1] + deltaY);
            })
            .on("dragend", function (d,i) {
                d3.selectAll("#D3viz")
                    .style("cursor", "default");
            });
        return drag;
    },

    /*******************************************
     * Change text of node label
     * @param {} node : The node whose label will be modified
     * @param {} panel : The panel where the action is launched
     * @param {} text : The new text of the node label
     */
    changeNodeLabel: function (node, panel, text) {
        var nodeElement = d3.select("#"+panel).select("#D3viz").select("#graphComponent")
            .selectAll("g.node")
            .filter(function(d){return d.getId()==node.getId();});
        var transform = nodeElement.select("text").attr("transform");
        var style = nodeElement.select("text").attr("style");
        var x = nodeElement.select("text").attr("x");
        var y = nodeElement.select("text").attr("y");
        var dy = nodeElement.select("text").attr("dy");
        nodeElement.select("text").remove();
        nodeElement.append("svg:text")
            .attr("fill", "black")
            .attr("class", function(d) { return d.getBiologicalType(); })
            .each(function(d) {
                var el = d3.select(this);
                text = text.split(' ');
                el.text('');
                for (var i = 0; i < text.length; i++) {
                    var nameDOMFormat = $("<div/>").html(text[i]).text();
                    var tspan = el.append('tspan').text(nameDOMFormat);
                    if (i > 0)
                        tspan.attr('x', 0).attr('dy', '10');
                }
            })
            .attr("transform", transform)
            .attr("style", style)
            .attr("x", x)
            .attr("y", y)
            .attr("dy", dy);
    },

    /*******************************************
     * Change the font size of a node label
     * @param {} node : The node whose label will be modified
     */
    changeFontSize : function (node) {
        // Change the font size of the node label
        metExploreD3.displayPrompt("Font Size", "Enter a font size", function(btn, text) {
            if (text!=null && text!="" && !isNaN(text) && btn=="ok") {
                d3.select("#viz").select("#D3viz").select("#graphComponent")
                    .selectAll("g.node")
                    .filter(function(d){return d.getId()==node.getId();})
                    .select("text")
                    .style("font-size",text+"px");
            }
        });
    },

    /*******************************************
     * Change the font size of multiple node labels
     * @param {} text : The new font size of the node label
     * @param {} targets : The nodes whose label will be modified
     */
    changeAllFontSize : function (text, targets) {
        // Change the font size of all the targeted nodes labels
        targets = (typeof targets !== 'undefined' && typeof targets === "string") ? targets.toLowerCase() : "all";
        d3.select("#viz").select("#D3viz").select("#graphComponent")
            .selectAll("g.node")
            .filter(function(node){
                if (targets === "all"){
                    return true;
                }
                else if (targets === "selection"){
                    return node.isSelected();
                }
                else {
                    return node.getBiologicalType() == targets;
                }
            })
            .select("text")
            .style("font-size",text+"px");
    },
    /*******************************************
     * Change the font of a node label
     * @param {} node : The node whose label will be modified
     * @param {} text : The new font of the node label
     */
    changeFontType : function (node, text) {
        // Change the font of the node label
        d3.select("#viz").select("#D3viz").select("#graphComponent")
            .selectAll("g.node")
            .filter(function(d){return d.getId()==node.getId();})
            .select("text")
            .style("font-family",text);
    },

    /*******************************************
     * Change the font family of multiple node labels
     * @param {} text : The new font of the node label
     * @param {} targets : The nodes whose label will be modified
     */
    changeAllFontType : function (text, targets) {
        // Change the font of all the targeted nodes labels
        targets = (typeof targets !== 'undefined' && typeof targets === "string") ? targets.toLowerCase() : "all";
        d3.select("#viz").select("#D3viz").select("#graphComponent")
            .selectAll("g.node")
            .filter(function(node){
                if (targets === "all"){
                    return true;
                }
                else if (targets === "selection"){
                    return node.isSelected();
                }
                else {
                    return node.getBiologicalType() == targets;
                }
            })
            .select("text")
            .style("font-family",text);
    },

    /*******************************************
     * Change whether the font of a node label is bold or not
     * @param {} node : The node whose label will be modified
     */
    changeFontBold : function (node) {
        // Change the font boldness of the node label
        var nodeLabel = d3.select("#viz").select("#D3viz").select("#graphComponent")
            .selectAll("g.node")
            .filter(function(d){return d.getId()==node.getId();})
            .select("text");
        if (nodeLabel.style("font-weight") < 700){
            nodeLabel.style("font-weight", "bold");
        }
        else {
            nodeLabel.style("font-weight", "normal");
        }
    },

    /*******************************************
     * Change whether the font of multiple node labels is bold or not
     * @param {} bool : True to change the font to bold, false to change back to normal
     * @param {} targets : The nodes whose label will be modified
     */
    changeAllFontBold : function (bool, targets) {
        // Change the font boldness of all the targeted nodes labels
        targets = (typeof targets !== 'undefined' && typeof targets === "string") ? targets.toLowerCase() : "all";
        var boldOrNot = (bool) ? "bold" : "normal";
        d3.select("#viz").select("#D3viz").select("#graphComponent")
            .selectAll("g.node")
            .filter(function(node){
                if (targets === "all"){
                    return true;
                }
                else if (targets === "selection"){
                    return node.isSelected();
                }
                else {
                    return node.getBiologicalType() == targets;
                }
            })
            .select("text")
            .style("font-weight", boldOrNot);
    },

    /*******************************************
     * Change whether the font of a node label is italic or not
     * @param {} node : The node whose label will be modified
     */
    changeFontItalic : function (node) {
        // Italicize the font of the node label or revert to normal
        var nodeLabel = d3.select("#viz").select("#D3viz").select("#graphComponent")
            .selectAll("g.node")
            .filter(function(d){return d.getId()==node.getId();})
            .select("text");
        if (nodeLabel.style("font-style") != "italic"){
            nodeLabel.style("font-style", "italic");
        }
        else {
            nodeLabel.style("font-style", "normal");
        }
    },

    /*******************************************
     * Change whether the font of multiple node labels is italic or not
     * @param {} bool : True to change the font to italic, false to change back to normal
     * @param {} targets : The nodes whose label will be modified
     */
    changeAllFontItalic : function (bool, targets) {
        // Italicize the font of all the targeted nodes labels or revert to normal
        targets = (typeof targets !== 'undefined' && typeof targets === "string") ? targets.toLowerCase() : "all";
        var italicOrNot = (bool) ? "italic" : "normal";
        d3.select("#viz").select("#D3viz").select("#graphComponent")
            .selectAll("g.node")
            .filter(function(node){
                if (targets === "all"){
                    return true;
                }
                else if (targets === "selection"){
                    return node.isSelected();
                }
                else {
                    return node.getBiologicalType() == targets;
                }
            })
            .select("text")
            .style("font-style", italicOrNot);
    },

    /*******************************************
     * Change whether a node label is underlined or not
     * @param {} node : The node whose label will be modified
     */
    changeFontUnderline : function (node) {
        // Underline the font of the node label or revert to normal
        var nodeLabel = d3.select("#viz").select("#D3viz").select("#graphComponent")
            .selectAll("g.node")
            .filter(function(d){return d.getId()==node.getId();})
            .select("text");
        if (nodeLabel.style("text-decoration-line") != "underline"){
            nodeLabel.style("text-decoration-line", "underline");
        }
        else {
            nodeLabel.style("text-decoration-line", "none");
        }
    },

    /*******************************************
     * Add or remove underline to multiple node labels
     * @param {} bool : True to add underline to the label, false to remove them
     * @param {} targets : The nodes whose label will be modified
     */
    changeAllFontUnderline : function (bool, targets) {
        // Underline the font of all the targeted nodes labels or revert to normal
        targets = (typeof targets !== 'undefined' && typeof targets === "string") ? targets.toLowerCase() : "all";
        var underlineOrNot = (bool) ? "underline" : "none";
        d3.select("#viz").select("#D3viz").select("#graphComponent")
            .selectAll("g.node")
            .filter(function(node){
                if (targets === "all"){
                    return true;
                }
                else if (targets === "selection"){
                    return node.isSelected();
                }
                else {
                    return node.getBiologicalType() == targets;
                }
            })
            .select("text")
            .style("text-decoration-line", underlineOrNot);
    },
    setAllFontOpacity: function (labelOpacity, flag) {
        var s_MetaboliteStyle = metExploreD3.getMetaboliteStyle();
        var s_ReactionStyle = metExploreD3.getReactionStyle();
        d3.select("#viz").select("#D3viz").select("#graphComponent")
            .selectAll("g.node")
            .filter(function (node) {
                if (flag === "all"){
                    s_MetaboliteStyle.setLabelOpacity(labelOpacity);
                    s_ReactionStyle.setLabelOpacity(labelOpacity);
                    return true;
                }
                else if (flag === "selection"){
                    return node.isSelected();
                }
                else if (flag === "reaction") {
                    s_ReactionStyle.setLabelOpacity(labelOpacity);
                    return node.getBiologicalType() == "reaction";
                }

                else if (flag === "metabolite") {
                    s_MetaboliteStyle.setLabelOpacity(labelOpacity);
                    return node.getBiologicalType() == "metabolite";
                }
            })
            .select("text")
            .attr("opacity", labelOpacity);
    },

    /*******************************************
     * Apply label style if style data are associated to the node
     * @param {} node : The node whose label will be modified
     */
    setStartingStyle : function (node) {
        if (node.labelFont) {
            var selection = d3.select("#viz").select("#D3viz").select("#graphComponent")
                .selectAll("g.node")
                .filter(function (d) {
                    return d.getId() == node.getId();
                })
                .select("text");
            if (node.labelFont.font) { selection.style("font-family", node.labelFont.font); }
            if (node.labelFont.fontSize) { selection.style("font-size", node.labelFont.fontSize); }
            if (node.labelFont.fontBold) { selection.style("font-weight", node.labelFont.fontBold); }
            if (node.labelFont.fontItalic) { selection.style("font-style", node.labelFont.fontItalic); }
            if (node.labelFont.fontUnderline) { selection.style("text-decoration-line", node.labelFont.fontUnderline); }
            if (node.labelFont.fontOpacity) { selection.attr("opacity", node.labelFont.fontOpacity); }
            if (node.labelFont.fontX) { selection.attr("x", node.labelFont.fontX); }
            if (node.labelFont.fontY) { selection.attr("y", node.labelFont.fontY); }
            if (node.labelFont.fontTransform) { selection.attr("transform", node.labelFont.fontTransform); }
        }
    },

    createLabelStyleObject : function (node) {
        var nodeLabel = d3.select("#viz").select("#D3viz").select("#graphComponent")
            .selectAll("g.node")
            .filter(function(d){return d.getId()==node.getId();})
            .select("text");
        var labelStyle = {
            font : nodeLabel.style("font-family"),
            fontSize : nodeLabel.style("font-size"),
            fontBold : nodeLabel.style("font-weight"),
            fontItalic : nodeLabel.style("font-style"),
            fontUnderline : nodeLabel.style("text-decoration-line"),
            fontOpacity : nodeLabel.attr("opacity"),
            fontX : nodeLabel.attr("x"),
            fontY : nodeLabel.attr("y"),
            fontTransform : nodeLabel.attr("transform")
        };
        return labelStyle;
    },
    createImageStyleObject : function (node) {
        var nodeImage = d3.select("#viz").select("#D3viz").select("#graphComponent")
            .selectAll("g.node")
            .filter(function(d){return d.getId()==node.getId();})
            .select(".imageNode");
        if (!nodeImage.empty()) {
            var imageStyle = {
                imageX: nodeImage.attr("x"),
                imageY: nodeImage.attr("y"),
                imageWidth: nodeImage.attr("width"),
                imageTransform: nodeImage.attr("transform")
            };
            return imageStyle;
        }
        else {
            return undefined;
        }
    },

    discretizeFluxRange: function (condition) {
        // Create the distribution table for the flux values
        var allValues = [];
        var distributionTable = [];
        var mappingName = _metExploreViz.getSessionById('viz').getActiveMapping();
        var conditions = _metExploreViz.getSessionById('viz').isMapped();
        d3.select("#viz").select("#D3viz").select("#graphComponent")
            .selectAll("g.node")
            .filter(function (d) {
                return d.getBiologicalType() === "reaction";
            })
            .each(function (d) {
                var reactionMapping = d.getMappingDataByNameAndCond(mappingName, condition);
                allValues.push(reactionMapping)
            });
        allValues.sort(function (a, b) {
            return Math.abs(a.mapValue) - Math.abs(b.mapValue);
        });
        for (var i=0; i<allValues.length; i++){
            var value = Math.abs(Number(allValues[i].mapValue));
            if (!distributionTable.length || distributionTable[distributionTable.length -1].value !== value){
                var valueObject = {value: value, nbOccurence: 1};
                if (distributionTable.length){
                    valueObject.gap = valueObject.value - distributionTable[distributionTable.length -1].value;
                }
                else {
                    valueObject.gap = 0;
                }
                distributionTable.push(valueObject);
            }
            else {
                distributionTable[distributionTable.length -1].nbOccurence += 1;
            }
        }

        //  Find the 9 largest gaps between consecutive values
        var nbBins = 10;
        distributionTable.sort(function (a, b) {
            return a.gap - b.gap;
        });
        var breakPoints = [];
        for (var i=distributionTable.length - nbBins + 1; i<distributionTable.length; i++){
            breakPoints.push(distributionTable[i].value);
        }
        breakPoints.sort(function (a, b) {
            return a - b;
        });
        // Divide the range of value into 10 bins
        var maxValue = Math.abs(Number(allValues[allValues.length-1].mapValue));
        var minValue = Math.abs(Number(allValues[0].mapValue));
        var range = maxValue - minValue;
        var binsWidth = range/nbBins;
        var midBinValues = [];
        for (var i=0; i<nbBins; i++){
            midBinValues.push(minValue + binsWidth / 2 + i * binsWidth);
        }
        // Assign the values into the corresponding bins
        d3.select("#viz").select("#D3viz").select("#graphComponent")
            .selectAll("g.node")
            .filter(function (d) {
                return d.getBiologicalType() === "reaction";
            })
            .each(function (d) {
                var reactionMapping = d.getMappingDataByNameAndCond(mappingName, condition);
                var mapValue = Math.abs(Number(reactionMapping.mapValue));
                for (var i=0; i<breakPoints.length; i++){
                    if (mapValue < breakPoints[i]){
                        reactionMapping.binnedMapValue = midBinValues[i];
                        break;
                    }
                }
                if (Number(mapValue) === 0){
                    reactionMapping.binnedMapValue = 0;
                }
                else if (reactionMapping.binnedMapValue === undefined){
                    reactionMapping.binnedMapValue = midBinValues[midBinValues.length-1];
                }
            });
    },
    removeBinnedMapping : function (condition) {
        var mappingName = _metExploreViz.getSessionById('viz').getActiveMapping();
        var conditions = _metExploreViz.getSessionById('viz').isMapped();
        d3.select("#viz").select("#D3viz").select("#graphComponent")
            .selectAll("g.node")
            .filter(function (d) {
                return d.getBiologicalType() === "reaction";
            })
            .each(function (d) {
                var reactionMapping = d.getMappingDataByNameAndCond(mappingName, condition);
                if (reactionMapping){
                    delete reactionMapping.binnedMapValue;
                }
            })
    }
}