function save(player) {
	localStorage.setItem(btoa('universe_creation'), JSON.stringify(player, function(k, v) { return (v === Infinity) ? "Infinity" : v; }));
}
function load() {
	let save = JSON.parse(localStorage.getItem(btoa('universe_creation')));
	cleanSave(save,getDefaultSave());
	startInterval();
}

function cleanSave(thing,defaultThing) {
	for(let i in defualtThing) {
		if(thing[i] === undefined) {
			thing[i] = defaultThing[i];
		}
		if(typeof thing[i] === "object") {
			cleanSave(thing,defaultThing);
		}
		if(typeof thing[i] === "string" && thing[i][0] !== "s") {
			thing[i] = new Decimal(thing[i]);
		}
	}
}
