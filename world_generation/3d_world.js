
//-------------------------------//
//GLOBAL VARIABLES               //
var renderer;                    //
var scene;                       //
var camara;                      //
var mapSize = {                  //
	x: 25,                       //
	y: 10,                       //
	z: 25,                       //
    maxY: 2,                     //
    minY: 2                      //
}                                //
var blocks = {};                 //
//-------------------------------//

/* TO DO LIST: */

/* 
1. give every block a terrainType depending on the closest other blocks terrain (first one is flat). Then increase block scaling and split every block in 1/10 of the main block then programm every single terrain type 
2.
3.
*/


// function for Initiation (called with window.onload())
function init() {
	
	scene = new THREE.Scene();
	
	camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.x = mapSize.x * 1.1;
    camera.position.y = mapSize.y * 2;
    camera.position.z = mapSize.z * 1.1;
    camera.lookAt(scene.position);

	renderer = new THREE.WebGLRenderer();
	renderer.setClearColor(0x000000, 1.0);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMapEnabled = true;

    var cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
    var fillerMesh = new THREE.MeshLambertMaterial({color: 0x00ff00});

    genBlocks(cubeGeometry, fillerMesh);
    genTerrain();

     var spotLight = new THREE.SpotLight(0xffffff);
        spotLight.position.set( mapSize.x * 1, mapSize.y * 2, mapSize.z * 1);
        spotLight.shadowCameraNear = 20;
        spotLight.shadowCameraFar = 50;
        spotLight.castShadow = true;

        scene.add(spotLight);
        scene.add(new THREE.AmbientLight(0x252525));
    
    document.body.appendChild(renderer.domElement);

    render();
};

// renders the scene and camera always use if you want to update them.
function render() {
	requestAnimationFrame(render);
	renderer.render(scene, camera);
};
// to handle resize 
function handleResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
};
// this function adds all the blocks the the blocks object
function genBlocks(cubeGeometry, fillerMesh) {

    for (var l = 1; l <= mapSize.x; l++) {
        //l for lenght (x)
        blocks[l] = {};
        var hChange = 0;

        for (var w = 1; w <= mapSize.z; w++) {
            //w for width (z)
            blocks[l][w] = {};
            var searchH1;
            var searchH2;
            var d = hChange > - mapSize.y + mapSize.minY;
            var f = hChange <= mapSize.y * 2 - mapSize.maxY;
            
            if (w > 1 && l == 1 && d && f) {
            
                hChange += Math.floor(Math.random() * 3 - 1);
            } else if (w > 1 && l != 1 && d && f) {

                searchH1 = objectLength(blocks[l - 1][w]) - mapSize.y;
                searchH2 = objectLength(blocks[l][w - 1]) - mapSize.y;
                hChange = (searchH1 + searchH2) / 2 + Math.floor(Math.random() * 3 - 1);
            } else if (l != 1 && d && f) {
                
                searchH1 = objectLength(blocks[l - 1][w]) - mapSize.y;
                searchH2 = objectLength(blocks[l][w - 1]) - mapSize.y;
                hChange = searchH1 + Math.floor(Math.random() * 3 - 1);
            } else {

                hChange += 1;
            };

            for (var h = 1; h <= mapSize.y + hChange; h++) {
                //h for height (y)
                console.log(l, w, h);                                 
                blocks[l][w][h] = {};
                blocks[l][w][h].block = new THREE.Mesh(cubeGeometry, fillerMesh)
                blocks[l][w][h].block.position = {
                    x: l,
                    y: h,
                    z: w
                };
            };
        };
    };
};
// this function deletes all unnessecary blocks and adds a terrain to all the others 
function genTerrain() {
    for (var l = 1; l <= mapSize.x; l++) {
        //l for length (x)

        for (var w = 1; w <= mapSize.z; w++) {
            //w for width (z)

            for (var h = 1; h <= objectLength(blocks[l][w]); h++) {
                //h for height
                if (w == 1 && l == 1) {
                    
                    if ( !blocks[l + 1][w][h] || !blocks[l][w + 1][h] || !blocks[l][w][h + 1]) {
                        
                        getTerrainType(l, w, h, "border");
                    };  
                } else if (w == 1 && l != mapSize.x) {
                    
                    if ( !blocks[l + 1][w][h] || !blocks[l - 1][w][h] || !blocks[l][w + 1][h] || !blocks[l][w][h + 1]) {
                        
                        getTerrainType(l, w, h, "border");
                    };
                } else if (l == 1 && w != mapSize.z) {
                    
                    if ( !blocks[l + 1][w][h] || !blocks[l][w + 1][h] || !blocks[l][w - 1][h] || !blocks[l][w][h + 1]) {
                        
                        getTerrainType(l, w, h, "border");
                    };
                } else if (w == mapSize.z && l == mapSize.x) {

                    if ( !blocks[l - 1][w][h] || !blocks[l][w - 1][h] || !blocks[l][w][h + 1]) {
                        
                        getTerrainType(l, w, h, "border");
                    };
                } else if (w == mapSize.z && l != 1) {

                    if ( !blocks[l + 1][w][h] || !blocks[l - 1][w][h] || !blocks[l][w - 1][h] || !blocks[l][w][h + 1]) {
                        
                        getTerrainType(l, w, h, "border");
                    };
                } else if (l == mapSize.x && w != 1) {

                    if ( !blocks[l - 1][w][h] || !blocks[l][w + 1][h] || !blocks[l][w - 1][h] || !blocks[l][w][h + 1]) {
                        
                        getTerrainType(l, w, h, "border");
                    };
                } else if (l == mapSize.x && w == 1) {
                    if ( !blocks[l - 1][w][h] || !blocks[l][w + 1][h] || !blocks[l][w][h + 1]) {
                        
                        getTerrainType(l, w, h, "border");
                    };

                } else if (w == mapSize.z && l == 1) {
                    
                    if ( !blocks[l + 1][w][h] || !blocks[l][w - 1][h] || !blocks[l][w][h + 1]) {
                        
                        getTerrainType(l, w, h, "border")
                    };
                } else {
                    if ( !blocks[l + 1][w][h] || !blocks[l - 1][w][h] || !blocks[l][w + 1][h] || !blocks[l][w - 1][h] || !blocks[l][w][h + 1]) {
                        
                        getTerrainType(l, w, h)
                    };
                };
            };
        };
    };
};
//this function has to set the  terrain type of the block(l , w , h) depending on its closest other blocks 
function getTerrainType(l, w, h, type) {
    
    var setTer = type;

    if (type != "border") {
        setTer = "this"
    }
    
    blocks[l][w][h].terrain = setTer;
    
    scene.add(blocks[l][w][h].block);
    console.log(l, w, h);
    console.log(blocks[l][w][h].terrain);

};
// this function checks how many objects there are inside of another object
function objectLength( object ) {
    var length = 0;
    for (var key in object) {
        if (object.hasOwnProperty(key)) {
            ++length;
        };
    };
    return length;
};

window.onload = init;
window.addEventListener('resize', handleResize, false);