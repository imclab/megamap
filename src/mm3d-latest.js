/**
 * megamap 3d library, visualizes map data in 3d.
 * @author Ye Jiabin
 * @requre three.js
 */

if (!window.requestAnimationFrame) {
	window.requestAnimationFrame = (function(){
		return window.requestAnimationFrame       || 
			window.webkitRequestAnimationFrame || 
			window.mozRequestAnimationFrame    || 
			window.oRequestAnimationFrame      || 
			window.msRequestAnimationFrame     || 
			function(/* function */ callback){
				window.setTimeout(callback, 1000 / 60);
			};
	})();
}

/**
 * The global namespace of megamap library.
 */
var mm3d = {};

mm3d.EPSILON = .0001;
mm3d.baseHeight = .5;
mm3d.LINEAR_GRADIENT = 0;

mm3d.PAN_TOP = 4;
mm3d.PAN_LEFT = 1;
mm3d.PAN_RIGHT = 2;
mm3d.PAN_DOWN = 3;

mm3d.ANI_SCALE_BAR = 0;

mm3d.sortData = function(a, b) {
	return - a.data + b.data;
};

mm3d.mouseState = { down : false,
	keyDown : false,
	zoomIn : true,
	pan : 0,
	last : {x : 0, y : 0}, 
	cur : {x : 0, y : 0} 
};

/**
 * @constructor
 * Initalize chinese map object.
 * @param cont {Object} the DOM container that displays map
 * @param config {JSON} the config JSON of the map.
 *        currently supported config:
 *        size : {Array} the size of map 
 *        data : {Json/Array} the data containing map information
 *        dataUrl : {String} the data url for fetching the data via ajax
 *        showLegend : {Boolean} shows the legend of the map chart
 */
mm3d.ChineseMap = function (cont, dataModel, config) {
	if (typeof cont !== 'object') {
		throw { message : 'Cannot intialize with null container.'};
	} else {
		/**
		 * The viewport container.
		 */
		this._vp = cont;
	}

	/**
	 * Default values.
	 */
	this._option = {size       : [window.innerWidth, window.innerHeight],
			colorModel : { type : mm3d.LINEAR_GRADIENT, 
			start : new THREE.Color(0xffff00),
			end : new THREE.Color(0xff0000), stops : []},
					showLegend : true};

	this.title = "";
	this.minVal = this.maxVal = 0;
	this._modelChanged = false;
	
	/**
	 * The data containing map information.
	 */
	this._data = {};

	this._data['model'] = {
		 'Zhejiang'     : { data : 0, last : 0 } ,
		 'Jiangsu'      : { data : 0, last : 0 } ,
		 'Shandong'     : { data : 0, last : 0 } ,
		 'Anhui'        : { data : 0, last : 0 } ,
		 'Shanghai'     : { data : 0, last : 0 } ,
		 'Hebei'        : { data : 0, last : 0 } ,
		 'Jiangxi'      : { data : 0, last : 0 } ,
		 'Henan'        : { data : 0, last : 0 } ,
		 'Hainan'       : { data : 0, last : 0 } ,
		 'Taiwan'       : { data : 0, last : 0 } ,
		 'Hunan'        : { data : 0, last : 0 } ,
		 'Sichuan'      : { data : 0, last : 0 } ,
		 'Yunnan'       : { data : 0, last : 0 } ,
		 'Gansu'        : { data : 0, last : 0 } ,
		 'Xizang'       : { data : 0, last : 0 } ,
		 'Liaoning'     : { data : 0, last : 0 } ,
		 'Jilin'        : { data : 0, last : 0 } ,
		 'Heilongjiang' : { data : 0, last : 0 } ,
		 'Hubei'        : { data : 0, last : 0 } ,
		 'Shaanxi'      : { data : 0, last : 0 } ,
		 'Neimenggu'    : { data : 0, last : 0 } ,
		 'Guangxi'      : { data : 0, last : 0 } ,
		 'Qinghai'      : { data : 0, last : 0 } ,
		 'Ningxia'      : { data : 0, last : 0 } ,
		 'Xinjiang'     : { data : 0, last : 0 } ,
		 'Chongqing'    : { data : 0, last : 0 } ,
		 'Shanxi'       : { data : 0, last : 0 } ,
		 'Tianjing'     : { data : 0, last : 0 } ,
		 'Beijing'      : { data : 0, last : 0 } ,
		 'Guangdong'    : { data : 0, last : 0 } ,
		 'Guizhou'      : { data : 0, last : 0 } ,
		 'Hongkong'     : { data : 0, last : 0 } ,
		 'Macau'        : { data : 0, last : 0 } ,
		 'Fujian'       : { data : 0, last : 0 } 
 	} ;

	this._data['length'] = (function (obj) {
		var i=0;
		for (var item in obj) { i++ ;}
		return function () { 
			return i; 
		};
	})(this._data['model']);


	/**
	 * Parse the config object.
	 */
	if (typeof config === 'object') {
		this._option['size'] = 
			config['size'] instanceof Array ? config['size'] : this._option['size'];	
		this._option['showLegend'] = 
			typeof config['showLegend'] === 'boolean' ? config['showLegend'] : this._option['showLegend'];	
		this._option['colorModel'] = 
			typeof config['colorModel'] === 'object' ? config['colorModel'] : this._option['colorModel'];	
		this.title = typeof config['title'] === 'string' ? config['title'] : this.title;
		this._aniStatus.isRun = typeof config['animate'] === 'boolean' ? config['animate'] : false;
		if (this._aniStatus.isRun) {
			this._aniStatus.maxStep = typeof config['animateStep'] === 'number' ? config['animateStep'] : 100;
		} else {
			this._aniStatus.maxStep = this._aniStatus.step = 100;
		}
	}

	if (dataModel !== undefined) {
		this._changeData(dataModel);	
	}

	this._calMax();

	/* the position that camera look at */
	this._lookAtPos = {x:0, y:0, z:0};

};

mm3d.ChineseMap.prototype = {

	/**
	 * Registered listeners.
	 */
	_listeners : {
		'load' : []
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

	_loadComplete : false,

	/**
	 * Some utility methods.
	 */
	_calMax : function () {
		this.maxVal = 0;
		for (var item in this._data['model']) {
			this.maxVal = this._data['model'][item]['data'] > this.maxVal 
			? this._data['model'][item]['data'] : this.maxVal;
		}

		this._maxbarHeight = this.maxVal > 39.125 ? 39.125 : this.maxVal;

		if (this.maxVal === 0) {
			this._maxbarHeight = this.maxVal = 1;
		}
	},
	/**
	 * @private
	 * Calculate the color should be shown.
	 * @param val {Number} the value of a data
	 * @return the color to be shwon
	 */
	_calColor : function (val) {
		var ratio = val/this._maxbarHeight;
		var st = this._option['colorModel'].start;
		var ed = this._option['colorModel'].end;
		var returnColor = new THREE.Color(0x0);
		returnColor.setRGB(ratio * (ed.r - st.r) + st.r ,
			ratio * (ed.g - st.g) + st.g,
			ratio * (ed.b - st.b) + st.b);
		return returnColor;
	},

	/**
	 * @private
	 * Initalize loading panel.
	 */
	_initLoading : function () {
		this._loadingNode = document.createElement('div');
		this._loadingNode['id'] = 'mm3dLoading';
		this._loadingNode['style']['width'] = this._option['size'][0] + 'px';
		this._loadingNode['style']['height'] = this._option['size'][1] + 'px';

		var loadingTitle = document.createElement('div');
		loadingTitle['className'] = 'mm3dLoadingTitle';
		loadingTitle.innerHTML = 'LOADING ...';

		var loadingContent = document.createElement('div');
		loadingContent['className'] = 'mm3dLoadingContent';

		this._loadingNode['changeContent'] = (function(node) {
			return function (txt) {
				loadingContent.innerHTML = txt;
			};
		})(loadingContent);

		this._loadingNode.appendChild(loadingTitle);
		this._loadingNode.appendChild(loadingContent);

		this._vp.appendChild(this._loadingNode);

		/* relocates the loading container */
		loadingTitle['style']['top'] = 
			(this._option['size'][1] - 
				parseInt(loadingTitle.clientHeight))*.5 + 'px';
		
		loadingContent['style']['top'] = 
			(this._option['size'][1] + 
				parseInt(loadingTitle.clientHeight))*.5 + 'px';
	},

	/**
	 * @private
	 * Initialize the camera control ui.
	 */
	_initCamCtrl : function () {
		this._camNode = document.createElement('div');
		this._camNode['id'] = 'mm3dCamContainer';

		/* the buttons for panning view point */
		var buttonRadius = 18;
		var sqrt2 = Math.sqrt(2);
		var panButtonsCfg = [
			{pos : [2*sqrt2-1, sqrt2-1], sign : mm3d.PAN_TOP},
			{pos : [sqrt2-1, 2*sqrt2-1], sign : mm3d.PAN_LEFT},
			{pos : [3*sqrt2-1, 2*sqrt2-1], sign : mm3d.PAN_RIGHT},
			{pos : [2*sqrt2-1, 3*sqrt2-1], sign : mm3d.PAN_DOWN}
		];

		for (var i=0; i<panButtonsCfg.length; i++) {
			var panButton = document.createElement('div');
			panButton['className'] = 'mm3dCamButton';
			panButton['style']['left'] = buttonRadius*panButtonsCfg[i]['pos'][0] + 'px';
			panButton['style']['top'] = buttonRadius*panButtonsCfg[i]['pos'][1] + 'px';
			panButton.addEventListener('mousedown', (function(s) {
				return function () {
					mm3d.mouseState['pan'] = s;
					mm3d.mouseState['down'] = true;
					
				};
			})(panButtonsCfg[i]['sign']), false);
			panButton.addEventListener('mouseup', function(s) {
				mm3d.mouseState['down'] = false;
			}, false);

			this._camNode.appendChild(panButton);
		}

		this._vp.appendChild(this._camNode);
	},

	_repaintLegend : function () {
		/* remove all its children */
		for ( ; this._legendContext.childNodes.length > 0; ) {
			this._legendContext.removeChild(this._legendContext.firstChild);
		}
		for (var item in this._data['model']) {
			var legendItem = document.createElement('div');
			legendItem['className'] = 'mm3dLegendItem';
			var legendColor = document.createElement('span');
			legendColor['className'] = 'mm3dLegendColor';
			legendColor['style']['backgroundColor'] = 
				this._calColor(this._data['model'][item]['data']*this._maxbarHeight/this.maxVal).getContextStyle();
			var legendName = document.createElement('span');
			legendName['className'] = 'mm3dLegendName';
			legendName.innerHTML = item;

			var legendValue = document.createElement('span');
			legendValue['className'] = 'mm3dLegendValue';
			/* TODO display name attribute should be appended */
			legendValue.innerHTML = this._data['model'][item]['data'];

			legendItem.appendChild(legendColor);
			legendItem.appendChild(legendName);
			legendItem.appendChild(legendValue);
			this._legendContext.appendChild(legendItem);
		}
	},

	/**
	 * @private
	 * Initialize the legend bar.
	 */
	_initLegend : function () {
		var legendContainer = document.createElement('div');
		legendContainer['id'] = 'mm3dLegendContainer';

		var legendToolbar = document.createElement('div');
		legendToolbar['className'] = 'mm3dLegendToolbar'; 

		var legendNode = document.createElement('div');
		legendNode['id'] = 'mm3dLegend';
		legendNode['style']['height'] = 
			parseInt(this._option['size'][1]/3/30)*30 + 'px';
		this._legendContext = document.createElement('div');
		this._legendContext['id'] = 'mm3dLegendCtx';

		this._repaintLegend();

		legendNode.appendChild(this._legendContext);
		legendContainer.appendChild(legendNode);
		this._vp.appendChild(legendContainer);
		
	},

	/**
	 * @private 
	 * Makes a title for the map
	 */
	_mkTitle : function () {
		if (this._titleNode === undefined) {
			this._titleNode = document.createElement('div');
			this._titleNode['id'] = 'mm3dTitle';
			this._titleNode.innerHTML = this.title;
			this._vp.appendChild(this._titleNode);
		} else {
			this._titleNode.innerHTML = this.title;
		}
	},

	_aniStatus : {
		isRun : false,
		step : 0,
		maxStep : 100,
		type : 0
	},

	/**
	 * @public 
	 * Sets the title for the map and changes the display.
	 * @param t {String} the title to be set
	 */
	setTitle : function (t) {
		this.title = t;
		this._mkTitle();
	},

	/**
	 * @public
	 * Initalizes the ui widget and scene,
	 * meanwhile loads the model.
	 */
	init   : function () {
		/**
		 * Initializes the ui widgets.
		 */
		var divNode = document.createElement('div');
		var spanNode = document.createElement('span');
		
		var applyConfig = function(node, val) {
			for (attr in val) {
				node[attr] = val[attr];
			}
		};

		/**
		 * Adds event listener for DOM.
		 */
		this._vp.addEventListener('mousedown', function(e) {
			mm3d.mouseState.down = true;
		}, false);
		this._vp.addEventListener('mouseup', function(e) {
			mm3d.mouseState.down = false;
			mm3d.mouseState.pan = 0;
		}, false);
		this._vp.addEventListener('mousemove', function(e) {
			mm3d.mouseState.last = mm3d.mouseState.cur;
			mm3d.mouseState.cur  = { x : e.clientX, y : e.clientY };
			//console.log(mm3d.mouseState);
		}, false);
		window.addEventListener('keydown', function(e) {
			switch (e.which) {
				case 65: /* 'A' */
					mm3d.mouseState.keyDown = true;
					mm3d.mouseState.zoomIn = true;
					break;
				case 90: /* 'Z' */
					mm3d.mouseState.keyDown = true;
					mm3d.mouseState.zoomIn = false;
					break;
				default:
					break;
			}
		}, false);
		window.addEventListener('keyup', function(e) {
			mm3d.mouseState.keyDown = false;
		}, false);

		/**
		 * The toolBox at the right-top corner.
		 */
		var toolBox = divNode.cloneNode(true);
		applyConfig(toolBox, {id: 'mm3dToolBox', className : 'mm3dToolBox'});

		var optMenu = spanNode.cloneNode(true);
		applyConfig(optMenu, {id: 'mm3dOption', innerHTML : 'option', className : 'mm3dMenuItem'});
		optMenu.addEventListener('click', function(e) {
			//TODO to show option menu
			alert('option');
		}, false);

		var hlpMenu = spanNode.cloneNode(true);
		applyConfig(hlpMenu, {id: 'mm3dHelp', innerHTML : 'help', className : 'mm3dMenuItem'});
		hlpMenu.addEventListener('click', function(e) {
			//TODO to show option menu
			alert('help');
		}, false);

		var expMenu = spanNode.cloneNode(true);
		applyConfig(expMenu, {id: 'mm3dExport', innerHTML : 'export', className : 'mm3dMenuItem'});
		expMenu.addEventListener('click', function(e) {
			//TODO to show option menu
			alert('export');
		}, false);

		toolBox.appendChild(expMenu);
		toolBox.appendChild(optMenu);
		toolBox.appendChild(hlpMenu);
		this._vp.appendChild(toolBox);

		/**
		 * The scale rule at the right-bottom corner.
		 */
		var scaleRuleContainer = divNode.cloneNode(true);
		applyConfig(scaleRuleContainer, {id: 'mm3dScaleRuleCont'}); 
		this._scaleRule = scaleRuleContainer;

		var scaleRule = divNode.cloneNode(true);
		var scaleRuleWidth = this._option['size'][0]/3.9;
		var scaleRuleHeight = this._option['size'][1]/18;
		applyConfig(scaleRule, {id : 'mm3dScaleRule'});
		scaleRule['style'] = scaleRule['style'] === undefined ? {} : scaleRule['style'];
		applyConfig(scaleRule['style'], {width : scaleRuleWidth + 'px', height : scaleRuleHeight + 'px'});

		/* scale rule context */
		var srCav = document.createElement('canvas');
		srCav.width = scaleRuleWidth;
		srCav.height = scaleRuleHeight;
		scaleRule.appendChild(srCav);

		this._minTag = spanNode.cloneNode(true);
		this._minTag.innerHTML = this.minVal;
		applyConfig(this._minTag, {id : 'mm3dMinTag', className : 'mm3dScaleTag'});
		this._maxTag = spanNode.cloneNode(true);
		this._maxTag.innerHTML = this.maxVal;
		applyConfig(this._maxTag, {id : 'mm3dMaxTag', className : 'mm3dScaleTag'});

		scaleRuleContainer.appendChild(this._minTag);
		scaleRuleContainer.appendChild(this._maxTag);
		scaleRuleContainer.appendChild(scaleRule);
		this._vp.appendChild(scaleRuleContainer);

		/* TODO add more color models here */
		var srCtx = srCav.getContext('2d');
		var gbar = srCtx.createLinearGradient(0, 0, scaleRuleWidth, scaleRuleHeight);
		gbar.addColorStop(0, this._option['colorModel']['start'].getContextStyle());
		gbar.addColorStop(1, this._option['colorModel']['end'].getContextStyle());
		srCtx.fillStyle = gbar;
		srCtx.fillRect(0, 0, scaleRuleWidth, scaleRuleHeight);

		this._initLoading();
		this._initLegend();
		this._initCamCtrl();
		this._mkTitle();

		/**
		 * Intializes the map scene.
		 */
		this._three = {
			scene    : new THREE.Scene(),
			renderer : new THREE.WebGLRenderer({clearColor : 0x0, clearAlpha : 1}),
			camera   : new THREE.PerspectiveCamera(75, 
				this._option['size'][0]/this._option['size'][1],
				1, 10000),
			loader   : new THREE.JSONLoader(true),
			light    : new THREE.PointLight(0xffffff)
		};
		
		/* Adjusts camera */
		this._three.camera.position.set(0, 5, 0);
		this._three.camera.up = {x:0, y:0, z:-1};
		this._three.camera.lookAt(this._lookAtPos);
		this._three.scene.add(this._three.camera);
		/* Adjusts light */
		this._three.light.position.set(0, 5, 0);
		this._three.scene.add(this._three.light);

		/* Adjusts scene */
		this._three.renderer.setSize(this._option['size'][0],
			this._option['size'][1]);
		this._three.scene.add(this._three.camera);

		/**
		 * Loads all meshes.
		 */
		this._loadedMesh = [];

		/**
		 * Rendering scene procedure.
		 */
		this._renderScene = function () {
			if (this._aniStatus.isRun) {
				var st = this._aniStatus;
				this._aniStatus.step += 1;
				if (st.step >= st.maxStep) {
					st.step = 0;
					this._aniStatus.isRun = false;
				} else {
					this._animator();
				}
			} 
			if (this._modelChanged) {
				//TODO changed the model
				this._repaintModel();
				this._maxTag.innerHTML = this.maxVal;
			} 

			/* rotate mouse */
			if (mm3d.mouseState.down ) {
				if (mm3d.mouseState['pan'] !== 0) {
					/* pan the camera */
					var delta = .05;
					switch (mm3d.mouseState['pan']) {
					case mm3d.PAN_TOP:
						this._three.camera.position.z -= delta;
						this._lookAtPos.z -= delta;
						break;
					case mm3d.PAN_DOWN:
						this._three.camera.position.z += delta;
						this._lookAtPos.z += delta;
						break;
					case mm3d.PAN_RIGHT:
						this._three.camera.position.x += delta;
						this._lookAtPos.x += delta;
						break;
					case mm3d.PAN_LEFT:
						this._three.camera.position.x -= delta;
						this._lookAtPos.x -= delta;
						break;
					default:
						break;
					}
					this._three.camera.lookAt(this._lookAtPos);
				} else {
					var cX = mm3d.mouseState.cur.x, 
						cY = mm3d.mouseState.cur.y;
					var lX = mm3d.mouseState.last.x, 
						lY = mm3d.mouseState.last.y;
					var yDiff = cY - lY, xDiff =  -cX + lX;

					if (Math.abs(yDiff)> mm3d.EPSILON 
							|| Math.abs(xDiff) > mm3d.EPSILON) {
						var thetaY = yDiff * .5 * Math.PI/ this._option.size[1];	
						var thetaX = xDiff * .5 * Math.PI/ this._option.size[0];	

						for (item in this._data['model']) {
							this._data['model'][item]['mesh'].rotation.x += thetaY;
							this._data['model'][item]['mesh'].rotation.z += thetaX;
						}
					}
				}
			} else if (mm3d.mouseState.keyDown) {
				console.log('asfd');
				var camPos = this._three['camera'].position;
				var diffVec = {x: this._lookAtPos.x - camPos.x,
					y: this._lookAtPos.y - camPos.y,
					z: this._lookAtPos.z - camPos.z};
				var zoomStep = .005;
				if (mm3d.mouseState.zoomIn) {
					camPos.x += diffVec.x*zoomStep;
					camPos.y += diffVec.y*zoomStep;
					camPos.z += diffVec.z*zoomStep;
					this._lookAtPos.x += diffVec.x*zoomStep;
					this._lookAtPos.y += diffVec.y*zoomStep;
					this._lookAtPos.z += diffVec.z*zoomStep;
				} else {
					camPos.x -= diffVec.x*zoomStep;
					camPos.y -= diffVec.y*zoomStep;
					camPos.z -= diffVec.z*zoomStep;
					this._lookAtPos.x -= diffVec.x*zoomStep;
					this._lookAtPos.y -= diffVec.y*zoomStep;
					this._lookAtPos.z -= diffVec.z*zoomStep;
				}
				this._three['camera'].position = camPos;
				this._three['camera'].lookAt(this._lookAtPos);
			}

			this._three.renderer.render(this._three.scene,
				this._three.camera);
		};

		this._mainloop = function(that) {
				return function() {
					requestAnimationFrame(that._mainloop(that));
					that._renderScene();
				}
		};

		/** 
		 * as the length function calculates each time,
		 * so declares a variable in advance.
		 */
		var dataLength = this._data.length();
		for (var item in this._data['model']) {//var i=0; i<this._data.length; i++) {
			(function(that, i, len) {
				that._three.loader.load({model : 'js/map'+ i +'.js',
				callback : function(geo) { 
						that._loadedMesh.push(i);
						var barHeight = that._data['model'][i]['data']/that.maxVal*that._maxbarHeight;
						that._data['model'][i]['mesh'] = new THREE.Mesh(geo, new THREE.MeshLambertMaterial({color : that._calColor(barHeight).getHex(), transparent : true}));
						that._three.scene.add(that._data['model'][i]['mesh']);

						/* set data */
						//that._data['model'][i]['mesh'].scale.y = (1+barHeight);
						
						that._loadingNode.changeContent('Mesh ' + i + ' loaded. '
							+ (that._loadedMesh.length/len)*100 + '%'); 

						if (that._loadedMesh.length >= len) {
							console.log("loads complete.");
							that._loadComplete = true;
							/* trigger all listeners */
							for (var j=0; j<that._listeners['load'].length; j++) {
								that._listeners['load'][j].call();
							}
							that._vp.removeChild(that._loadingNode);
							/* begin to render scene */
							if(!that._aniStatus.isRun) {
								that._animator();
							}
							that._mainloop(that)();
						}
					} 
				});

			})(this, item, dataLength);
		}

		/**
		 * Appends the scene object at last.
		 */
		this._three.renderer.domElement['id'] = 'mm3dViewport';
		this._vp.appendChild(this._three.renderer.domElement);
	},

	/**
	 * @private
	 * The method is invoked when data model is changed.
	 */
	_repaintModel : function () {
		for (var item in this._data['model']) {
			var mesh = this._data['model'][item]['mesh'];
			var newScale = this._data['model'][item]['data']/this.maxVal*this._maxbarHeight;
			//mesh.scale.y = 1 + newScale;
			mesh.material = new THREE.MeshLambertMaterial({
					color : this._calColor(newScale).getHex(),
					transparent : true
			});
		}
		this._modelChanged = false;
	},

	
	_animator : /* scales the mesh */ function() {
		if (this._loadComplete) {
			for (var item in this._data['model']) {
				var obj = this._data['model'][item];
				var newScale = obj['data'];
				var lastScale = obj['last'];
				obj['mesh'].scale.y = 1+(lastScale+(newScale-lastScale)*this._aniStatus.step/this._aniStatus.maxStep)/this.maxVal*this._maxbarHeight;
			}
		}
	},

	change : function (config) {

	},

	_changeData : function (model) {
		for (var item in model) {
			this._data['model'][item]['last']
				= this._data['model'][item]['data'];
			for (var attr in model[item]) {
				this._data['model'][item][attr] = model[item][attr];
			}
		}
		/* recalculates the max values */
		this._calMax();
		this._modelChanged = true;
	},

	/**
	 * Changes the data models to repaint the map.
	 * @param model {JSON} the data model to be chaged.
	 * @param animateStep {JSON} animation configuration.
	 */
	changeData : function (model, animationCfg) {
		this._changeData(model);
		if (animationCfg === undefined) {
			this._aniStatus.maxStep = this._aniStatus.step = 100;
			this._animator();
		} else {
			this._aniStatus.step = 0;
			this._aniStatus.isRun = true;
			this._aniStatus.maxStep = animationCfg['step'] === undefined ?
				100 : animationCfg['step'];
			this._animator();
		}
	},

	/**
	 * Changes the scale of bar.
	 * @param maxHeight {Number} the maximum height 
	 * 					of the bar rendered in the scene.
	 * @param animate {Boolean} true if has animate effect
	 * @param step {Number} total animate steps, one frame per step
	 * 			   Default value is 100.
	 * @return true if the scale is successfully changed otherwise
	 *         false if previous animation does not stop.
	 */
	changeScale : function (maxHeight, animate, step) {
		this._maxbarHeight = maxHeight;
		if (!this._loadComplete) {
			return false;
		}
		if (!this._aniStatus.isRun) {
			if (animate === undefined || animate === false) {
				this._aniStatus.step = this._aniStatus.maxStep = 100;
				this._animator();
			} else {
				this._aniStatus.isRun = true;
				this._aniStatus.step = 0;
				this._aniStatus.maxStep = typeof step === 'number' ? step : 100;
				this._animator();
			}
			return true;
		}
		return false;
	}
};

