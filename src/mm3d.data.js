/**
 * The data classes for megamap library.
 * @author Ye Jiabin <alpha360x@gmail.com>
 * @requires mm3d.util.js
 */

var mm3d = mm3d || {};
/**
 * @constructor
 * Base class of data model.
 */
mm3d.BaseData = function() {
	this.model = null;
	this.length = 0;
	this.max = 0;
	this.min = 0;
};

/**
 * Available data model fields.
 */
mm3d.BaseData.FIELDS = ['data', 'last', 'mesh', 'disp'];

mm3d.BaseData.prototype = {
	constructor : mm3d.BaseData,

	forEach : function(field, callback) {
		for (var item in this.model) {
			callback.call(this, item, this.model[field]);
		}
	},

	/**
	 * Changes the data model and calculates the max value as well.
	 * @param newData new data model
	 */
	changeData : function (newData) {
		for (var item in this.model) {
			if (newData[item]['data'] > this.max) {
				this.max = newData[item]['data'];
			}
			// TODO integrity check
			this.model[item]['data'] = newData[item]['data'];
		}
	},

};

