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
		this.imgList.push(newim);
	},

	/**
	 * Defaults display amount in this view
	 */
	dispAmount : 4,

	BASE_CAM : {x: defs.BASE_CAM.x,//+180,
				y: defs.BASE_CAM.y,//+180,
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
	 * Switches to the next picture
	 */
	next : function () {
		if (this.inTween) return;
		this.inTween  = true;
		this.twOffset = -Math.abs(this.twOffset);
		/* adds a new mesh if exists */
		var newIdx = GSys.curImg+this.dispAmount-1;
		if (newIdx < this.imgList.length) {
			this.scn.add(this.imgList[newIdx].mesh);
			this.imgList[newIdx].mesh.material.opacity = .0;
		}
	},
	
	/**
	 * Switches to the previous picture
	 */
	prev : function () {
		if (this.inTween) return;
		this.inTween  = true;
		this.twOffset = Math.abs(this.twOffset);
		/* adds a new mesh of previous pic*/
		this.scn.add(this.imgList[GSys.curImg].mesh);
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
			this.imgList[i].loaded = true;
			var localMesh = this.imgList[i].mesh;
			this.scn.add(localMesh);
			localMesh.position.x = i*MvDec.xOffset;
			localMesh.position.y = i*MvDec.yOffset;
			localMesh.position.z = -i*MvDec.zOffset;
		}

		this._upCam();
	},

	/**
	 * @private
	 * Updates the camera.
	 */
	_upCam : function () {
		this.cam.position = {
			x : this.BASE_CAM.x + 100,
			y : this.BASE_CAM.y,
			z : this.BASE_CAM.z
		};
		/* 
		this.cam.position = 
			{x:this.BASE_CAM.x-.5*GSys.stage.width
				+ MouseMgr.x,
			 y:this.BASE_CAM.y+.5*GSys.stage.width
				- MouseMgr.y,
			 z:this.BASE_CAM.z};
	 	console.log('cam ' + this.cam.position);
		*/
		this.cam.lookAt({x:0, y:0, z:0});
	},

	run : function () {
		/* TODO add a camera manager */
		//this._upCam();
		if (!this.inTween) return;
		this.accOffset += this.twOffset;
			/* TODO I should optmize here */
		if (this.twOffset > 0) {
		/* previous picture */
			this._tween_prev();
			if (this.accOffset >= 100.0) {
				this.accOffset = 0;
				this.inTween = false;
				var rmIdx = 
					GSys.curImg-1+this.dispAmount;
				if (rmIdx < this.imgList.length) {
					GSys.stage.scn.remove(
							this.imgList[rmIdx]);
				}
			}
		} else {
			/* next picture */
			this._tween_next();
			if (this.accOffset <= -100.0) {
				this.accOffset = 0;
				this.inTween = false;
				/* TODO index */
				GSys.stage.scn.remove(
					this.imgList[GSys.curImg-1].mesh);	
				console.log('removed');
			}
		}
	},

	/**
	 * @private
	 * Performs the tween animation for switching to
	 * next picture. 
	 */
	_tween_next : function () {
		var i=GSys.curImg-1;
		var j=0;
		/* percentage */
		var perc = this.accOffset/100.0;
		if (i<0) i=0; /* sanity check */
		/* fade out */
		this.imgList[i].mesh.material.opacity = 1-Math.abs(perc);

		/* TODO merge the same code block in tween previous */
		for (; i<this.imgList.length
			&& j<this.dispAmount+1; i++,j++) {
			this.imgList[i].mesh.position = 
				{x:(j+perc)*MvDec.xOffset,
				y:(j+perc)*MvDec.yOffset, 
				z:-(j+perc)*MvDec.zOffset};
		}
		i -= 1;
		if ( i>=0 && GSys.curImg - 1 + 
				this.dispAmount < this.imgList.length) {
			/* fade in */
			this.imgList[i].mesh.material.opacity = 
				Math.abs(perc);
		}
	},

	/**
	 * @private
	 * Performs the tween animation for swithing to
	 * previous picture.
	 */
	_tween_prev : function () {
		var i=GSys.curImg;
		var j=0;
		var perc = this.accOffset/100.0;

		/* fade in of the first one */
		this.imgList[i].mesh.material.opacity = 
			Math.abs(perc);
		
		for (; i<this.imgList.length && j<this.dispAmount+1; i++,j++)
		{
			this.imgList[i].mesh.position = 
				{x:(j-1+perc)*MvDec.xOffset,
				y:(j-1+perc)*MvDec.yOffset, 
				z:-(j-1+perc)*MvDec.zOffset};
		}
		i -= 1;
		if ( i>=0 && GSys.curImg - 1 + 
				this.dispAmount < this.imgList.length) {
			/* fade out of the last one */
			this.imgList[i].mesh.material.opacity = 
				1-Math.abs(perc);
		}
	}

	
};

