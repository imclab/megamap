/**
 * The core class for megamap library.
 * @author Ye Jiabin <alpha360x@gmail.com>
 * @requires mm3d.core.js
 */

mm3d.ChinaMap = function (cont, data, config) {
	mm3d.AbstractMap.call(this, cont);

	this._vp = cont;
	this._dataModel = new mm3d.DataChina(data);

	this._initConfig.call(this, config); 
	this._urlPrefix = 'map/China/map';
	if (config !== undefined) {
		if (config['urlPrefix'] !== undefined) {
			this._urlPrefix = config['urlPrefix'];
		}
	}
};

mm3d.ChinaMap.prototype = new mm3d.AbstractMap();

/*
mm3d.ChinaMap.prototype.init = function () {
	mm3d.AbstractMap.prototype.init.call(this);

};
*/

mm3d.ChinaMap.prototype.constructor = mm3d.ChinaMap;

