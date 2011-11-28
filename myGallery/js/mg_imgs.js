/**
 * The file mainly process the image-related class
 * @require mygallery.js
 * @author yejiabin
 */


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
		this.length += 1;
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
		
	},
	/**
	 * The length of the list.
	 */
	length : 0
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
	this.idx = 0;
};

MyImg.prototype = {
		
};

/**
 * @constructor
 * The decorator of main view
 * @param im The 'MyImg' instance to be decorated
 */
var MVDec = function (im) {
	this.img = im;
	/* the mesh object */
	this.mesh = null;
	this.onStage = false;
};

/**
 * Static variable of the class.
 */
MvDec = {
	yOffset : 30,
	zOffset : 30
};

MVDec.prototype = {
	/**
	 * Initializes the mesh objs in the decorator.
	 */
	init : function (config) {
	this.mesh = new THREE.Mesh(
			new THREE.PlaneGeometry(400, 300), 
			/* TODO We just use color instead */
			new THREE.MeshBasicMaterial({color: config.color}));
	}
};

