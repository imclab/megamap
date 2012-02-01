/**
 * The core class for megamap library.
 * @author Ye Jiabin <alpha360x@gmail.com>
 * @requires Three.js 
 * @requires mm3d.util.js
 * @requires mm3d.color.js
 * @requires mm3d.map.js
 */


mm3d.WIDGET_SCALERULE = 0;
mm3d.WIDGET_TOOLBOX = 1;
mm3d.WIDGET_TITLE = 2;
mm3d.WIDGET_CAMCTRL = 3;

mm3d.AbstractMap = function(cont, data, config) {
	this._map3D = null;
};

mm3d.AbstractMap.prototype = {
	_initConfig : function (config) {
		/* default values */
		this._colorModel = new mm3d.ColorLG(this._dataModel,
					new THREE.Color(0xffff00), new THREE.Color(0xff0000));
		this._size = [window.innerWidth, window.innerHeight];
		this._title = '';
		if (config !== undefined) {
			if (config['colorModel'] !== undefined) {
			this._colorModel = new mm3d.ColorLG(this._dataModel,
					config['colorModel']['min'], 
					config['colorModel']['max']);
			} 
			if (config['size'] !== undefined) {
				this._size = config['size'];
			}
			if (config['title'] !== undefined) {
				this._title = config['title'];
			}
		}

		this._widgets = [
			new mm3d.WgScalerule([this._size[0]/3.9, 
							this._size[1]/18]),
			new mm3d.WgToolbox(),
			new mm3d.WgTitle(this._title),
			new mm3d.WgCamCtrl()
		];

		this._loading = new mm3d.WgLoading(this._size);

	},

	_listener : {
		'load' : []
	},

	_mainloop : function () {
	},

	/**
	 * Adds event listener to call back procedures.
	 * @param type {String} the type of the event
	 * @param callback {Function} the callback function when
	 * 		  event is triggered.
	 */
	addEventListener : function (type, callback) {
		this._listeners[type].push(callback);
	},

	init : function () {
		/* intialize widgets */
		for (var i=0; i<this._widgets.length; i++) {
			this._vp.appendChild(this._widgets[i].getDOM());
		}
		this._vp.appendChild(this._loading.getDOM());

		/* intialize map3D */
		this._map3D = new mm3d.Map3D(this._dataModel,
					this._colorModel, 
					{size : this._size, urlPrefix : this._urlPrefix });

		/* updates loading bar */
		this._map3D.addEventListener('loadStatus', (function(that){
			return function(e) {
			that._loading.content
			(parseInt(e.count/that._dataModel.length*100) + '% loaded');
			}
		})(this));
		this._map3D.addEventListener('load', (function(that){
			return function(e) {
				that._vp.removeChild(that._loading.getDOM());
				that._vp.appendChild(that._map3D.getDOM());
				that._map3D.repaint();
				that._map3D.render();
			}
		}(this)));

		this._map3D.loadMeshes();
	},

	constructor : mm3d.AbstractMap
};


