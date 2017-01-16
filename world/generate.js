
/* TO DO LIST:

1. generate Trees and add .tree = true to all vertices under the tree exept the one in the middle which constains the whole tree
2.
3.
*/

function Game() {
               
    var renderer,
        scene,
        camera,
        map = {
    	geometry: new THREE.Geometry(),
        sizeX: 50,
    	sizeY: 25,
    	sizeZ: 50,                      
        gradient: 1.                     
    },
        collidables = [];           

    // function for Initiation (called with Game.init())
    function init() {
    	
    	scene = new THREE.Scene();
    	
    	camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.x = map.sizeX * 1.1;
        camera.position.y = map.sizeY * 2;
        camera.position.z = map.sizeZ * 1.1;
        camera.lookAt(scene.position);

    	renderer = new THREE.WebGLRenderer();
    	renderer.setClearColor(0x000000, 1.0);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMapEnabled = true;

        //generation Functions
        genMap();

        //adds the map
        var mesh = new THREE.Mesh(map.geometry, new THREE.MeshPhongMaterial({
            side: THREE.BackSide,
            color: 0x00ff4f
        }));
        scene.add(mesh);

        var spotLight = new THREE.SpotLight(0xffffff);
            spotLight.position.set( map.sizeX * 2, map.sizeY * 1.5, map.sizeZ);
            spotLight.shadowCameraNear = 20;
            spotLight.shadowCameraFar = 50;
            spotLight.castShadow = true;

        scene.add(spotLight);
        scene.add(new THREE.AmbientLight(0x252525));
        
        document.body.appendChild(renderer.domElement);

        render();
        window.addEventListener('resize', handleResize, false);
        //all local vars and functions that need to be exported
        this.camera = camera;
    };

    // this function makes the the map
    function genMap() {
        
        //starting point of generation
        var h = map.sizeY + Math.round((Math.random() * map.sizeY / 10 - map.sizeY / 20) * 100) / 100;
        //h for heigth (y)        
        
        //the loop that generates the map surface 
        for (var l = 0; l < map.sizeX; l++) {
            //l for length (x)
            map[l] = [];

            for (var w = 0; w < map.sizeZ; w++) {
                //w for width (z)
                map[l][w] = [];

                if (l === 0 && w === 0) {
                    
                    h += parseFloat((Math.random() * map.gradient - map.gradient / 2).toFixed(3));
                    map[l][w][0] = new THREE.Vector3(l, h, w);
                } else if (l === 0) {
                    
                    h += parseFloat((Math.random() * map.gradient - map.gradient / 2).toFixed(3));
                    map[l][w][0] = new THREE.Vector3(l, h, w);
                } else if (w === 0) {
                    
                    h = parseFloat((Math.random() * map.gradient - map.gradient / 2 + map[l - 1][w][0].y).toFixed(3));
                    map[l][w][0] = new THREE.Vector3(l, h, w);
                } else {

                    h += parseFloat((Math.random() * map.gradient - map.gradient / 2 + (map[l - 1][w][0].y - h) / 2).toFixed(3));
                    map[l][w][0] = new THREE.Vector3(l, h, w);
                };
                map.geometry.vertices.push(map[l][w][0]);
            };
        };        

        updateFaces(map);
        //map.geometry.computeVertexNormals(true);
        map.geometry.computeFaceNormals();
    };

    function updateFaces(object) {
        
        for (var x = 0; x < object.sizeX - 1; x++) {
            
            for (var z = 0; z < object.sizeZ - 1; z++) {
                /*
                a - b
                | / |
                c - d
                */
                var a = x * object.sizeZ + z;
                var b = x * object.sizeZ + z + 1;
                var c = (x + 1) * object.sizeZ + z;
                var d = (x + 1) * object.sizeZ + (z + 1);

                var face1 = new THREE.Face3(b, a, c);
                var face2 = new THREE.Face3(c, d, b);
                
                object.geometry.faces.push(face1);
                object.geometry.faces.push(face2);
            };
        };
    };

    // checks if trees are close and calls growTree() (later = true is for later growing trees)
    function checkForTrees(l, w, h, circum, later) {

        var check = new Array;

        for (var i = 1; i <= circum + 1; i++) {
              
            for (var j = i - 1; j > 0; j--) {

                check[check.length] = "!map[" + l + " - " + i + "][" + w + " - (" + i + " + " + j + ")][0]";
                check[check.length] = "!map[" + l + " - (" + i + " + " + j + ")][" + w + " - " + i + "][0]";
                    
                later && (check[check.length] = "!map[" + l + " + " + i + "][" + w + " + (" + i + " + " + j + ")][0]") & (check[check.length] = "!map[" + l + " + (" + i + " + " + j + ")][" + w + " + " + i + "][0]");
            };

            check[check.length] = "!map[" + l + " - " + i + "][" + w + " - " + i + "][0]";

            later && (check[check.length] = "!map[" + l + " + " + i + "][" + w + " + " + i + "][0]");
            
        };

        if (Math.random() >= 0.95 && l > 1 && w > 1 && testForTrue(check)) {
                        
            growTree(l, w, h, circum);                
        };
    };

    //tests an object/array if the reqirements are true
    function testForTrue(object) {

        var trueCount = 0;

        for (var i = object.length - 1; i >= 0; i--) {
            
            object[i] && trueCount++; 
        };
        
        (trueCount === object.length) && (trueCount = true);
        return trueCount;
    };

    // renders the scene and camera
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

    // export global functions and vars
    this.init = init;
    this.map = map;
};