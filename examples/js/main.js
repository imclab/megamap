var camera, scene, renderer, geometry, material, mesh;
var loader;

window.requestAnimationFrame = (function(){
	return window.requestAnimationFrame       || 
		window.webkitRequestAnimationFrame || 
		window.mozRequestAnimationFrame    || 
		window.oRequestAnimationFrame      || 
		window.msRequestAnimationFrame     || 
		function(/* function */ callback){
			window.setTimeout(callback, 1000 / 60);
		};
})();


function init() {
	loader = new THREE.JSONLoader(true);
	scene = new THREE.Scene();

	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
	//camera.position.z = 1000;
	camera.position.z = 100;
	scene.add( camera );

	//geometry = new THREE.CubeGeometry( 200, 200, 200 );
	//material = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true } );

	//mesh = new THREE.Mesh( geometry, material );
	//scene.add( mesh );

	//renderer = new THREE.CanvasRenderer();
	renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );

	var pointLight = new THREE.PointLight( 0xFFFFFF );

	//set its position
	pointLight.position.x = 10;
	pointLight.position.y = 50;
	pointLight.position.z = 130;
	
	// add to the scene
	scene.add(pointLight);

	loader.load({model : "js/Fujian.js", callback: function (geo) {
		mesh = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({color : 0xff0000,
																transparent : true}));
		mesh.position.set(0, 0, 80);
		mesh.scale.set(3.0, 3.0, 3.0);
		mesh.rotation.set(Math.PI/2, 0, 0);
		console.log(mesh.material);
		scene.add( mesh );
	}});

	document.body.appendChild( renderer.domElement );

}

function animate() {

	//note: three.js includes requestAnimationFrame shim
	requestAnimationFrame( animate );
	render();

}

function render() {

	if (mesh !== undefined) {
		mesh.material.opacity = .01;
	}

	renderer.render( scene, camera );

}

(function(window){
	window.addEventListener('load', function(){
		init();
		animate();
	}, false);
}(window));

