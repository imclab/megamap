/*
 * The China map script for megamap library.
 * @author Ye Jiabin <alpha360x@gmail.com>
 * @requires mm3d.core.js
 */

mm3d.DataShanghai = function (newData) {
	mm3d.BaseData.call(this);
	this.model = {	
		 'Baoshan'     : { data : 0, last : 1 } ,
		 'Changning'      : { data : 0, last : 1 } ,
		 'Chongming'     : { data : 0, last : 1 } ,
		 'Fengxian'        : { data : 0, last : 1 } ,
		 'Hongkou'     : { data : 0, last : 1 } ,

		 'Huangpu'        : { data : 0, last : 1 } ,
		 'Jiading'      : { data : 0, last : 1 } ,
		 'Jingan'        : { data : 0, last : 1 } ,
		 'Jinshan'       : { data : 0, last : 1 } ,
		 'Luwan'       : { data : 0, last : 1 } ,

		 'Minhang'        : { data : 0, last : 1 } ,
		 'Nanhui'      : { data : 0, last : 1 } ,
		 'Pudong'       : { data : 0, last : 1 } ,
		 'Putuo'        : { data : 0, last : 1 } ,
		 'Qingpu'       : { data : 0, last : 1 } ,

		 'Songjiang'     : { data : 0, last : 1 } ,
		 'Xuhui'        : { data : 0, last : 1 } ,
		 'Yangpu' 		: { data : 0, last : 1 } ,
		 'Zhabei'        : { data : 0, last : 1 } 
	};
	this.length = 19;
	this.max = 0;

	if (newData !== undefined) {
		this.changeData(newData);
	}
};

mm3d.DataShanghai.prototype = new mm3d.BaseData();
mm3d.DataShanghai.prototype.constructor = mm3d.DataShanghai;

mm3d.ShanghaiMap = function (cont, data, config) {
	mm3d.AbstractMap.call(this, cont);

	this._vp = cont;
	this._dataModel = new mm3d.DataShanghai(data);

	this._initConfig.call(this, config); 
	this._urlPrefix = 'map/Shanghai/map';
	if (config !== undefined) {
		if (config['urlPrefix'] !== undefined) {
			this._urlPrefix = config['urlPrefix'];
		}
		if (config['maxval'] !== undefined) {
			this._dataModel.max = config['maxval'];
		}
	}
};

mm3d.ShanghaiMap.prototype = new mm3d.AbstractMap();

/*
mm3d.ChinaMap.prototype.init = function () {
	mm3d.AbstractMap.prototype.init.call(this);

};
*/

mm3d.ShanghaiMap.prototype.constructor = mm3d.ShanghaiMap;

