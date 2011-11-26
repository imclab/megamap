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
		 *        cont : the canvas container ID
		 *        width : number
		 *        height : number
		 * @return true if initialization succeeds.
		 */
		init: function(args) {
			for(var i in args) {
				this.stage[i] = args[i];
				//TODO it may not safety
			}
			if (this.stage.cont === null) {
				return false;
			}
			this.stage.init();
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
		 * The list of images
		 */
		imgs : [],
		/**
		 * The container's name of the stage
		 */
		cont : null,
		/**
		 * The container object of the stage
		 */
		contObj : null,
		/**
		 * The scene of my gallery
		 */
		scn : null,
		/**
		 * The GL context.
		 */
		renderer : null,
		/**
		 * The camera
		 */
		cam : null,
		/**
		 * Initializes display Image.
		 * @return true if starts the scene successfully, otherwise false
		 */
		init : function () {
			if (this.cont === null) {
				return false;
			}
			
			this.contObj = document.getElementById(this.cont);
			
			if (contObj === undefined) {
				return false;
			}
			
			/* Sets the scene object */
			this.scn = new THREE.Scene();
		    
			this.cam = new THREE.PerspectiveCamera(75, this.width/this.height,1, 10000);
			this.cam.position.z = 1000;
			this.scn.add(this.cam);
			
			/* Sets the gl context */
			this.renderer = new THREE.CanvasRenderer();
			this.renderer.setSize(this.width, this.height);

			
			contObj.appendChild(this.renderer.domElement);
			
		},
		/**
		 * Starts the scene logic
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