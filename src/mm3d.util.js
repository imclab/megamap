/**
 * The utility class for megamap library.
 * @author Ye Jiabin <alpha360x@gmail.com>
 */

var mm3d = mm3d || {};

mm3d.Util = (function(){
	var obj = function(type) {
		this._e = document.createElement(type);
	};

	obj.prototype = {
		/**
		 * Applys attributes for DOM nodes.
		 * @param attrs the attributes to be applied
		 * @return this object for cascading change
		 */
		attr : function(attrs) {
			for (var item in attrs) {
				this._e[item] = attrs[item];
			}
			return this;
		},

		/**
		 * Applys css attributes for DOM nodes.
		 * @param attrs the css attributes to be applied
		 * @return this object for cascading change
		 */
		 css : function(attrs) {
			for (var item in attrs) {
				this._e['style'][item] = attrs[item];
			}
			return this;
		 },

		 /**
		  * Changes the innerHTML value of the node.
		  * @param txt the new text in the html
		  * @return the object for cascading change ,
		  * 		if the parameter is not set
		  * 	    return the origin text.
		  */
		  html : function(txt) {
			  if (txt === undefined) { 
				  return this._e.innerHTML; 
			  } else {
				  this._e.innerHTML = txt;
				  return this;
			  }
		  },

		  /**
		   * Appends a child node for the container.
		   * @return the object for cascading change ,
		   */
		   add : function(node) {
			   this._e.appendChild(node.get());
			   return this;
		   },

		  /**
		   * Gets && Sets the width of the container.
		   * @param width the new width of the container in pixel
		   * @return the object for cascading change ,
		   * 		if the parameter is not set
		   * 	    return the origin width.
		   */
		   w : function(width) {
			   if (width === undefined) {
				   return this._e['style']['width'];
			   } else {
				   this._e['style']['width'] = width + 'px';
				   return this;
			   }
		   },

		  /**
		   * Gets && Sets the height of the container.
		   * @param height the new height of the container in pixel
		   * @return the object for cascading change ,
		   * 		if the parameter is not set
		   * 	    return the origin height.
		   */
		   h : function(height) {
			   if (height === undefined) {
				   return this._e['style']['height'];
			   } else {
				   this._e['style']['height'] = height + 'px';
				   return this;
			   }
		   },

		  /**
		   * Gets the native DOM node.
		   * @return the native DOM node.
		   */
		   get : function () {
			   return this._e;
		   },

		   /**
			* Event handling for the DOM node
			* @param type the event type
			* @param callback the callback function.
			* @return this object.
			*/
			evt : function(type, callback) {
				this._e.addEventListener(type, callback, false);
				return this;
			}

	};

	return {
		div : function () {
			return new obj('div');
		},

		span : function () {
			return new obj('span');
		},

		cav : function () {
			return new obj('canvas');
		}
	};
})();

