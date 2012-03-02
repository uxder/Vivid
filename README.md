This project is still a work in progress.

#Vivid - A jQuery Html5 Canvas Photo Effects Plugin

##What is Vivid?

Vivid is a jQuery Plugin that transforms an image into a canvas so you can apply filter effects to it.
Vivid is great because:

- Vivid will maintain the original css applied to your image and transfer it to the canvas.
- Vivid also has a simple plugin mechanism so you can easily create your own filters.  
- Each filter can also accept its own options

Currently the default the filter is the blackWhite filter which accepts a lightness option.

##How do I use vivid?

Vivid needs to be applied to an image.  Set the filter by setting the name in the filter option (or defaults to blackWhite).
Additionally, set the options of the filter you are applying by adding an object literal with the filter name in.  Each plugin
will have different options.

 $('#someImage').vivid(
	{
		filter: 'blackWhite',
		blackWhite: {
			lightness: 0.3
		}
	}
 );


##How can I help?

If you want to join me on this project, send me a pull request with changes.  You can check out the blackWhite filter and use that as a sample to create additional filters.