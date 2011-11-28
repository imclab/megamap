/**
 * This file basically controls the view
 * of the stage.
 * @requre mg_imgs.js
 * @author Ye Jiabin
 */

/**
 * The class of the main view implemented by singleton
 */
var MainView = {

	/**
	 * The image list of the view
	 * with the decorator of main view
	 */
	imgList : [],

	/**
	 * Appends a image object to the img list.
	 */
	appendImg : function(img) {
		var newim = new MVDec(img);
		newim.init();
		this.imgList.push(newim);
	},

	/**
	 * Defaults display amount in this view
	 */
	dispAmount : 4,

	/**
	 * Just a reference to main scene.
	 */
	scn : null,

	/**
	 * Initailize the view, and add the 
	 * first of serveral objects in the stage
	 * mesh object to the stage
	 */
	init : function () {
		this.scn = GSys.stage.scn;
		for (var i=0; i<this.imgList.length && i<this.dispAmount; i++) {
			if (this.imgList[i].onStage) continue;
			this.imgList[i].onStage = true;
			this.scn.add(this.imgList[i].mesh);
			console.log("mesh is " + this.imgList[i].mesh);
		}
	},

	run : function () {
		for (var i=0; i<this.imgList.length; i++) {
		}
	}
};

