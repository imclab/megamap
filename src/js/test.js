/**
 * @author Ye Jiabin
 * A Test file for mygallery
 */

(function(window) {
	window.addEventListener('load', function(){
		GSys.init(
			['img/wp1.jpg', 
				'img/wp2.png',
				'img/wp3.png',
				'img/wp4.png',
				'img/wp5.jpg',
				'img/wp6.jpg'],
			{cont:'cav', width: 900, height: 540});
		GSys.start();
		/* binding next */
		document.getElementById('next')
		.addEventListener('click', function() {
			GSys.next();
		}, false);
		/* binding previous */
		document.getElementById('prev')
		.addEventListener('click', function() {
			GSys.prev();
		}, false);
	}, false);
})(window);
