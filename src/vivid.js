/* 
   Author: Scott Murphy 
   Vivid - A jQuery Html5 Canvas Photo Effects Plugin
   Using a slightly modified version of Alex Sexton's jquery.prototypal-inheritance pattern.
*/

/**
 * Create Vivid GlobalNameSpace
 */
var Vivid = Vivid || {
	plugin: {},
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
		
		//create effect
		applyEffect(options.effect);
		
	    // for chaining
	    return this;
	};
	
	
	
	/**
	 * apply the desired plugin effect
	 * @param {String} [effectName] Name of effect to initialize
	 */
	var applyEffect = function(effectName) {
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
			effect = new Vivid.plugin[effectName](settings);
	//	} catch(err) {
	//		throw new Error("Oops.  Looks like the Vivid Effect you requested is not available.");
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
		console.log($elem[0],  $elem.css);
		style = $elem[0].style;
		
		canvasHtml = '<canvas width="'+ imgW +'" height="'+ imgH +'"></canvas>';
		//create a canvas element next to the canvas and hide original image
		$elem.after(canvasHtml);
		
		//save this canvas
		$canvas = $elem.next('canvas');
		//create and save canvas context
		ctx = $canvas[0].getContext('2d');
		
		transferClassAndId();
	
		//remove the image 
		$elem.remove();
	}
	
	/**
	 * Transfer the ID and Class from the Image to Generated Canvas
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
 * Vivid blackWhite Plugin
 */
Vivid.plugin.blackWhite = (function() {
	
	//shortname for settings
	var s;
	
	/**
	 * Constructor
	 * @param {Object Literal} [settings]  Object that contains elem, $elem, imgW, imgH, $canvas, ctx, options
	 */
	var plugin = function(settings) {
		//set the settings
		s = settings;
		//initialize plugin
		this.init();
	}
	
	//Pubic Methods
	plugin.prototype = {
		init: function() {
			var imgd = s.ctx.getImageData(0, 0, s.imgW, s.imgH);
			var pix = imgd.data;
			for (var i = 0, n = pix.length; i < n; i += 4) {
			    var grayscale = pix[i  ] * .3 + pix[i+1] * .59 + pix[i+2] * .11;
			    pix[i] = grayscale;   // red
			    pix[i+1] = grayscale;   // green
			    pix[i+2] = grayscale;   // blue
			 }
			s.ctx.putImageData(imgd, 0, 0);
		}
	}
	
	//return the plugin object
	return plugin;
})();

