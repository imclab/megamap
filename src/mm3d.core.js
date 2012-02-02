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
mm3d.WIDGET_LEGEND = 4;

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
			new mm3d.WgCamCtrl(),
			new mm3d.WgLegend(this._size)
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

	/**
	 * Registers event listeners for camera control.
	 */
	_initCamCtrl : function () {
		var cam = this._widgets[mm3d.WIDGET_CAMCTRL];
		for (var sign in cam.bts) {
			console.log(cam.bts[sign]);
			cam.bts[sign].get().addEventListener('mousedown', (function(that, _s){
				return function() {
					that._transform.type = parseInt(_s);
					that._transform.delta = .1;
				}
			})(this, sign), false);

			cam.bts[sign].get().addEventListener('mouseup', (function(that){
				return function() {
					that._transform.type = mm3d.NO_TRANSFORM;
				}
			})(this), false);
		};
	},

	_renderScene : function () {
		/* handles transformation of map 3d object */
		switch (this._transform.type) {
			case mm3d.NO_TRANSFORM: 
				break;
			case mm3d.PAN_TOP:
			case mm3d.PAN_LEFT:
			case mm3d.PAN_RIGHT:
			case mm3d.PAN_DOWN:
				this._map3D.pan(this._transform.type,
								this._transform.delta);
				break;
			case mm3d.ROTATE:
				this._map3D.rotate(this._transform.delta);
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
	 * Make current transformation status to no transformation.
	 * @param that the map object.
	 */
	_noTransform : function (that) {
		return function () {
			that._transform.type = mm3d.NO_TRANSFORM;
		}
	},

	_rotationHandler : function (that) {
		var last = {x:0, y:0};
		var ratio = .5;
		return function (e) {
			var cur = {x: e.clientX, y: e.clientY};
				that._transform.delta = {
					y : -(cur.x - last.x) * ratio/that._size[0],
					x : (cur.y - last.y) * ratio/that._size[1]
				};
			last = {x:cur.x, y:cur.y};
		}
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
		/* repaint the legend as well */
		this._vp.appendChild(this._loading.getDOM());
		this._widgets[mm3d.WIDGET_LEGEND].repaint(this._dataModel,
												  this._colorModel);

		/* add listeners */
		window.addEventListener('keydown', (function(that) {
		return	function(e) {
			if (e.which === 65 /* a */) {
				that._transform.type = mm3d.ZOOM_IN ;
				that._transform.delta = .03;
			} else if (e.which === 90 /* z */) {
				that._transform.type = mm3d.ZOOM_OUT ;
				that._transform.delta = -.03;
			}
		};
		})(this), false);

		window.addEventListener('keyup', this._noTransform(this), false);

		this._vp.addEventListener('mousemove', this._rotationHandler(this), false);
		
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
				that._mapDOM.addEventListener('mouseup', that._noTransform(that), false);
				that._mapDOM.addEventListener('mousedown', (function(ythat){
					return function(){ ythat._transform.type = mm3d.ROTATE;  }})(that), false); 
				that._initCamCtrl();
			};
		}(this)));

		this._map3D.loadMeshes();
	},

	constructor : mm3d.AbstractMap
};


