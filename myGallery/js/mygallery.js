/**
 * @author Ye Jiabin
 */

/**
 * @brief predefined constants
 */
var defs = {
	/* default stage width and height */
	SWIDTH  : 640,
	SHEIGHT : 480
};

/**
 * @brief The Gallery system, implemented by Singleton.
 */
var GSys = {
		/**
		 * The list of images
		 */
		imgList : null,
		/**
		 * Initializes the gallery system with given parameter
		 * @param urls imgs url given
		 * @param sargs the argument given in JSON for stage
		 *        current support keys are:
		 *        cont : the canvas container ID
		 *        width : number
		 *        height : number
		 * @return true if initialization succeeds.
		 */
		init: function(urls, sargs) {
			this.imgList = new MyImgList();
			for (var i=0; i<urls.length; i++) {
				this.appendImg(urls[i]);
			}
			for (var i in args) {
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
			if (this.imgList === null) 
				return;
			this.imgList.append(url);
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
		 * The view objects in the stage 
		 */
		views : [], 
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

			/* Initializes the views */
			this.views.push(MainView);
			
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
		
			for (var i=0; i<this.views.length; i++) {
				views[i].run();
			}
			/* render process */
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



