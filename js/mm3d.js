/**
 * my map 3d library, visiualizes map data in 3d.
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
 * The global namespace of my map library.
 */
var mm3d = {};

mm3d.EPSILON = .0001;
mm3d.baseHeight = .5;
mm3d.LINEAR_GRADIENT = 0;

mm3d.mouseState = { down : false,
	last : {x : 0, y : 0}, 
	cur : {x : 0, y : 0} };

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
mm3d.ChineseMap = function (cont, config) {
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
	this.modelChanged = false;
	
	/**
	 * The data containing map information.
	 */
	this._data = [
		{ name : 'Zhejiang'     , data : 54426891  } ,
		{ name : 'Jiangsu'      , data : 78659903  } ,
		{ name : 'Shandong'     , data : 95793065  } ,
		{ name : 'Anhui'        , data : 59500510  } ,
		{ name : 'Shanghai'     , data : 23019148  } ,
		{ name : 'Hebei'        , data : 71854202  } ,
		{ name : 'Jiangxi'      , data : 44567475  } ,
		{ name : 'Henan'        , data : 94023567  } ,
		{ name : 'Hainan'       , data : 8671518   } ,
		{ name : 'Taiwan'       , data : 23224912  } ,
		{ name : 'Hunan'        , data : 65683722  } ,
		{ name : 'Sichuan'      , data : 80418200  } ,
		{ name : 'Yunnan'       , data : 45966239  } ,
		{ name : 'Gansu'        , data : 25575254  } ,
		{ name : 'Xizang'       , data : 3002166   } ,
		{ name : 'Liaoning'     , data : 43746323  } ,
		{ name : 'Jilin'        , data : 27462297  } ,
		{ name : 'Heilongjiang' , data : 38312224  } ,
		{ name : 'Hubei'        , data : 57237740  } ,
		{ name : 'Shan3xi'      , data : 37327378  } ,
		{ name : 'Neimenggu'    , data : 24706321  } ,
		{ name : 'Guangxi'      , data : 46026629  } ,
		{ name : 'Qinghai'      , data : 5626722   } ,
		{ name : 'Ningxia'      , data : 6301350   } ,
		{ name : 'Xinjiang'     , data : 21813334  } ,
		{ name : 'Chongqing'    , data : 28846170  } ,
		{ name : 'Shanxi'       , data : 35712111  } ,
		{ name : 'Tianjing'     , data : 12938224  } ,
		{ name : 'Beijing'      , data : 19612368  } ,
		{ name : 'Guangdong'    , data : 104303132 } ,
		{ name : 'Guizhou'      , data : 34746468  } ,
		{ name : 'Fujian'       , data : 36894216  } 
	];


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

		this._data = typeof config['data'] === 'object' ? config['data'] : this._data;
		this.title = typeof config['title'] === 'string' ? config['title'] : this.title;


		if (typeof config['dataUrl'] === 'string') {
			//TODO implements ajax fetching data later
		}
	}

	/* calculates the max value */
	for (var i=0; i<this._data.length; i++) {
		this.maxVal = this._data[i].data > this.maxVal ? this._data[i].data : this.maxVal;
	}

	this._maxbarHeight = this.maxVal > 39.125 ? 39.125 : this.maxVal;

	/* the position that camera look at */
	this._lookAtPos = {x:0, y:0, z:0};
	
};

mm3d.ChineseMap.prototype = {
	/**
	 * Some utility methods.
	 */
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
		var legendContext = document.createElement('div');
		legendContext['id'] = 'mm3dLegendCtx';

		for (var i=0; i<this._data.length; i++) {
			var legendItem = document.createElement('div');
			legendItem['className'] = 'mm3dLegendItem';
			var legendColor = document.createElement('span');
			legendColor['className'] = 'mm3dLegendColor';
			legendColor['style']['backgroundColor'] = 
				this._calColor(this._data[i]['data']*this._maxbarHeight/this.maxVal).getContextStyle();
			var legendName = document.createElement('span');
			legendName['className'] = 'mm3dLegendName';
			legendName.innerHTML = this._data[i]['name'];

			var legendValue = document.createElement('span');
			legendValue['className'] = 'mm3dLegendValue';
			legendValue.innerHTML = this._data[i]['data'];

			legendItem.appendChild(legendColor);
			legendItem.appendChild(legendName);
			legendItem.appendChild(legendValue);
			legendContext.appendChild(legendItem);
		}

		legendNode.appendChild(legendContext);
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
		}, false);
		this._vp.addEventListener('mousemove', function(e) {
			mm3d.mouseState.last = mm3d.mouseState.cur;
			mm3d.mouseState.cur  = { x : e.clientX, y : e.clientY };
			//console.log(mm3d.mouseState);
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

		toolBox.appendChild(optMenu);
		toolBox.appendChild(hlpMenu);
		this._vp.appendChild(toolBox);

		/**
		 * The scale rule at the right-bottom corner.
		 */
		var scaleRuleContainer = divNode.cloneNode(true);
		applyConfig(scaleRuleContainer, {id: 'mm3dScaleRuleCont'}); 

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

		this._initLegend();
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
			if (this.modelChanged) {
				//TODO changed the model
			}

			/* rotate mouse */
			if (mm3d.mouseState.down) {
				var cX = mm3d.mouseState.cur.x, 
					cY = mm3d.mouseState.cur.y;
				var lX = mm3d.mouseState.last.x, 
					lY = mm3d.mouseState.last.y;
				var yDiff = cY - lY, xDiff =  -cX + lX;

				if (Math.abs(yDiff)> mm3d.EPSILON 
						|| Math.abs(xDiff) > mm3d.EPSILON) {
					var thetaY = yDiff * .5 * Math.PI/ this._option.size[1];	
					var thetaX = xDiff * .5 * Math.PI/ this._option.size[0];	

					for (var i=0; i<this._data.length; i++) {
						this._data[i]['mesh'].rotation.x += thetaY;
						this._data[i]['mesh'].rotation.z += thetaX;
					}

					// var dy = this._three.camera.position.y
					// 	- this._lookAtPos.y;
					// var dz = this._three.camera.position.z
					// 	- this._lookAtPos.z;
					// var newY = dy*Math.cos(thetaY) - dz*Math.sin(thetaY);
					// var newZ = dz*Math.cos(thetaY) + dy*Math.sin(thetaY);
					// this._three.camera.position.set(
					// 	this._three.camera.position.x,
					// 	this._lookAtPos.y + newY,
					// 	this._lookAtPos.z + newZ
					// );

					// /* now, dy = newY */
					// var dx = this._three.camera.position.x
					// 	- this._lookAtPos.x;
					// var newX = dx*Math.cos(thetaX) - newY*Math.sin(thetaX);
					// newY = newY*Math.cos(thetaX) + dx*Math.sin(thetaX);
					// this._three.camera.position.set(
					// 	this._lookAtPos.x + newX,
					// 	this._lookAtPos.y + newY,
					// 	this._three.camera.position.z
					// );
				}
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

		for (var i=0; i<this._data.length; i++) {
			(function(that, i) {
				that._three.loader.load({model : 'js/map'+that._data[i]['name']+'.js',
				callback : function(geo) { 
					console.log(that._data[i]['name'] + ' loaded.'); 
						that._loadedMesh.push(i);
						var barHeight = that._data[i]['data']/that.maxVal*that._maxbarHeight;
						that._data[i]['mesh'] = new THREE.Mesh(geo, 
							new THREE.MeshLambertMaterial({
									color : that._calColor(barHeight).getHex(), transparent : true}));
						//that._data[i]['mesh'].scale.set(3, 3, 3); 
						// that._data[i]['mesh'].rotation.x = Math.PI/2;
						that._three.scene.add(that._data[i]['mesh']);

						/* set data */
						that._data[i]['mesh'].scale.y = (1+barHeight);
						// that._data[i]['mesh'].material.opacity = barHeight/that.maxVal;
						//that._data[i]['mesh'].position.y = (1+barHeight)*.5*.08;
						

						if (that._loadedMesh.length >= that._data.length) {
							console.log("loads complete.");
							/* begin to render scene */
							that._mainloop(that)();
						}
					} 
				});

			})(this, i);
		}

		/**
		 * Appends the scene object at last.
		 */
		this._three.renderer.domElement['id'] = 'mm3dViewport';
		this._vp.appendChild(this._three.renderer.domElement);

	},

	change : function (config) {

	}
};

