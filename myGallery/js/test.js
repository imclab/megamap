/**
 * @author Ye Jiabin
 * A Test file for mygallery
 */

(function(window) {
	window.addEventListener('load', function(){
		GSys.init({cont:'cav', width: 600});
		GSys.appendImg('justfakepath');
		GSys.start();
	}, false);
})(window);