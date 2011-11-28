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
	this.idx = 0;
	this.x = 0;
	
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

MVDec.prototype = {
	/**
	 * Initializes the mesh objs in the decorator.
	 */
	init : function () {
	this.mesh = new THREE.Mesh(
			new THREE.PlaneGeometry(200, 200), 
			new THREE.MeshBasicMaterial({color: 0xffff00}));
	}
};

