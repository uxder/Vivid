/* 
   Author: Scott Murphy 
   Vivid - A jQuery Html5 Canvas Photo Effects Plugin
   Using a slightly modified version of Alex Sexton's jquery.prototypal-inheritance pattern.
*/

/**
 * Create Vivid GlobalNameSpace
 */
var Vivid = Vivid || {
	filter: {},
	Core: {}
};

/**
 * Vivid Core
 */
Vivid.core = (function( window, document, $){
	/**
	 * Private Variables
	 */
	var elem, 
		$elem, 
		imgW,
		imgH,
		$canvas,
		ctx,
		effect,
		//default options
		options = {
			effect: 'blackWhite'
		};
	
	/**
	 * Constructor Method for Nebula
	 * @param {Object Literal} [op] User defined setting to the plugin options
	 * @return this for jQuery chaining
	 */
	var n = function( el, op ) {
		
		// Mix in the passed-in options with the default options
	    options = $.extend( {}, options, op );

	    elem  = el;
	    $elem = $(elem);
	
		build();
		draw();
		
		//create filter
		applyFilter(options.effect);
		
	    // for chaining
	    return this;
	};
	
	
	
	/**
	 * apply the desired filter effect
	 * @param {String} [filterName] Name of effect to initialize
	 */
	var applyFilter = function(filterName) {
		//explictly set items to the plugin
		var settings = {
			"elem": elem,
			"$elem": $elem,
			"imgW": imgW,
			"imgH": imgH,
			"$canvas": $canvas,
			"ctx": ctx,
			"options": options
		};
		//try {
			effect = new Vivid.filter[filterName](settings);
	//	} catch(err) {
	//		throw new Error("Oops.  Looks like the Vivid Filter you requested is not available.");
	//	}
	}
	
	
	/**
	 * Create a dynamic canvas element and hide the $elem image
	 */
	var build = function() {

		var	canvasHtml, 
			style, 
			classList;
		
		imgW = $elem.width();
		imgH = $elem.height();
		
		//create a canvas element 
		canvasHtml = '<canvas width="'+ imgW +'" height="'+ imgH +'"></canvas>';
		$elem.after(canvasHtml);
		
		//save and create canvas context
		$canvas = $elem.next('canvas');
		ctx = $canvas[0].getContext('2d');
		
		transferStyles();
		transferClassAndId();
		
		//remove the image 
		$elem.remove();
	}
	
	/**
	 * Also computed Styles of the image to the canvas
	 */
	var transferStyles = function() {
		//transfer any computed Styles	
		var style = {},
			cStyle,
			camelize;
		
		camelize = function(a,b){
		        return b.toUpperCase();
		}
		
		//get the computer style for the image*/
		cStyle = window.getComputedStyle($elem[0], null)
		
		//loop through it and reformat as an object we can pass to jQuery .css method
		for(var i=0;i<cStyle.length;i++){
		      var p = cStyle[i];
		      var c = p.replace(/\-([a-z])/g, camelize);
		      var v = cStyle.getPropertyValue(p);
		      style[c] = v;
		}
		
		//apply style
		$canvas.css(style);
	}
	
	/**
	 * Transfer over classes and Ids that were on the image to the canvas
	 */
	var transferClassAndId = function() {
			//transfer all image classes to the canvas
			classList = $elem[0].className.split(/\s+/);
			for (var i = 0; i < classList.length; i++) {
				$canvas.addClass(classList[i]);
			}

			//transfer any ID elements
			if($elem.attr('id')) $canvas.attr('id', $elem.attr('id'));
	}
	
	
	/**
	 * Draw the image onto the canvas
	 */
	var draw = function() {
		ctx.drawImage($elem[0], 0, 0, imgW, imgH);
	}
	
	return n;
	
})( window, document, jQuery );

/*
 * Object.create support test, and fallback for browsers without it
 */
if ( typeof Object.create !== 'function' ) {
    Object.create = function (o) {
        function F() {}
        F.prototype = o;
        return new F();
    };
}

/*
 * Finally Create the Vivid jQuery Plugin Object
 */
$.fn.vivid = function(options) {
	
	//test for canvas support
	//TODO
	var noCanvasSupport = function() {
		return false;
	}
	
	//check for canvas support
	if(noCanvasSupport()) return;
	
	//create Vivid object
	return this.each(function() {
		Object.create(Vivid.core(this,options));
	});
}

/**
 * Prototype for plugin
 */
Vivid.filter.base = function() {
	var s,
		pluginName = "blackWhite",
	 	options = {};
}

/**
 * Vivid blackWhite Plugin
 */
Vivid.filter.blackWhite = (function( window, document, jQuery) {
	//shortname for settings
	var s,
		pluginName = "blackWhite",
	 	options = {
			lightness: 0.3
	    };
	
	/**
	 * Constructor
	 * @param {Object Literal} [settings]  Object that contains elem, $elem, imgW, imgH, $canvas, ctx, options
	 */
	var filter = function(settings) {
		//set the settings
		s = settings;
		// Mix in the passed-in options with the default options
		options = $.extend( {}, options, s.options[pluginName] );
		//initialize plugin
		this.init();
	}
	
	//Pubic Methods
	filter.prototype = {
		init: function() {
			var imgd = s.ctx.getImageData(0, 0, s.imgW, s.imgH);
			var p = imgd.data;
			for (var i = 0, n = p.length; i < n; i += 4) {
			    var grayscale = p[i] * options.lightness + p[i+1] * 0.6 + p[i+2] * 0.1;
			
			    p[i] = grayscale; 	 //red  
			    p[i+1] = grayscale;  //blue
			    p[i+2] = grayscale;  //green
			 }
			s.ctx.putImageData(imgd, 0, 0);
		}
	}
	
	//return the plugin object
	return filter;
})( window, document, jQuery );

