



function entity() {

	//constructor to create a new player
	function player(type) {

		var body,
			
			stats =  {
				maxSpd: 3
			},
			
			controls,
			
			hotkeys = {
				fwd: 'w',
				bwd: 's',
				r: 'd',
				l: 'a',
				jump: 'spacebar'
			};
	
		body = new THREE.BoxGeometry(1, 1, 1);

		controls = function(key) {

			if (key === fwd) {

				physics.updateMovment(body, 1, 0, 0, stats.maxSpd);
			} else if (key === bwd) {

				physics.updateMovment(body, -1, 0, 0, stats.maxSpd);
			} else if (key === r) {

				physics.updateMovment(body, 0, 0, -1, stats.maxSpd);
			} else if (key === l) {
				
				physics.updateMovment(body, 0, 0, 1, stats.maxSpd);
			};
		};
	};
};