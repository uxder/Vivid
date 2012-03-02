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
 * Vivid blackWhite Plugin
 */
Vivid.plugin.blackWhite = (function() {
	
	/**
	 * Constructor
	 */
	var plugin = function(ctx) {
		console.log('test');
	}
	
	return plugin;
	
})();



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
	var n = function( op, el ) {
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
	applyEffect = function(effectName) {
		try {
			effect = new Vivid.plugin[effectName](ctx);
		} catch(err) {
			throw new Error("Oops.  Looks like the Vivid Effect you requested is not available.");
		}
	}
	
	
	/**
	 * Create a dynamic canvas element and hide the $elem image
	 */
	var build = function() {

		var	canvasHtml;
		
		imgW = $elem.width();
		imgH = $elem.height();
		
		canvasHtml = '<canvas width="'+ imgW +'" height="'+ imgH +'"></canvas>';
		//create a canvas element next to the canvas
		$elem.after(canvasHtml);
		//save this canvas
		$canvas = $elem.next('canvas');
		//create and save canvas context
		ctx = $canvas[0].getContext('2d');
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
 * Finally Create the Nebula Object
 */
$.fn.vivid = function(options) {
	Object.create(Vivid.core(options, this));
}


