function get(id) {
	return document.getElementById(id);
}
function getDefaultSave() {
	return {
		matter: 0,
		nanites: 1,
		naniteCost: 10,
		int: 0,
		lastTick: new Date().getTime(),
		escapes: 0,
	}
}
