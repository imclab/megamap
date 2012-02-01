/**
 * All widgets classes for megamap library.
 * @author Ye Jiabin <alpha360x@gmail.com>
 * @requires mm3d.Util.js
 */

var mm3d = mm3d || {};

/**
 * The constructor the widget.
 */
mm3d.Widget = function () {
    /**
     * The base container of the widget.
     */
    this.base = null;

};

mm3d.Widget.prototype = {
	constructor : mm3d.Widget,

    /**
     * Gets the html dom container.
     * @return the dom node of the widget.
     */
    getDOM : function () {
   	 return this.base.get();
    }

};


/**
 * The loading widget.
 */
mm3d.WgLoading = function (size) {
	mm3d.Widget.call(this);

	var title = mm3d.Util.div().attr({'className' : 'mm3dLoadingTitle'}).html('LOADING...');
	this.base = mm3d.Util.div().attr({'className' : 'mm3dLoading'}).w(size[0]).h(size[1]).css({'top':(size[1] - parseInt(title.clientHeight))*.5 + 'px'});
//	mm3d.Util.div().attr({'className' : 'mm3dLoadingTitle'}).html('LOADING...');
	this._content = mm3d.Util.div().attr({'className' : 'mm3dLoadingContent'});
	this.base.add(title).add(this._content);
};

mm3d.WgLoading.prototype = new mm3d.Widget();

/**
 * Sets new content text for loading node.
 * @param txt new content text
 * @return 'this' object
 */
mm3d.WgLoading.prototype.content = function(txt) {
		this._content.html(txt);
		return this;
	};

mm3d.WgLoading.prototype.constructor = mm3d.WgLoading;

mm3d.WgToolbox = function () {
	var opt = new mm3d.Util.span().html('option')
		.attr({'className' : 'mm3dMenuItem'})
	var hlp = new mm3d.Util.span().html('help')
		.attr({'className' : 'mm3dMenuItem'})
	var exp = new mm3d.Util.span().html('export')
		.attr({'className' : 'mm3dMenuItem'})
	this.base = new mm3d.Util.div()
		.attr({'className' : 'mm3dToolbox'})
		.add(exp).add(opt).add(hlp);
};

mm3d.WgToolbox.prototype = new mm3d.Widget();
mm3d.WgToolbox.prototype.constructor = mm3d.WgToolbox;

mm3d.WgTitle = function (txt) {
	var text = txt === undefined ? '' : txt;
	this.base = new mm3d.Util.div().html(text)
		.attr({'className' : 'mm3dTitle'});
};

mm3d.WgTitle.prototype = {
	/**
	 * Sets new content text for loading node.
	 * @param txt new content text
	 * @return 'this' object
	 */
	content : function(txt) {
		this.base.html(txt);
		return this;
	}
};

mm3d.WgTitle.prototype = new mm3d.Widget();
mm3d.WgTitle.prototype.constructor = mm3d.WgTitle;

mm3d.WgScalerule = function (size) {
	var sr = new mm3d.Util.div().attr({'className':'mm3dScaleRule'})
		.w(size[0]).h(size[1]);
	
	var srCav = new mm3d.Util.cav()
		.attr({'width':size[0], 'height':size[1], 'className':'mm3dScaleRule'});

	/* the minimum value tag */
	this._min = new mm3d.Util.span()
		.attr({'id':'mm3dMinTag', 'className':'mm3dScaleTag'});
	this._max = new mm3d.Util.span()
		.attr({'id':'mm3dMaxTag', 'className':'mm3dScaleTag'});

	this._size = size;
	/* paint the canvas component */
	this._ctx = srCav.get().getContext('2d');

	this.repaint = function(minColor, maxColor) {
		var g = this._ctx.createLinearGradient(0, 0, 
					this._size[0], this._size[1]);
		g.addColorStop(0, minColor);
		g.addColorStop(1, maxColor);
		this._ctx.fillStyle = g;
		this._ctx.fillRect(0, 0, this._size[0], this._size[1]);
	};

	this.repaint('#f00', '#ff0');

	this.base = new mm3d.Util.div()
		.attr({'className':'mm3dScaleRuleCont'})
		.add(this._min).add(this._max).add(srCav);
};

mm3d.WgScalerule.methods ( {
	max : function (n) {
		if (n === undefined) {
			return this._max.html();
		} else {
			this._max.html(n);
			return this;
		}
	},

	min : function (n) {
		if (n === undefined) {
			return this._min.html();
		} else {
			this._min.html(n);
			return this;
		}
	}
});

mm3d.WgScalerule.prototype = new mm3d.Widget();
mm3d.WgScalerule.prototype.constructor = mm3d.WgScalerule;

mm3d.WgLegend = function () {
	this.base = new mm3d.Util.div()
		.attr({'className' : 'mm3dLegendContainer'});
	this._ctx = new mm3d.Util.div()
		.attr({'className' : 'mm3dLegendCtx'});
};

mm3d.WgLegend.prototype = new mm3d.Widget();
mm3d.WgLegend.prototype.constructor = mm3d.WgLegend;

mm3d.WgCamCtrl = function () {
	this.base = mm3d.Util.div()
		.attr({'className':'mm3dCamContainer'});
	var r = 18, sqrt2 = Math.sqrt(2);
	var cfg = [
		{pos : [2*sqrt2-1, sqrt2-1], sign : mm3d.PAN_TOP},
		{pos : [sqrt2-1, 2*sqrt2-1], sign : mm3d.PAN_LEFT},
		{pos : [3*sqrt2-1, 2*sqrt2-1], sign : mm3d.PAN_RIGHT},
		{pos : [2*sqrt2-1, 3*sqrt2-1], sign : mm3d.PAN_DOWN}
	];

	for (var i=0; i<cfg.length; i++) {
		this.base.add(
			mm3d.Util.div().attr({'className':'mm3dCamButton'})
			.css({'left': r*cfg[i]['pos'][0] + 'px',
				 'top': r*cfg[i]['pos'][1] + 'px'})
		);
	}
}

mm3d.WgCamCtrl.prototype = new mm3d.Widget();
mm3d.WgCamCtrl.prototype.constructor = mm3d.WgCamCtrl;
