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
		/* TODO decorator class may change */
		var newim = new MVDec(img);
		/* TODO the parameter is just for debugging */
		newim.init({color: Math.random()*0xffffff});
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
			var localMesh = this.imgList[i].mesh;
			this.scn.add(localMesh);
			localMesh.position.z = -i*MvDec.zOffset;
			localMesh.position.y = i*MvDec.yOffset;
			console.log("z " + MvDec.yOffset*i);
			console.log("z " + localMesh.position.y);
		}
	},

	run : function () {
		for (var i=0; i<this.imgList.length; i++) {
		}
	}
};

