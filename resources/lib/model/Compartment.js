var Compartment = function(id, name){
	this.id = id;
	this.identifier = name;
	this.name = name;
	this.color = "";
  this.hide = false;
};

Compartment.prototype = {
		

   	getId:function()
    {
      return this.id;
    },
    getIdentifier:function()
    {
      return this.identifier;
    },
    getName:function()
    {
      return this.name;
  	},
    getColor:function()
    {
      return this.color;
    },
    setColor:function(newColor)
    {
      return this.color = newColor;
    },
    hidden:function()
    {
      return this.hide;
    },
    setHidden:function(bool)
    {
      return this.hide = bool;
    }
};
