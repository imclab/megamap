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
