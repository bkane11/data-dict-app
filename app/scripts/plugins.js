if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (searchElement, fromIndex) {
      if ( this === undefined || this === null ) {
        throw new TypeError( '"this" is null or not defined' );
      }

      var length = this.length >>> 0; // Hack to convert object.length to a UInt32

      fromIndex = +fromIndex || 0;

      if (Math.abs(fromIndex) === Infinity) {
        fromIndex = 0;
      }

      if (fromIndex < 0) {
        fromIndex += length;
        if (fromIndex < 0) {
          fromIndex = 0;
        }
      }

      for (;fromIndex < length; fromIndex++) {
        if (this[fromIndex] === searchElement) {
          return fromIndex;
        }
      }

      return -1;
    };
  }
  
if($)
	if($.fn){
		// support cross domain calls - especially necessary for IE
		$.support.cors = true; 

		$.fn.css2 = jQuery.fn.css;
		$.fn.css = function() {
			if (arguments.length) return jQuery.fn.css2.apply(this, arguments);
			var attr = ['font-family','font-size','font-weight','font-style','color',
			'text-transform','text-decoration','letter-spacing','word-spacing',
			'line-height','text-align','vertical-align','direction','background-color',
			'background-image','background-repeat','background-position',
			'background-attachment','opacity','width','height','top','right','bottom',
			'left','margin-top','margin-right','margin-bottom','margin-left',
			'padding-top','padding-right','padding-bottom','padding-left',
			'border-top-width','border-right-width','border-bottom-width',
			'border-left-width','border-top-color','border-right-color',
			'border-bottom-color','border-left-color','border-top-style',
			'border-right-style','border-bottom-style','border-left-style','position',
			'display','visibility','z-index','overflow-x','overflow-y','white-space',
			'clip','float','clear','cursor','list-style-image','list-style-position',
			'list-style-type','marker-offset'];
			var len = attr.length, obj = {};
			for (var i = 0; i < len; i++) 
				obj[attr[i]] = jQuery.fn.css2.call(this, attr[i]);
			return obj;
		}
		//The magic code to add show/hide custom event triggers
		// (function ($) {
			  $.each(['show', 'hide'], function (i, ev) {
				var el = $.fn[ev];
				$.fn[ev] = function () {
				  this.trigger(ev);
				  return el.apply(this, arguments);
				};
			  });
			// })($||);
 
	}
	