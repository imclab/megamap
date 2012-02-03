/**
 * The base map class for megamap library .
 * @author Ye Jiabin <alpha360x@gmail.com>
 * @requires Three.js
 */

mm3d.Map3D = function(dataModel, colorModel, config) {
	this._dataModel = dataModel;
	this._colorModel = colorModel;
	this._maxBarHeight = 50;

	if (config !== undefined) {
		this._size = config['size'] === undefined ? 
		[window.innerWidth, window.innerHeight] : config['size'];
		this._urlPrefix = typeof config['urlPrefix'] === 'string' ?
		config['urlPrefix'] : 'map';
		if (config['maxBarHeight'] !== undefined) {
			this._maxBarHeight = config['maxBarHeight'];
		}
	} else {
		this._size = [window.innerWidth, window.innerHeight];
		this._urlPrefix = 'map';
	}

	this._scene =  new THREE.Scene();
	this._renderer = new THREE.WebGLRenderer({clearColor : 0x0, clearAlpha : 1});
	this._camera = new THREE.PerspectiveCamera(75, 
				this._size[0]/this._size[1],
				1, 10000);
	this._loader = new THREE.JSONLoader(true);
	this._light = new THREE.PointLight(0xffffff);
	this._lookAt = {x:0, y:0, z:0};

	/* Initialize the basic scene */
	/* Adjusts camera */
	this._camera.position.set(0, 5, 0);
	this._camera.up = {x:0, y:0, z:-1};
	this._camera.lookAt(this._lookAt);
	this._scene.add(this._camera);
	/* Adjusts light */
	this._light.position.set(0, 5, 0);
	this._scene.add(this._light);

	/* Adjusts scene */
	this._renderer.setSize(this._size[0], this._size[1]);
}

mm3d.Map3D.prototype = {
	constructor : mm3d.Map3D,

	_listener : {
		'loadStatus' : [],
		'load' : []
	},

	addEventListener : function(type, callback) {
		this._listener[type].push(callback);
	},

	/**
	 * Returns the DOM Element for the canvas.
	 * @return the DOM Element for the canvas.
	 */
	getDOM : function () {
		return this._renderer.domElement;
	},

	/**
	 * Calls for animation.
	 * @param cur the current step of animation
	 * @param _max total steps of the animation
	 * @return false if the animation do not complete,
	 *         otherwise true
	 */
	aniScale : function(cur, _max) {
		var ratio = cur/_max;
		var max = this._dataModel.max, min = this._dataModel.min;
		for (var item in this._dataModel.model) {
			var ele = this._dataModel.model[item];
			var newScale = 1 + this._maxBarHeight*ratio*
				ele['data']/(max - min);
			var diff = newScale - ele['last'];
			ele['mesh'].scale.y = ele['last'] + diff*ratio;
		}
		if (cur >= _max) {
			for (var item in this._dataModel.model) {
				this._dataModel.model[item]['last'] = 
					1 + this._maxBarHeight*
				this._dataModel.model[item]['data']/(max - min);
			}
			return true;
		} else {
			return false;
		}
	},

	repaint : function (scale, color) {
		/* repaint scale ? */
		var _s = scale === undefined ? true : scale;
		/* repaint color ? */
		var _c = color === undefined ? true : color;
		var max = this._dataModel.max, min = this._dataModel.min;
		if (max - min === 0) { _s = false; }

		for (var item in this._dataModel.model) {
			if (_c) {
				this._dataModel.model[item]['mesh'].material
			 		= new THREE.MeshLambertMaterial({
				 		color : this._colorModel.getColor(item).getHex(),
				 		transparent : true});
			}
			if (_s) { 
				var newScale = 1 + this._maxBarHeight*
						this._dataModel.model[item]['data']/(max - min);
				this._dataModel.model[item]['mesh'].scale.y = newScale;
				this._dataModel.model[item]['last'] = newScale;
			}
		}
	},

	loadMeshes : function () {
		var loadedCount = 0;
		for (var ele in this._dataModel.model) {
			(function (item, that) {
			that._loader.load({ model : that._urlPrefix + item + '.js',
				callback : function(geo) {
					loadedCount += 1;
					that._dataModel.model[item]['mesh'] = 
						new THREE.Mesh(geo, 
new THREE.MeshLambertMaterial({color : 0xff0000}));

					that._scene.add(that._dataModel.model[item]['mesh']);
					for (var i=0; i<that._listener['loadStatus'].length;
						 i++) {
					that._listener['loadStatus'][i].call(that, 
							{name : item, count : loadedCount});
					}
					if (loadedCount >= that._dataModel.length) {
						for ( var i=0; 
							 i<that._listener['load'].length; i++) { 
						that._listener['load'][i].call(that);
						}
					}
				}});
			})(ele, this);
		}
	}, 

	pan: function (type, delta) {
		if (typeof delta !== 'number') {
			return;
		}
		switch (type) {
		case mm3d.PAN_TOP:
			this._camera.position.z -= delta;
			this._lookAt.z -= delta;
			break;
		case mm3d.PAN_DOWN:
			this._camera.position.z += delta;
			this._lookAt.z += delta;
			break;
		case mm3d.PAN_RIGHT:
			this._camera.position.x += delta;
			this._lookAt.x += delta;
			break;
		case mm3d.PAN_LEFT:
			this._camera.position.x -= delta;
			this._lookAt.x -= delta;
			break;
		default:
			break;
		}
		this._camera.lookAt(this._lookAt);
	},

	zoom : function (step) {
		if (typeof step !== 'number') {
			return ;
		}
		var camPos = this._camera.position;
		var diffVec = {x: this._lookAt.x - camPos.x,
			y: this._lookAt.y - camPos.y,
			z: this._lookAt.z - camPos.z};
		camPos.x += diffVec.x*step;
		camPos.y += diffVec.y*step;
		camPos.z += diffVec.z*step;
		this._lookAt.x += diffVec.x*step;
		this._lookAt.y += diffVec.y*step;
		this._lookAt.z += diffVec.z*step;
		this._camera.position = camPos;
		this._camera.lookAt = this._lookAt;
	},

	rotate : function (delta) {
		for (var item in this._dataModel['model']) {
			this._dataModel.model[item]['mesh'].rotation.x += delta.x;
			this._dataModel.model[item]['mesh'].rotation.z += delta.y;
		}
	},

	render : function () {
		this._renderer.render(this._scene, this._camera);
	}
};

