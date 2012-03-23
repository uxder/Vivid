/* 
   Vivid - A jQuery Html5 Canvas Photo Effects Plugin
   Author: Scott Murphy 2012
   Github: uxder
   Version - totally still working on this version and Experimental
   Description:
	Vivid is a jQuery Plugin that transforms an image into a canvas so you can apply effects to it.
	Apply vivid to any image and it will replace it with a canvas that has all the same css styles and classes applied to the 
	original image.
	
	Vivid also has a simple plugin mechanism so you can easily create your own filters.  Each filter can accpet its own options
	Currently the default the filter is the blackWhite filter which can serve as an example to create other filters.
		
	See samples/samples.html for more.
	
   Usage:
	 $('#someImage').vivid(
		{
			filter: 'blackWhite',
			blackWhite: {
				lightness: 0.3
			}
		}
	 );
	
	
	License: 
	 Permission is hereby granted, free of charge, to any person
 	 obtaining a copy of this software and associated documentation
	 files (the "Software"), to deal in the Software without
	 restriction, including without limitation the rights to use,
	 copy, modify, merge, publish, distribute, sublicense, and/or sell
	 copies of the Software, and to permit persons to whom the
	 Software is furnished to do so, subject to the following
	 conditions:

	 The above copyright notice and this permission notice shall be
	 included in all copies or substantial portions of the Software.

	 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
	 EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
	 OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
	 NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
	 HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
	 WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
	 FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
	 OTHER DEALINGS IN THE SOFTWARE.
*/

/**
 * Create Vivid GlobalNameSpace
 */
var Vivid = Vivid || {
	filter: {},
	core: {}
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
		img,
		$canvas,
		ctx,
		//default options
		options = {
			filter: 'blackWhite'
		};

	/**
	 * Constructor Method for Vivid
	 * @param {Object Literal} [op] User defined setting to the plugin options
	 * @return this for jQuery chaining
	 */
	var n = function( el, op ) {	
		// Mix in the passed-in options with the default options
	    options = $.extend( {}, options, op );

	    elem  = el;
	    $elem = $(elem);

		build();
		transferStyles();
		transferClassAndId();
		draw();
		applyFilter(options.filter);

		//remove the image 
		$elem.hide();

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
	 * Draw the image onto the canvas after the image has been loaded
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
	//or is it best to have user test this with modernizr?
	var canvasSupport = function() {
		var elem = document.createElement('canvas');
		return !!(elem.getContext && elem.getContext('2d'));
	}

	//check for canvas support
	if(!canvasSupport()) return;

	var self = this; //self correct scope
	//need to wait for the window to load to ensure that image width is calculated
	$(window).load(function() {
		//create Vivid object
		return self.each(function() {
			Object.create(Vivid.core(this,options));
		});
	});
}


/*************
 * Vivid blackWhite Plugin
 *************/
Vivid.filter.blackWhite = (function( window, document, jQuery) {
	//shortname for settings
	var s,
		pluginName = "blackWhite",
	 	options = {
			lightness: 0.3
	    };

	/**
	 * Constructor
	 * @param {Object Literal} [settings]  Objects passed from vivid core.
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
	//s object contains elem, $elem, imgW, imgH, $canvas, ctx, options and everything you'll need
	filter.prototype = {
		init: function() {
			var imgd = s.ctx.getImageData(0, 0, s.imgW, s.imgH),
			    p = imgd.data;
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




/*************
 * Vivid Retro Plugin
 * Contributed by Ikayzo, Inc (www.ikayzo.com)
 *************/
Vivid.filter.retro = (function( window, document, jQuery) {
	var s,
		pluginName = "retro",
		r = [0, 0, 0, 1, 1, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5, 6, 6, 7, 7, 7, 7, 8, 8, 8, 9, 9, 9, 9, 10, 10, 10, 10, 11, 11, 12, 12, 12, 12, 13, 13, 13, 14, 14, 15, 15, 16, 16, 17, 17, 17, 18, 19, 19, 20, 21, 22, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 39, 40, 41, 42, 44, 45, 47, 48, 49, 52, 54, 55, 57, 59, 60, 62, 65, 67, 69, 70, 72, 74, 77, 79, 81, 83, 86, 88, 90, 92, 94, 97, 99, 101, 103, 107, 109, 111, 112, 116, 118, 120, 124, 126, 127, 129, 133, 135, 136, 140, 142, 143, 145, 149, 150, 152, 155, 157, 159, 162, 163, 165, 167, 170, 171, 173, 176, 177, 178, 180, 183, 184, 185, 188, 189, 190, 192, 194, 195, 196, 198, 200, 201, 202, 203, 204, 206, 207, 208, 209, 211, 212, 213, 214, 215, 216, 218, 219, 219, 220, 221, 222, 223, 224, 225, 226, 227, 227, 228, 229, 229, 230, 231, 232, 232, 233, 234, 234, 235, 236, 236, 237, 238, 238, 239, 239, 240, 241, 241, 242, 242, 243, 244, 244, 245, 245, 245, 246, 247, 247, 248, 248, 249, 249, 249, 250, 251, 251, 252, 252, 252, 253, 254, 254, 254, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255],
		 g = [0, 0, 1, 2, 2, 3, 5, 5, 6, 7, 8, 8, 10, 11, 11, 12, 13, 15, 15, 16, 17, 18, 18, 19, 21, 22, 22, 23, 24, 26, 26, 27, 28, 29, 31, 31, 32, 33, 34, 35, 35, 37, 38, 39, 40, 41, 43, 44, 44, 45, 46, 47, 48, 50, 51, 52, 53, 54, 56, 57, 58, 59, 60, 61, 63, 64, 65, 66, 67, 68, 69, 71, 72, 73, 74, 75, 76, 77, 79, 80, 81, 83, 84, 85, 86, 88, 89, 90, 92, 93, 94, 95, 96, 97, 100, 101, 102, 103, 105, 106, 107, 108, 109, 111, 113, 114, 115, 117, 118, 119, 120, 122, 123, 124, 126, 127, 128, 129, 131, 132, 133, 135, 136, 137, 138, 140, 141, 142, 144, 145, 146, 148, 149, 150, 151, 153, 154, 155, 157, 158, 159, 160, 162, 163, 164, 166, 167, 168, 169, 171, 172, 173, 174, 175, 176, 177, 178, 179, 181, 182, 183, 184, 186, 186, 187, 188, 189, 190, 192, 193, 194, 195, 195, 196, 197, 199, 200, 201, 202, 202, 203, 204, 205, 206, 207, 208, 208, 209, 210, 211, 212, 213, 214, 214, 215, 216, 217, 218, 219, 219, 220, 221, 222, 223, 223, 224, 225, 226, 226, 227, 228, 228, 229, 230, 231, 232, 232, 232, 233, 234, 235, 235, 236, 236, 237, 238, 238, 239, 239, 240, 240, 241, 242, 242, 242, 243, 244, 245, 245, 246, 246, 247, 247, 248, 249, 249, 249, 250, 251, 251, 252, 252, 252, 253, 254, 255],
		  b = [53, 53, 53, 54, 54, 54, 55, 55, 55, 56, 57, 57, 57, 58, 58, 58, 59, 59, 59, 60, 61, 61, 61, 62, 62, 63, 63, 63, 64, 65, 65, 65, 66, 66, 67, 67, 67, 68, 69, 69, 69, 70, 70, 71, 71, 72, 73, 73, 73, 74, 74, 75, 75, 76, 77, 77, 78, 78, 79, 79, 80, 81, 81, 82, 82, 83, 83, 84, 85, 85, 86, 86, 87, 87, 88, 89, 89, 90, 90, 91, 91, 93, 93, 94, 94, 95, 95, 96, 97, 98, 98, 99, 99, 100, 101, 102, 102, 103, 104, 105, 105, 106, 106, 107, 108, 109, 109, 110, 111, 111, 112, 113, 114, 114, 115, 116, 117, 117, 118, 119, 119, 121, 121, 122, 122, 123, 124, 125, 126, 126, 127, 128, 129, 129, 130, 131, 132, 132, 133, 134, 134, 135, 136, 137, 137, 138, 139, 140, 140, 141, 142, 142, 143, 144, 145, 145, 146, 146, 148, 148, 149, 149, 150, 151, 152, 152, 153, 153, 154, 155, 156, 156, 157, 157, 158, 159, 160, 160, 161, 161, 162, 162, 163, 164, 164, 165, 165, 166, 166, 167, 168, 168, 169, 169, 170, 170, 171, 172, 172, 173, 173, 174, 174, 175, 176, 176, 177, 177, 177, 178, 178, 179, 180, 180, 181, 181, 181, 182, 182, 183, 184, 184, 184, 185, 185, 186, 186, 186, 187, 188, 188, 188, 189, 189, 189, 190, 190, 191, 191, 192, 192, 193, 193, 193, 194, 194, 194, 195, 196, 196, 196, 197, 197, 197, 198, 199];

	var filter = function(settings) {
		s = settings;
		this.init();
	}

	filter.prototype = {
		init: function() {
			var imgd = s.ctx.getImageData(0, 0, s.imgW, s.imgH);
			var p = imgd.data;
			for (var i = 0, n = p.length; i < n; i += 4) {
			    p[i] = r[p[i]]; 	 //red  
			    p[i+1] = b[p[i+1]];  //blue
			    p[i+2] = g[p[i+2]];  //green
			 }
			s.ctx.putImageData(imgd, 0, 0);
		}
	}
	return filter;
})( window, document, jQuery );



/*************
 * Vivid Sepia Plugin
 * Contributed by Ikayzo, Inc (www.ikayzo.com)
 * Inspired by: http://www.script-tutorials.com/html5-image-effects-sepia/
 * Options: noise
 * Sample: 	 $('#myImage').vivid(
				{
					filter: 'sepia', 
					sepia: {
						noise: 20
					}
				}
			 );
 *************/
Vivid.filter.sepia = (function( window, document, jQuery) {
	//shortname for settings
	var s,
		pluginName = "sepia",
		options = {
			noise: 15
	    };
	
	var filter = function(settings) {
		s = settings;
		options = $.extend( {}, options, s.options[pluginName] );
		this.init();
	}

	//Pubic Methods
	filter.prototype = {
		init: function() {
			var imgd = s.ctx.getImageData(0, 0, s.imgW, s.imgH);
			var p = imgd.data;
			for (var i = 0, n = p.length; i < n; i += 4) {
			    p[i] = Math.min(255, p[i] + 35); 	 //red  
			    p[i+1] = Math.min(255, p[i+1]);  //blue
			    p[i+2] = Math.min(255, p[i+2] - 25);  //green
			
			
				 var noise = Math.round(options.noise - Math.random() * options.noise);
				 for(var j=0; j<3; j++){
				       var iPN = noise + p[i+j];
				       p[i+j] = (iPN > 255) ? 255 : iPN;
				 }
			 }
			
			s.ctx.putImageData(imgd, 0, 0);
		}
	}

	//return the plugin object
	return filter;
})( window, document, jQuery );
