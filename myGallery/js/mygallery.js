/**
 * @author Ye Jiabin
 */

/**
 * @brief predefined constants
 */
var defs = {
	/* default stage width and height */
	SWIDTH : 640,
	SHEIGHT : 480
};

/**
 * @brief The Gallery system, implemented by Singleton.
 */
var GSys = {
		/**
		 * Initializes the gallery system with given parameter
		 * @param args the argument given in JSON format
		 *        current support keys are:
		 *        width : number
		 *        height : number
		 * @return true if initialization succeeds.
		 */
		init: function(args) {
			for(var i in args) {
				this.stage[i] = args[i];
				//TODO it may not safety
			}
			return true;
		},
		/**
		 * Appends images to the stage
		 * @param url
		 */
		appendImg : function(url) {
			
		}
};

/**
 * @brief The Stage of the scene, implemented by Singleton.
 */
GSys.stage = {
		/**
		 * The width and height information
		 */
		width : defs.SWIDTH,
		height : defs.SHEIGHT,
		/**
		 * Starts display Image
		 */
		start : function () {
			
		}
};

/**
 * The Image list class used in the gallery.
 */
var MyImgList = function() {
	
};
MyImgList.prototype = {
	
};

/**
 * The Image class of my gallery.
 */
var MyImg = function (){
		
};
MyImg.prototype = {
		
};