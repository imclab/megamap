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
			this.stage.appendImg(url);
		},
		
		start : function () {
			this.stage.start();
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
		imgList : null,
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
			
			if (this.contObj === undefined) {
				return false;
			}
			this.imgList = new MyImgList();
			/* Sets the gl context */
			this.renderer = new THREE.WebGLRenderer();
			this.renderer.setSize(this.width, this.height);
			this.renderer.setClearColorHex(0x0, 1.0);
			this.contObj.appendChild(this.renderer.domElement);
			
			/* Sets the scene object */
			this.scn = new THREE.Scene();
			this.cam = new THREE.PerspectiveCamera(75, this.width/this.height,1, 10000);
			this.cam.position.z = 800;
			this.scn.add(this.cam);
			
			console.log('fuck');
			this.renderer.render(this.scn, this.cam);
			console.log('fuck');
		},
		/**
		 * Starts the scene logic
		 */
		start : function () {
			this.render();
		},
		/**
		 * Runs rendering procedure.
		 */
		render : function () {
			requestAnimationFrame(this.render);
		
			/* render process */
			this.imgList.show();
			this.renderer.render(this.scn, this.cam);
		},
		/**
		 * Appends the image
		 * @param uri the uri of the image
		 */
		appendImg : function (uri) {
			this.imgList.append(uri);
		}
};


/**
 * The Image list class used in the gallery.
 */
var MyImgList = function() {
	/* the list of images */
	this.imgs = [];
};
MyImgList.prototype = {
	/**
	 * Appends a new uri
	 * @param uri the uri of image
	 */
	append : function (uri) {
		this.imgs.push(new MyImg({'uri':uri}));
	},
	/**
	 * Show images in the container
	 */
	show : function () {
		for (var i=0; i<this.imgs.length; i++) {
			
		}
	},
	/**
	 * To clear all imgs in the list
	 */
	clear : function () {
		
	}
};

/**
 * @constructor
 * The Image class of my gallery.
 * @param args the current arguments
 * 		  currently supported
 */
var MyImg = function (args) {
	for (var i in args) {
		this[i] = args[i];
	}
	/**
	 * Creates the mesh
	 */
	//TODO Change the size and the material of the mesh
	//And it should be seperated from the constructor
	this.mesh = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), 
			new THREE.MeshBasicMaterial({color: 0xffff00}));
    GSys.stage.scn.add(this.mesh);
};
MyImg.prototype = {
		
};