
/* TO DO LIST:

1. Search a value for G: (gravitational constant) (11)
2.
3.
*/

var physics = {
	
	//G:   ,

	//used to change/define the speed of an object
	updateMovement: function (object, spdX, spdY, spdZ, maxSpd) {
		
		// create/update object.direction
		if (object.force) {
			
			//checkes if maxSpd is >= object.force
			if (object.force.x + object.force.z <= maxSpd) {
				
				object.force = {

					x: this.x + spdX,
					y: this.y + spdY,
					z: this.z + spdZ
				};
			};
		} else {

			object.force = {

				x: spdX,
				y: spdY,
				z: spdZ
			};
		};
	}, 

	drawMovement: function (object) {
		
		//update the objects position depending on force
		object.position.set(object.force.x, object.force.y, object.force.z);
	},
	
	//not done with this yet 
	detectCollision: function (object, collidables) {
		
		//checks if an object touches another object
		for (var vertexIndex = 0; vertexIndex < object.geometry.vertices.length; vertexIndex++) {
			
			//makes a vector from the origin to the vertex
			var localVertex = object.geometry.vertices[vertexIndex].clone();
			var globalVertex = localVertex.applyMatrix4(object.matrix);
			var directionVector = globalVertex.sub(object.position);
			
			//creates a ray with the direction of the vector and safes all collisions 
			var ray = new THREE.Raycaster(object.position , directionVector , 0 , directionVector.length()); 
			var collisionResults = ray.intersectObjects(collidables);
			return collisionResults
			
		};
	},

	gravity: function (object) {
		
		//remove a ceartain amount from the y axis (.direction.y) to create gravity
		if (object.force.isFalling === true) {
			object.force.y -= G;
		}
	}


};