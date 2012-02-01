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
			this.model[item]['last'] = this.model[item]['data'];	
			if (newData[item]['data'] > this.max) {
				this.max = newData[item]['data'];
			}
			// TODO integrity check
			this.model[item]['data'] = newData[item]['data'];
		}
	},

};

/**
 * The data for China's map
 */
mm3d.DataChina = function (newData) {
	mm3d.BaseData.call(this);
	this.model = {	
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
	};
	this.length = 34;
	this.max = 0;

	if (newData !== undefined) {
		this.changeData(newData);
	}
};

mm3d.DataChina.prototype = new mm3d.BaseData();
mm3d.DataChina.prototype.constructor = mm3d.DataChina;

