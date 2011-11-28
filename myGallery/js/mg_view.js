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

	BASE_CAM : {x: defs.BASE_CAM.x+180,
				y: defs.BASE_CAM.y+180,
				z: defs.BASE_CAM.z},

	/**
	 * Just a reference to main scene.
	 */
	scn : null,

	/**
	 * Just a reference to main camera.
	 */
	cam : null,

	/**
	 * Defines whether or not in a tween motion
	 */
	inTween : false,

	/**
	 * The offset of percentage every tween frame moves
	 */
	twOffset : 2.0,

	/**
	 * The offset value accumlated in total.
	 */
	accOffset : 0,

	/**
	 * Switches to next pics
	 */
	next : function () {
		if (this.inTween) return;
		this.inTween = true;
		this.twOffset = -Math.abs(this.twOffset);
	},

	/**
	 * Initailizes the view, and add the 
	 * first of serveral objects in the stage
	 * mesh object to the stage
	 */
	init : function () {
		this.scn = GSys.stage.scn;
		this.cam = GSys.stage.cam;

		for (var i=0; i<this.imgList.length && 
				i<this.dispAmount; i++) {
			if (this.imgList[i].onStage) continue;
			this.imgList[i].onStage = true;
			var localMesh = this.imgList[i].mesh;
			this.scn.add(localMesh);
			localMesh.position.x = i*MvDec.xOffset;
			localMesh.position.y = i*MvDec.yOffset;
			localMesh.position.z = -i*MvDec.zOffset;
		}

		this.cam.position = this.BASE_CAM;
		this.cam.lookAt({x:0, y:0, z:0});
	},

	run : function () {
		if (!this.inTween) return;
		this.accOffset += this.twOffset;
		/* TODO I should optmize here */
		if (this.twOffset > 0) {
			/* previous picture */
			if (this.accOffset >= 100.0) {
				this.accOffset = 0;
				this.inTween = false;
				return;
			} 
		} else {
			/* next picture */
			this._tween_next();
			if (this.accOffset <= -100.0) {
				this.accOffset = 0;
				this.inTween = false;
				return;
			}
		}
	},

	_tween_next : function () {
		var i=GSys.curImg-1;
		/* percentage */
		var perc = this.accOffset/100.0;
		if (i<0) i=0; /* sanity check */
		this.imgList[i].mesh.material.opacity = 1-Math.abs(perc);

		for (var j=0; i<this.imgList.length
			&& j<this.dispAmount; i++,j++) {
			this.imgList[i].mesh.position = 
				{x:(j+perc)*MvDec.xOffset,
				y:(j+perc)*MvDec.yOffset, 
				z:-(j+perc)*MvDec.zOffset};
		}
	}
};

