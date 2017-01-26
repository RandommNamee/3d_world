
var entity = {

	//constructor to create a new player
	player: function() {

		var body,
			
			stats =  {
				mms: 1,
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

		body = new THREE.Mesh( new THREE.BoxGeometry(10, 10, 10) , new THREE.MeshBasicMaterial({color: 0xff0000}) );

		controls = function(key) {

			if (key === hotkeys.fwd) {

				physics.updateMovment(body, stats.mms, 0, 0, stats.maxSpd);
			} else if (key === hotkeys.bwd) {

				physics.updateMovment(body, -stats.mms, 0, 0, stats.maxSpd);
			} else if (key === hotkeys.r) {

				physics.updateMovment(body, 0, 0, -stats.mms, stats.maxSpd);
			} else if (key === hotkeys.l) {
				
				physics.updateMovment(body, 0, 0, stats.mms, stats.maxSpd);
			};
		};

		//for the cunstructor
		this.body = body;
		this.stats = stats;
		this.controls = controls;
		this.hotkeys = hotkeys;

	},
};