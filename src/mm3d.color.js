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
	this.maxC = maxColor;
	this.minC = minColor;
};

mm3d.ColorLG.prototype = new mm3d.Color();

mm3d.ColorLG.prototype['getColor'] = function (id) {
	return this.getColorV(this._dataModel['model'][id]['data']);
};

mm3d.ColorLG.prototype['getColorV'] = function (data) {
	var max = this._dataModel.max,
		min = this._dataModel.min;
	var ratio = (data-min)/max;
	/* Calculates the color */
	var c = {
		r : (this.maxC.r - this.minC.r)*ratio + this.minC.r,
		g : (this.maxC.g - this.minC.g)*ratio + this.minC.g,
		b : (this.maxC.b - this.minC.b)*ratio + this.minC.b
	};
	return new THREE.Color().setRGB(c.r, c.g, c.b);
};

mm3d.ColorLG.prototype.constructor = mm3d.ColorLG;

