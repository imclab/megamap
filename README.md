megamap
=========

A javascript library for displaying statistical map using [WebGL](http://www.khronos.org/webgl/wiki/Main_Page) in 3d.  
[three.js](https://github.com/mrdoob/three.js) is used in the project.  
All [browsers](http://www.khronos.org/webgl/wiki/Getting_a_WebGL_Implementation) that support WebGL are able to display the page.  

* * *

Usage :
-------
mm3d-latest.js, mm3d.css and all meshes file(i.e. mapXxx.js) is required for the program.  
The library is currently not completed.  
The following code shows the basic usage, and the full
API reference is also not avaliable until the completion of code work.  

Include both js and css files in your html header.

```html
<!-- Three.js (r47) is required in megamap library -->
<script type='text/javascript' src='Three.js'></script>
<!-- This is our megamap library -->
<script type='text/javascript' src='mm3d.min.js'></script>
<!-- Do not forget to include corresponding map file, 
	 take China map for example -->
<script type='text/javascript' src='mm3d.chn.js'></script>

<link rel='stylesheet' type='text/css' href='mm3d.css'>

```

And initialize the map as following.

```javascript

var map = mm3d.ChinaMap(document.getElementById('viewport'),
						  mapData, {'animation':false})
map.init();

```

* * *

Current examples :
----------------
![China's population map](https://github.com/alpha360x/megamap/raw/master/screenshots/CHN_population.png)

