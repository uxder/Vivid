*This project is still a work in progress and probably isn't ready for production.

#Vivid - A jQuery Html5 Canvas Photo Effects Plugin

##What is Vivid?

Vivid is a jQuery Plugin that transforms an image into a canvas so you can apply filter effects to it.
Vivid is great because:

- Apply filters like black and white (desaturation) to your image (or technically canvas)
- Vivid will maintain the original css applied to your image and transfer it to the canvas.
- Vivid also has a simple plugin mechanism so you can easily create your own filters.  
- Each filter can also accept its own options

Currently the default the filter is the blackWhite filter which accepts a lightness option.

###Is Vivid production ready?

Not really.  I'm still working on this so it's untested and is more experimental at this point.

##How do I use vivid?

Vivid needs to be applied to an image.  Set the filter by setting the filter name in the filter option (otherwise defaults to blackWhite).
Additionally, set the options of the filter you are applying by adding an object literal with the filter name in.  Every filter plugin has
different options.  Example:

 $('#someImage').vivid(
	{
		filter: 'blackWhite',
		blackWhite: {
			lightness: 0.3
		}
	}
 );

The best place to start is to just look at the sample in /samples/samples.html.

##How can I help?

This project is a work in progress so any help is appreciated.  Send me a pull request with changes.  
You can check out the blackWhite filter and use that as a sample to create additional filters.