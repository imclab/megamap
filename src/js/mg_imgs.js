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
 * 		 uri : the uri of the image 
 */
var MyImg = function (args) {
	for (var i in args) {
		this[i] = args[i];
	}
	this.loadListeners = [];

	this.img = new Image();
	/**
	 * @private 
	 * Called when the image is loaded.
	 * Calls every onImgLoad function of each objs
	 */
	this.img.onload = (function(self) {
		return function(e) {
			for (var i=0; i<self.loadListeners.length; i++) {
				self.loadListeners[i].onImgLoad();
			}
		};})(this);
	this.img.onerror = (function(self) {
		return function(e) {
			/* TODO on error handler */
			alert('can not load ' + self.img.src);
		};
	})(this);
	this.img.src = this.uri;
};

MyImg.prototype = {
	/**
	 * Add a listener if image loads
	 */
	addLoadListener : function(obj) {
		this.loadListeners.push(obj);
	}
};

/**
 * @constructor
 * The decorator of main view
 * @param im The 'MyImg' instance to be decorated
 */
var MVDec = function (im) {
	this.img = im;
	this.img.addLoadListener(this);
	this.texture = new THREE.Texture(this.img.img, new THREE.UVMapping(), 
									 THREE.ClampToEdgeWrapping, 
									 THREE.ClampToEdgeWrapping, 
									 THREE.NearestFilter, 
									 THREE.LinearMipMapLinearFilter );
	/* the mesh object */
	this._init();
	this.loaded = false;
};

/**
 * Static variable of the class.
 */
MvDec = {
	xOffset : 120,
	yOffset : 100,
	zOffset : 160
};

MVDec.prototype = {
	/**
	 * @private
	 * Initializes the mesh objs in the decorator.
	 */
	_init : function (config) {
		this.mesh = new THREE.Mesh(new THREE.PlaneGeometry(400, 300),
								   new THREE.MeshBasicMaterial(
									   {transparent : true,
									   map : GSys.loadingTex}));
	},

	onImgLoad : function() {
		/*
		this.mesh = new THREE.Mesh(
			new THREE.PlaneGeometry(400, 300), 
			new THREE.MeshBasicMaterial(
				{transparent:true, 
					map: this.texture}));
					*/
		this.texture.needsUpdate = true;
		this.mesh.material.map = this.texture;
		this.mesh.updateMatrix();
		console.log('loaded mesh' + this.mesh);
	}
};

