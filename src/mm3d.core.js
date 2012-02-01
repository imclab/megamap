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
	this._mapDOM = null;
	this._transform = {
		type  : mm3d.NO_TRANSFORM,
		delta : 0
	};
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

	_mainloop : function (that) {
		return function () {
			requestAnimationFrame(that._mainloop(that));
			that._renderScene();
		}
	},

	_renderScene : function () {
		switch (this._transform.type) {
			case mm3d.NO_TRANSFORM: break;
			case mm3d.ROTATE_X:
			case mm3d.ROTATE_Y:
				this._map3D.rotate(this._transform.type,
								   this._transform.delta);
				break;
			case mm3d.ZOOM_OUT: 
			case mm3d.ZOOM_IN:
				this._map3D.zoom(this._transform.delta);
				break;
			default:
				break;
		}
		this._map3D.render();
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
		/* repaint the scale */						
		this._widgets[mm3d.WIDGET_SCALERULE].max(this._dataModel.max)
			.min(this._dataModel.min)
			.repaint(this._colorModel.minC.getContextStyle(),
					 this._colorModel.maxC.getContextStyle());
		this._vp.appendChild(this._loading.getDOM());

		/* add listeners */
		window.addEventListener('keydown', (function(that) {
		return	function(e) {
			if (e.which === 65 /* a */) {
				that._transform.type =
				that._transform.type === mm3d.NO_TRANSFORM ?
					mm3d.ZOOM_IN : that._transform.type;
				that._transform.delta = .03;
			} else if (e.which === 90 /* z */) {
				that._transform.type =
				that._transform.type === mm3d.NO_TRANSFORM ?
					mm3d.ZOOM_OUT : that._transform.type;
				that._transform.delta = -.03;
			}
		};
		})(this));

		window.addEventListener('keyup', (function(that) {
		return	function(e) {
			that._transform.type = mm3d.NO_TRANSFORM;
		}})(this));

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
				that._mapDOM = that._map3D.getDOM();
				that._mapDOM['className'] = 'mm3dMap';
				that._vp.removeChild(that._loading.getDOM());
				that._vp.appendChild(that._mapDOM);
				that._map3D.repaint();
				that._mainloop(that)();
			}
		}(this)));

		this._map3D.loadMeshes();
	},

	constructor : mm3d.AbstractMap
};


