/**
 * @author MC
 * @description : Feature flipping
 */
metExploreD3.Features = {
	
	features:
	{
			"highlightSubnetwork":
			{
				description: "highlightSubnetwork",
				enabledTo: ["lcottret", "npoupin"]
			},
			"layouts":
			{
				description: "layouts",
				enabledTo: ["lcottret", "npoupin"]
			}
	},

    isEnabled : function(feature, currentUser) {
    	if(this.features[feature]!=undefined)
    	 	return this.isEnabledForUser(feature, currentUser) || this.isEnabledForAll(feature) ;
    	return false;
    }, 
   
    isEnabledForUser : function(feature, currentUser) {
    	if(this.features[feature]!=undefined)
    		return this.features[feature].enabledTo.indexOf(currentUser)!=-1;
    	return false;
    },

    isEnabledForAll : function(feature) {
    	if(this.features[feature]!=undefined)
    		return this.features[feature].enabledTo.indexOf("all")!=-1;
    	return false;
    }
}