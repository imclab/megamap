/**
 * The color model for megamap library.
 * @author Ye Jiabin <alpha360x>
 * @requires Three.js
 */

mm3d.Color = function (dataModel) {
	this._dataModel = dataModel;
};

mm3d.Color.prototype = {
	constructor : mm3d.Color,

	getColor : function () {
		throw { message : 'invalid invokes virtual class method.' };
	}
};

mm3d.ColorLG = function (dataModel, minColor, maxColor) {
	mm3d.Color.call(this, dataModel);
	this._maxC = maxColor;
	this._minC = minColor;
};

mm3d.ColorLG.prototype = new mm3d.Color();

mm3d.ColorLG.prototype['getColor'] = function (id) {
		var max = this._dataModel.max,
			min = this._dataModel.min,
			data = this._dataModel.model[id]['data'];
		var ratio = (max-min)*data;
		/* Calculates the color */
		var c = {
			r : (this._maxC.r - this._minC.r)*ratio + this._minC.r,
			g : (this._maxC.g - this._minC.g)*ratio + this._minC.g,
			b : (this._maxC.b - this._minC.b)*ratio + this._minC.b
		};
		return new THREE.Color().setRGB(c.r, c.g, c.b);
};

mm3d.ColorLG.prototype.constructor = mm3d.ColorLG;

