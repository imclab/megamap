/**
 * @author Ye Jiabin
 * A Test file for mygallery
 */

(function(window) {
	window.addEventListener('load', function(){
		GSys.init(
			['haha', 'aaa','bbb','j','k','l','d'],
			{cont:'cav', width: 900, height: 540});
		GSys.start();
		document.getElementById('next')
		.addEventListener('click', function() {
			GSys.next();
		}, false);
	}, false);
})(window);
