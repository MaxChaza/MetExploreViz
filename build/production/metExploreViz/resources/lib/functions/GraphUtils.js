metExploreD3.GraphUtils={decodeJSON:function(c){try{var a=Ext.decode(c)}catch(b){metExploreD3.displayWarning("Invalid JSON String","Unable to parse the JSON")}return a},launchWebService:function(a,b){$.ajax({url:"src/php/metExplore.php",type:"POST",dataType:"text",data:{data:a},success:function(c){b(c)},error:function(c){alert("Bad")}})},parseWebServiceMapping:function(a){var c=Ext.decode(a);var d=c.mappingdata[0].mappings;d.forEach(function(h){var g=h.data;var f=0;var e=false;while(f<g.length&&!e){if(g.value!=undefined){e=true}f++}if(!e){h.name="undefined"}});var b=JSON.stringify(c.mappingdata[0]);return b},handleFileSelect:function(b,c){if(!window.File||!window.FileReader||!window.FileList||!window.Blob){alert("The File APIs are not fully supported in this browser.");return}if(!b){alert("couldn't find the fileinput element.")}else{if(!b.files){alert("This browser doesn't seem to support the `files` property of file inputs.")}else{file=b.files[0];var a=new FileReader();a.onload=function(){c(a.result,file.name)};a.readAsText(file)}}},colorNameToHex:function(b){var a={aliceblue:"#f0f8ff",antiquewhite:"#faebd7",aqua:"#00ffff",aquamarine:"#7fffd4",azure:"#f0ffff",beige:"#f5f5dc",bisque:"#ffe4c4",black:"#000000",blanchedalmond:"#ffebcd",blue:"#0000ff",blueviolet:"#8a2be2",brown:"#a52a2a",burlywood:"#deb887",cadetblue:"#5f9ea0",chartreuse:"#7fff00",chocolate:"#d2691e",coral:"#ff7f50",cornflowerblue:"#6495ed",cornsilk:"#fff8dc",crimson:"#dc143c",cyan:"#00ffff",darkblue:"#00008b",darkcyan:"#008b8b",darkgoldenrod:"#b8860b",darkgray:"#a9a9a9",darkgreen:"#006400",darkkhaki:"#bdb76b",darkmagenta:"#8b008b",darkolivegreen:"#556b2f",darkorange:"#ff8c00",darkorchid:"#9932cc",darkred:"#8b0000",darksalmon:"#e9967a",darkseagreen:"#8fbc8f",darkslateblue:"#483d8b",darkslategray:"#2f4f4f",darkturquoise:"#00ced1",darkviolet:"#9400d3",deeppink:"#ff1493",deepskyblue:"#00bfff",dimgray:"#696969",dodgerblue:"#1e90ff",firebrick:"#b22222",floralwhite:"#fffaf0",forestgreen:"#228b22",fuchsia:"#ff00ff",gainsboro:"#dcdcdc",ghostwhite:"#f8f8ff",gold:"#ffd700",goldenrod:"#daa520",gray:"#808080",green:"#008000",greenyellow:"#adff2f",honeydew:"#f0fff0",hotpink:"#ff69b4","indianred ":"#cd5c5c",indigo:"#4b0082",ivory:"#fffff0",khaki:"#f0e68c",lavender:"#e6e6fa",lavenderblush:"#fff0f5",lawngreen:"#7cfc00",lemonchiffon:"#fffacd",lightblue:"#add8e6",lightcoral:"#f08080",lightcyan:"#e0ffff",lightgoldenrodyellow:"#fafad2",lightgrey:"#d3d3d3",lightgreen:"#90ee90",lightpink:"#ffb6c1",lightsalmon:"#ffa07a",lightseagreen:"#20b2aa",lightskyblue:"#87cefa",lightslategray:"#778899",lightsteelblue:"#b0c4de",lightyellow:"#ffffe0",lime:"#00ff00",limegreen:"#32cd32",linen:"#faf0e6",magenta:"#ff00ff",maroon:"#800000",mediumaquamarine:"#66cdaa",mediumblue:"#0000cd",mediumorchid:"#ba55d3",mediumpurple:"#9370d8",mediumseagreen:"#3cb371",mediumslateblue:"#7b68ee",mediumspringgreen:"#00fa9a",mediumturquoise:"#48d1cc",mediumvioletred:"#c71585",midnightblue:"#191970",mintcream:"#f5fffa",mistyrose:"#ffe4e1",moccasin:"#ffe4b5",navajowhite:"#ffdead",navy:"#000080",oldlace:"#fdf5e6",olive:"#808000",olivedrab:"#6b8e23",orange:"#ffa500",orangered:"#ff4500",orchid:"#da70d6",palegoldenrod:"#eee8aa",palegreen:"#98fb98",paleturquoise:"#afeeee",palevioletred:"#d87093",papayawhip:"#ffefd5",peachpuff:"#ffdab9",peru:"#cd853f",pink:"#ffc0cb",plum:"#dda0dd",powderblue:"#b0e0e6",purple:"#800080",red:"#ff0000",rosybrown:"#bc8f8f",royalblue:"#4169e1",saddlebrown:"#8b4513",salmon:"#fa8072",sandybrown:"#f4a460",seagreen:"#2e8b57",seashell:"#fff5ee",sienna:"#a0522d",silver:"#c0c0c0",skyblue:"#87ceeb",slateblue:"#6a5acd",slategray:"#708090",snow:"#fffafa",springgreen:"#00ff7f",steelblue:"#4682b4",tan:"#d2b48c",teal:"#008080",thistle:"#d8bfd8",tomato:"#ff6347",turquoise:"#40e0d0",violet:"#ee82ee",wheat:"#f5deb3",white:"#ffffff",whitesmoke:"#f5f5f5",yellow:"#ffff00",yellowgreen:"#9acd32"};if(typeof a[b.toLowerCase()]!="undefined"){return a[b.toLowerCase()]}return false},RGB2Color:function(d,c,a){return"#"+metExploreD3.GraphUtils.byte2Hex(d)+metExploreD3.GraphUtils.byte2Hex(c)+metExploreD3.GraphUtils.byte2Hex(a)},chooseTextColor:function(c){if(c!=undefined){var b;if(c.slice(0,1)=="#"){var d=metExploreD3.GraphUtils.hexToRGB(c);var f=d.r;var e=d.g;var a=d.b;if((f*0.299+e*0.687+a*0.114)>186){b="black"}else{b="white"}}else{if(c.slice(0,3)=="rgb"){c=c.replace("rgb","");c=c.replace("(","");c=c.replace(")","");d=c.split(",");var f=d[0];var e=d[1];var a=d[2];if((f*0.299+e*0.687+a*0.114)>186){b="black"}else{b="white"}}else{b="black"}}return b}else{return"black"}},byte2Hex:function(b){var a="0123456789ABCDEF";return String(a.substr((b>>4)&15,1))+a.substr(b&15,1)},hexToRGB:function(c){var b=/^#?([a-f\d])([a-f\d])([a-f\d])$/i;c=c.replace(b,function(e,h,f,d){return h+h+f+f+d+d});var a=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(c);return a?{r:parseInt(a[1],16),g:parseInt(a[2],16),b:parseInt(a[3],16)}:null},exportGraphPng:function(){var c=$("#viz").cytoscape("get");var b=c.png();var a=new Blob([String(b)],{type:"image/png",encoding:"utf-8"});saveAs(a,"graph.png")},exportPNG:function(){metExploreD3.GraphUtils.escapeUnExportNode();window.URL=(window.URL||window.webkitURL);metExploreD3.GraphUtils.initialize("png")},exportJPG:function(){metExploreD3.GraphUtils.escapeUnExportNode();window.URL=(window.URL||window.webkitURL);metExploreD3.GraphUtils.initialize("jpeg")},escapeUnExportNode:function(){d3.selectAll("#buttonAnim").style("display","none");var b=d3.selectAll("#brush");if(b!=null){b.style("display","none")}var c=d3.selectAll("#buttonLink");if(c!=null){c.style("display","none")}var e=d3.selectAll("#buttonZoomIn");if(e!=null){e.style("display","none")}var g=d3.selectAll("#buttonHand");if(g!=null){g.style("display","none")}var a=d3.selectAll("#whiteBlack");if(a!=null){a.style("display","none")}var f=d3.selectAll("#invertColor");if(f!=null){f.style("display","none")}var d=d3.selectAll("#buttonZoomOut");if(d!=null){d.style("display","none")}},exportSVG:function(){metExploreD3.GraphUtils.escapeUnExportNode();window.URL=(window.URL||window.webkitURL);var a=metExploreD3.GraphUtils.initialize("svg")},initialize:function(h){var g=_metExploreViz.getSessionById("viz");var a=g.getForce();if(g!=undefined){var a=g.getForce();if(a!=undefined){if(metExploreD3.GraphNetwork.isAnimated("viz")=="true"){a.stop()}}}var f={xmlns:"http://www.w3.org/2000/xmlns/",xlink:"http://www.w3.org/1999/xlink",svg:"http://www.w3.org/2000/svg"};var j=[window.document],b=[];iframes=document.querySelectorAll("iframe"),objects=document.querySelectorAll("object");var c=window.document.createElementNS(f.svg,"svg");window.document.body.appendChild(c);var e=getComputedStyle(c);var d=metExploreD3.createLoadMask("Export initialization...","viz");if(d!=undefined){metExploreD3.showMask(d);metExploreD3.deferFunction(function(){[].forEach.call(iframes,function(l){try{if(l.contentDocument){j.push(l.contentDocument)}}catch(m){console.log(m)}});[].forEach.call(objects,function(l){try{if(l.contentDocument){j.push(l.contentDocument)}}catch(m){console.log(m)}});j.forEach(function(m){var n=metExploreD3.GraphUtils.getSources(m,e,f);for(var l=0;l<n.length;l++){if(n[l].classe=="D3viz"){b.push(n[l])}}});metExploreD3.hideMask(d);var k=c.parentNode;k.removeChild(c);if(b.length>1){metExploreD3.GraphUtils.createPopover(b,h)}else{if(b.length>0){return metExploreD3.GraphUtils.download(b[0],h)}else{alert("The Crowbar couldn’t find any SVG nodes.")}}},100)}},createPopover:function(b,d){metExploreD3.GraphUtils.cleanup();b.forEach(function(e){b.forEach(function(f){if(e!==f){if((Math.abs(e.top-f.top)<38)&&(Math.abs(e.left-f.left)<38)){f.top+=38;f.left+=38}}})});var a=document.createElement("div");document.body.appendChild(a);a.setAttribute("class","svg-crowbar");a.style["z-index"]=10000000;a.style.position="absolute";a.style.top=0;a.style.left=0;var c=document.createElement("div");document.body.appendChild(c);c.setAttribute("class","svg-crowbar");c.style.background="rgba(255, 255, 255, 0.7)";c.style.position="fixed";c.style.left=0;c.style.top=0;c.style.width="100%";c.style.height="100%";b.forEach(function(h,f){var g=document.createElement("div");a.appendChild(g);g.setAttribute("class","svg-crowbar");g.style.position="absolute";g.style.top=(h.top+document.body.scrollTop)+"px";g.style.left=(document.body.scrollLeft+h.left)+"px";g.style.padding="4px";g.style["border-radius"]="3px";g.style.color="white";g.style["text-align"]="center";g.style["font-family"]="'Helvetica Neue'";g.style.background="rgba(0, 0, 0, 0.8)";g.style["box-shadow"]="0px 4px 18px rgba(0, 0, 0, 0.4)";g.style.cursor="move";g.textContent="SVG #"+f+": "+(h.id?"#"+h.id:"")+(h.classe?"."+h.classe:"");var e=document.createElement("button");g.appendChild(e);e.setAttribute("data-source-id",f);e.style.width="150px";e.style["font-size"]="12px";e.style["line-height"]="1.4em";e.style.margin="5px 0 0 0";e.textContent="Download";e.onclick=function(j){metExploreD3.GraphUtils.download(h,d)}})},cleanup:function(){var f=document.querySelectorAll(".svg-crowbar");[].forEach.call(f,function(j){j.parentNode.removeChild(j)});d3.selectAll("#buttonAnim").style("display","inline");var b=d3.selectAll("#brush");if(b!=null){b.style("display","inline")}var c=d3.selectAll("#buttonLink");if(c!=null){c.style("display ","inline")}var e=d3.selectAll("#buttonZoomIn");if(e!=null){e.style("display","inline")}var h=d3.selectAll("#buttonHand");if(h!=null){h.style("display","inline")}var g=d3.selectAll("#invertColor");if(g!=null){g.style("display","inline")}var a=d3.selectAll("#whiteBlack");if(a!=null){a.style("display","inline")}var d=d3.selectAll("#buttonZoomOut");if(d!=null){d.style("display","inline")}},getSources:function(c,d,a){var b=[],e=c.querySelectorAll("svg");[].forEach.call(e,function(l){svg=l;if(svg.id=="D3viz"){function k(z){var A=d3.select(z).node();return d3.select(A.parentNode.insertBefore(A.cloneNode(true),A.nextSibling))[0][0]}var s=k(svg);s.setAttribute("version","1.1");s.removeAttribute("xmlns");s.removeAttribute("xlink");if(!s.hasAttributeNS(a.xmlns,"xmlns")){s.setAttributeNS(a.xmlns,"xmlns",a.svg)}if(!s.hasAttributeNS(a.xmlns,"xmlns:xlink")){s.setAttributeNS(a.xmlns,"xmlns:xlink",a.xlink)}var p=s.getElementById("buttonZoomIn");if(p!=null){p.parentNode.removeChild(p)}var o=s.getElementById("buttonZoomOut");if(o!=null){o.parentNode.removeChild(o)}var w=s.getElementById("buttonHand");if(w!=null){w.parentNode.removeChild(w)}var h=s.getElementById("buttonAnim");if(h!=null){h.parentNode.removeChild(h)}var j=s.getElementById("invertColor");if(j!=null){j.parentNode.removeChild(j)}var u=s.getElementById("whiteBlack");if(u!=null){u.parentNode.removeChild(u)}var g=s.getElementById("brush");if(g!=null){g.parentNode.removeChild(g)}var m;d3.select(s).select("#graphComponent").selectAll("g.node").select(".structure_metabolite").each(function(){var A=this.firstChild.getAttribute("href");if(window.XDomainRequest){xdr=new XDomainRequest()}else{if(window.XMLHttpRequest){var E=new XMLHttpRequest();E.open("GET",A,false);E.send(null);if(E.responseXML!=null){var C=E.responseXML.getElementsByTagName("svg")[0];if(this.getAttribute("width")!=null){var F=parseFloat(this.getAttribute("width").split("px")[0])/parseFloat(C.getAttribute("width").split("px")[0]);C.setAttribute("x",this.getAttribute("x"));C.setAttribute("y",this.getAttribute("y"));C.setAttribute("width",this.getAttribute("width").split("px")[0]);C.setAttribute("height",this.getAttribute("height").split("px")[0]);C.setAttribute("class","structure_metabolite");var z=C.children;for(var B=0;B<z.length;B++){z[B].setAttribute("transform","scale("+F+")")}var D=this.parentNode;D.removeChild(this);D.appendChild(C)}}}else{alert("Votre navigateur ne gère pas l'AJAX cross-domain !")}}});d3.select(s).select(".logoViz").each(function(){var A=this.firstChild.getAttribute("href");if(window.XDomainRequest){xdr=new XDomainRequest()}else{if(window.XMLHttpRequest){var D=new XMLHttpRequest();D.open("GET",A,false);D.send(null);if(D.responseXML!=null){var B=D.responseXML.getElementsByTagName("svg")[0];if(this.firstChild.getAttribute("width")!=null){B.setAttribute("x",this.firstChild.getAttribute("x"));B.setAttribute("y",this.firstChild.getAttribute("y"));B.setAttribute("width",this.firstChild.getAttribute("width").split("px")[0]);B.setAttribute("height",this.firstChild.getAttribute("height").split("px")[0]);B.setAttribute("class","logoViz");var z=B.children;var C=this.parentNode;C.removeChild(this);C.appendChild(B)}}}else{alert("Votre navigateur ne gère pas l'AJAX cross-domain !")}}});m=metExploreD3.GraphUtils.setInlineStyles(s,d,m);var r=svg.parentNode.getBoundingClientRect();var n=d3.select(s).select("#graphComponent")[0][0].getBoundingClientRect();var y=r.left+100-n.left;var x=r.top+50-n.top;d3.select(s).select("#graphComponent").attr("transform","translate("+y+","+x+") scale(1)");n=d3.select(s).select("#graphComponent")[0][0].getBoundingClientRect();var t=r.width;if((r.width+n.right-r.right+20)>t){t=r.width+n.right-r.right+20}else{d3.select(s).select("#graphComponent").attr("transform","translate(0,"+x+") scale(1)")}s.setAttribute("width",t);var f=r.height;if((r.height+n.bottom-r.bottom+20)>f){f=r.height+n.bottom-r.bottom+20}s.setAttribute("height",f);d3.select(s).select("#metexplore").text("MetExploreViz").attr("x",s.getAttribute("width")-92).attr("y",s.getAttribute("height")-10);var n=d3.select(s).select("#graphComponent")[0][0].getBoundingClientRect();var y=r.left+100-n.left;var x=r.top+50-n.top;d3.select(s).select("#graphComponent").attr("transform",d3.select(svg).select("#graphComponent").attr("transform"));n=d3.select(s).select("#graphComponent")[0][0].getBoundingClientRect();var t=r.width;s.setAttribute("width",t);var f=r.height;s.setAttribute("height",f);var q=(new XMLSerializer()).serializeToString(s);var v='<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">';b.push({top:r.top,left:r.left,width:parseInt(s.getAttribute("width"))*2,height:parseInt(s.getAttribute("height"))*2,classe:s.getAttribute("class"),id:s.getAttribute("id"),parent:svg.parentNode.id,childElementCount:s.childElementCount,source:[v+q]});d3.select(s).remove()}});return b},saveAsSvg:function(c,a){var b=document.createElement("a");if(typeof b.download==="string"){b.href=c;b.download=a;document.body.appendChild(b);b.click();document.body.removeChild(b)}else{window.open(c)}var e=_metExploreViz.getSessionById("viz");var d=e.getForce();if(e!=undefined){if(d!=undefined){if(metExploreD3.GraphNetwork.isAnimated("viz")=="true"){d.start()}}}},binaryblob:function(b,h){var d=window.atob(b.toDataURL("image/"+h).replace(/^data:image\/(png|jpeg);base64,/,""));var l=new ArrayBuffer(d.length);var c=new Uint8Array(l);for(var g=0;g<d.length;g++){c[g]=d.charCodeAt(g)}var j=new DataView(l);var a=new Blob([j],{type:"image/"+h});var e=self.URL||self.webkitURL||self;var k=e.createObjectURL(a);var f='<img src="'+k+'">';d3.select("#img").html(f);return k},saveAsBinary:function(e,b,d){var g="data:image/svg+xml;base64,"+window.btoa(decodeURIComponent(encodeURIComponent(e.source)));var c=document.createElement("canvas");c.id="canvas";c.height=e.height*4;c.width=e.width*4;c.style.zIndex=8;c.style.position="absolute";c.style.border="1px solid";var a=document.getElementsByTagName("body")[0];a.appendChild(c);context=c.getContext("2d");var f=new Image();f.onload=function(){var h=metExploreD3.createLoadMask("Export in progress...",e.parent);if(h!=undefined){metExploreD3.showMask(h);metExploreD3.deferFunction(function(){context.drawImage(f,0,0,e.width*4,e.height*4);var j=metExploreD3.GraphUtils.binaryblob(c,d);var l=document.createElement("a");if(typeof l.download==="string"){l.download=b;l.href=j;document.body.appendChild(l);l.click();document.body.removeChild(l)}else{window.open(j)}var k=c.parentNode;k.removeChild(c);metExploreD3.hideMask(h);var n=_metExploreViz.getSessionById("viz");var m=n.getForce();if(n!=undefined){if(m!=undefined){if(metExploreD3.GraphNetwork.isAnimated("viz")=="true"){m.start()}}}},100)}};f.src=g},download:function(d,c){if(c=="jpeg"||c=="png"){metExploreD3.GraphUtils.saveAsBinary(d,"metabolicNetwork."+c,c)}if(c=="svg"){var a=new Blob([d.source],{type:"data:image/svg+xml"});var b=URL.createObjectURL(a);metExploreD3.GraphUtils.saveAsSvg(b,"metabolicNetwork.svg")}metExploreD3.GraphUtils.cleanup()},explicitlySetStyle:function(f,h){var b=getComputedStyle(f);var e,a,d,g;var c="";for(e=0,a=b.length;e<a;e++){d=b[e];g=b.getPropertyValue(d);if(g!==h.getPropertyValue(d)){if(f.tagName=="rect"){if(f.getAttribute("class")=="stroke"){if(d!="height"&&d!="width"){c+=d+":"+g+";"}}else{if(d!="fill"&&d!="height"&&d!="width"){c+=d+":"+g+";"}}}else{if(d!="marker-start"||d!="marker-end"){c+=d+":"+g+";"}}}}f.setAttribute("style",c)},traverse:function(c){var a=[];a.push(c);b(c);function b(d){if(d&&d.hasChildNodes()){var e=d.firstChild;if(e.className!=undefined){if(e.tagName!="image"){while(e){if(e.getAttribute!=undefined){if(e.getAttribute("href")!="resources/icons/pause.svg"&&e.getAttribute("href")!="resources/icons/whiteBlack.png"&&e.getAttribute("href")!="resources/icons/invertColor.svg"&&e.getAttribute("href")!="resources/icons/link.svg"&&e.getAttribute("href")!="resources/icons/unlink.svg"){if(e.nodeType===1&&e.nodeName!="SCRIPT"){a.push(e);b(e)}e=e.nextSibling}}else{if(e.nodeType===1&&e.nodeName!="SCRIPT"){b(e)}e=e.nextSibling}}}}else{while(e){if(e.nodeType===1&&e.nodeName!="SCRIPT"){b(e)}e=e.nextSibling}}}}return a},setInlineStyles:function(a,e,d){var c=metExploreD3.GraphUtils.traverse(a);d=c;var b=c.length;while(b--){metExploreD3.GraphUtils.explicitlySetStyle(c[b],e)}return d},exportSVGMain:function(){d3.selectAll("#buttonAnim").style("display","none");var c=d3.selectAll("#buttonLink");if(c!=null){c.style("display","none")}var b=d3.selectAll("#brush");if(b!=null){b.style("display","none")}var f=d3.selectAll("#buttonZoomIn");if(f!=null){f.style("display","none")}var h=d3.selectAll("#buttonHand");if(h!=null){h.style("display","none")}var g=d3.selectAll("#invertColor");if(g!=null){g.style("display","none")}var a=d3.selectAll("#whiteBlack");if(a!=null){a.style("display","none")}var e=d3.selectAll("#buttonZoomOut");if(e!=null){e.style("display","none")}window.URL=(window.URL||window.webkitURL);var d=metExploreD3.GraphUtils.initializeMain();return d},initializeMain:function(){var d={xmlns:"http://www.w3.org/TR/xml-names/",xlink:"http://www.w3.org/1999/xlink",svg:"http://www.w3.org/2000/svg"};var b=[window.document],a=[];iframes=document.querySelectorAll("iframe"),objects=document.querySelectorAll("object");var c=window.document.createElementNS(d.svg,"svg");window.document.body.appendChild(c);var e=getComputedStyle(c);[].forEach.call(iframes,function(f){try{if(f.contentDocument){b.push(f.contentDocument)}}catch(g){console.log(g)}});[].forEach.call(objects,function(f){try{if(f.contentDocument){b.push(f.contentDocument)}}catch(g){console.log(g)}});b.forEach(function(g){var h=metExploreD3.GraphUtils.getSources(g,e,d);for(var f=0;f<h.length;f++){if(h[f].classe=="D3viz"){a.push(h[f])}}});if(a.length>0){return metExploreD3.GraphUtils.downloadMain(a[a.length-1])}else{alert("The Crowbar couldn’t find any SVG nodes.")}},downloadMain:function(c){var a="untitled";if(c.id){a=c.id}else{if(c.classe){a=c.classe}else{if(window.document.title){a=window.document.title.replace(/[^a-z0-9]/gi,"-").toLowerCase()}}}var b=window.URL.createObjectURL(new Blob(c.source,{type:"text/xml"}));metExploreD3.GraphUtils.cleanup();return c.source[0]},saveNetworkDot:function(){var a=metExploreD3.createLoadMask("Export DOT file...","viz");if(a!=undefined){metExploreD3.showMask(a);metExploreD3.deferFunction(function(){var b="digraph dotGraph {";var d=_metExploreViz.getSessionById("viz").getD3Data().getLinks();var f=d.length;var g={};var j=0;d.forEach(function(k){var l=k.getSource().getId();var m=k.getTarget().getId();if(g[l]==undefined){g[l]=i;l=i;i++}else{l=g[l]}if(g[m]==undefined){g[m]=i;m=i;i++}else{m=g[m]}if(k.isReversible()=="true"){b+=l+" -> "+m;b+=",\n";b+=m+" -> "+l}else{b+=l+" -> "+m}if(d.indexOf(k)!=f-1){b+=",\n"}});b+="}";var c=new Blob([b],{type:"text"});var e=URL.createObjectURL(c);var h=document.createElement("a");if(typeof h.download==="string"){h.href=e;h.download="save.dot";document.body.appendChild(h);h.click();document.body.removeChild(h)}else{window.open(uri)}metExploreD3.hideMask(a)},100)}},saveNetworkJSON:function(){var a=metExploreD3.createLoadMask("Saving...","viz");if(a!=undefined){metExploreD3.showMask(a);metExploreD3.deferFunction(function(){var b="{";b+='\n"linkStyle":'+JSON.stringify(metExploreD3.getLinkStyle());b+=',\n"reactionStyle":'+JSON.stringify(metExploreD3.getReactionStyle());b+=',\n"generalStyle":'+JSON.stringify(metExploreD3.getGeneralStyle());b+=',\n"metaboliteStyle":'+JSON.stringify(metExploreD3.getMetaboliteStyle());b+=',\n"comparedPanels":'+JSON.stringify(_metExploreViz.comparedPanels);b+=',\n"linkedByTypeOfMetabolite":'+JSON.stringify(_metExploreViz.linkedByTypeOfMetabolite);if(_metExploreViz.getMappingsLength!=undefined){b+=',\n"mappings":'+JSON.stringify(_metExploreViz.getMappingsSet(),function(l,k){if(l==="name"){if(k.search("(json)")==-1){k+="(json)"}return k}if(l==="data"){return undefined}return k})}b+=',\n"sessions":{';var j=_metExploreViz.getSessionsSet();var f=0;for(var e in j){j[e].getD3Data().initNodeIndex();b+="\n"+JSON.stringify(e)+':{\n"id":"'+_metExploreViz.getSessionById(e).getId()+'",';b+='\n"animated": false ,';b+='\n"d3Data":{"id":'+JSON.stringify(e)+",";b+='"nodes":[';_metExploreViz.getSessionById(e).getD3Data().getNodes().forEach(function(l){b+='{"name":'+JSON.stringify(l.getName())+",";if(l.getCompartment()!=undefined){b+='"compartment":'+JSON.stringify(l.getCompartment())+","}if(l.getPathways()!=undefined){b+='"pathways":'+JSON.stringify(l.getPathways())+","}b+='"dbIdentifier":'+JSON.stringify(l.getDbIdentifier())+",";if(l.getIdentifier()!=undefined){b+='"identifier":'+JSON.stringify(l.getIdentifier())+","}if(l.getEC()!=undefined){b+='"ec":'+JSON.stringify(l.getEC())+","}b+='"id":'+JSON.stringify(l.getId())+",";if(l.getIdentifier()!=undefined){b+='"identifier":'+JSON.stringify(l.getIdentifier())+","}if(l.getReactionReversibility()!=undefined){b+='"reactionReversibility":'+JSON.stringify(l.getReactionReversibility())+","}if(l.getIsSideCompound()!=undefined){b+='"isSideCompound":'+JSON.stringify(l.getIsSideCompound())+","}b+='"biologicalType":'+JSON.stringify(l.getBiologicalType())+",";b+='"selected":'+JSON.stringify(l.isSelected())+",";if(l.isDuplicated()!=undefined){b+='"duplicated":'+JSON.stringify(l.isDuplicated())+","}else{b+='"duplicated":false,'}b+='"labelVisible":'+JSON.stringify(l.getLabelVisible())+",";if(l.getSvg()!=undefined){b+='"svg":'+JSON.stringify(l.getSvg())+",";b+='"svgWidth":'+JSON.stringify(l.getSvgWidth())+",";b+='"svgHeight":'+JSON.stringify(l.getSvgHeight())+","}if(l.getMappingDatasLength()>0){b+='"mappingDatas":[';l.getMappingDatas().forEach(function(m){b+='{"node":'+JSON.stringify(l.index)+",";if(m.getMappingName().search("(json)")==-1){b+='"mappingName":'+JSON.stringify(m.getMappingName()+"(json)")+","}else{b+='"mappingName":'+JSON.stringify(m.getMappingName())+","}b+='"conditionName":'+JSON.stringify(m.getConditionName())+",";b+='"mapValue":'+JSON.stringify(m.getMapValue());b+="}";var n=l.getMappingDatas().indexOf(m);if(n!=l.getMappingDatas().length-1){b+=","}});b+="],"}if(l.x!=undefined){b+='"x":'+JSON.stringify(l.x)+","}if(l.y!=undefined){b+='"y":'+JSON.stringify(l.y)+","}if(l.px!=undefined){b+='"px":'+JSON.stringify(l.px)+","}if(l.py!=undefined){b+='"py":'+JSON.stringify(l.py)}b+="}";var k=_metExploreViz.getSessionById(e).getD3Data().getNodes().indexOf(l);if(k!=_metExploreViz.getSessionById(e).getD3Data().getNodes().length-1){b+=","}});b+="],";b+='"links":[';_metExploreViz.getSessionById(e).getD3Data().getLinks().forEach(function(l){b+='{"id":'+JSON.stringify(l.getId())+",";b+='"source":'+JSON.stringify(l.getSource().index)+",";b+='"target":'+JSON.stringify(l.getTarget().index)+",";b+='"interaction":'+JSON.stringify(l.getInteraction())+",";b+='"reversible":'+JSON.stringify(l.isReversible());b+="}";var k=_metExploreViz.getSessionById(e).getD3Data().getLinks().indexOf(l);if(k!=_metExploreViz.getSessionById(e).getD3Data().getLinks().length-1){b+=","}});b+="]},";b+='\n"colorMappings":'+JSON.stringify(_metExploreViz.getSessionById(e).getColorMappingsSet())+",";b+='\n"linked":'+JSON.stringify(_metExploreViz.getSessionById(e).isLinked())+",";b+='\n"active":'+JSON.stringify(_metExploreViz.getSessionById(e).isActive())+",";b+='\n"mapped":'+JSON.stringify(_metExploreViz.getSessionById(e).isMapped())+",";b+='\n"mappingDataType":'+JSON.stringify(_metExploreViz.getSessionById(e).getMappingDataType())+",";if(JSON.stringify(_metExploreViz.getSessionById(e).getActiveMapping())!=undefined&&_metExploreViz.getSessionById(e).getActiveMapping().search("(json)")==-1){var h=JSON.stringify(_metExploreViz.getSessionById(e).getActiveMapping()+"(json)")}else{var h=JSON.stringify(_metExploreViz.getSessionById(e).getActiveMapping())}b+='\n"activeMapping":'+h+",";b+='\n"duplicatedNodes":'+JSON.stringify(_metExploreViz.getSessionById(e).getDuplicatedNodes())+",";b+='\n"selectedNodes":'+JSON.stringify(_metExploreViz.getSessionById(e).getSelectedNodes())+",";b+='\n"resizable":'+_metExploreViz.getSessionById(e).isResizable();b+="}";if(f!=j.length-1){b+=","}f++}b+="}}";var c=new Blob([b],{type:"text/json"});var d=URL.createObjectURL(c);var g=document.createElement("a");if(typeof g.download==="string"){g.href=d;g.download="save.json";document.body.appendChild(g);g.click();document.body.removeChild(g)}else{window.open(uri)}metExploreD3.hideMask(a)},100)}},saveNetworkGml:function(){var a=metExploreD3.createLoadMask("Export GML file...","viz");if(a!=undefined){metExploreD3.showMask(a);metExploreD3.deferFunction(function(){var b="graph [";b+="\ndirected 1\n";var e=0;var g={};_metExploreViz.getSessionById("viz").getD3Data().getNodes().forEach(function(h){g[h.getId()]=e;b+="node [\n";b+="id "+e+"\n";b+='label "'+h.getName()+'"\n';b+="graphics [\n";b+="x "+h.x+"\n";b+="y "+h.y+"\n";b+="]\n";b+="]\n";e++});_metExploreViz.getSessionById("viz").getD3Data().getLinks().forEach(function(h){b+="edge [\n";b+="source "+g[h.getSource().getId()]+"\n";b+="target "+g[h.getTarget().getId()]+"\n";b+='label "'+h.getSource().getId().replace("-","")+"-"+h.getTarget().getId().replace("-","")+'"\n';b+="]\n";if(h.isReversible()=="true"){b+="edge [\n";b+="source "+g[h.getTarget().getId()]+"\n";b+="target "+g[h.getSource().getId()]+"\n";b+='label "'+h.getSource().getId().replace("-","")+"-"+h.getTarget().getId().replace("-","")+'"\n';b+="]\n"}});b+="]";var c=new Blob([b],{type:"text"});var d=URL.createObjectURL(c);var f=document.createElement("a");if(typeof f.download==="string"){f.href=d;f.download="save.gml";document.body.appendChild(f);f.click();document.body.removeChild(f)}else{window.open(uri)}metExploreD3.hideMask(a)},100)}}};