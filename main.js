function get(id) {
	return document.getElementById(id);
}
function getDefaultSave() {
	return {
		ideas: new Decimal(10),
		thinkers: [
			"empty",
			{
				amount:new Decimal(0),
				cost:new Decimal(10),
				mult:new Decimal(1),
				bought:new Decimal(0),
				costMult:new Decimal(1.15)
			},
			{
				amount:new Decimal(0),
				cost:new Decimal(100),
				mult:new Decimal(1),
				bought:new Decimal(0),
				costMult:new Decimal(1.2)
			},
			{
				amount:new Decimal(0),
				cost:new Decimal(10000),
				mult:new Decimal(1),
				bought:new Decimal(0),
				costMult:new Decimal(1.3)
			},
			{
				amount:new Decimal(0),
				cost:new Decimal(1000000),
				mult:new Decimal(1),
				bought:new Decimal(0),
				costMult:new Decimal(1.35)
			},
			{
				amount:new Decimal(0),
				cost:new Decimal(1e9),
				mult:new Decimal(1),
				bought:new Decimal(0),
				costMult:new Decimal(1.375)
			},
			{
				amount:new Decimal(0),
				cost:new Decimal(1e11),
				mult:new Decimal(1),
				bought:new Decimal(0),
				costMult:new Decimal(1.4)
			},
			{
				amount:new Decimal(0),
				cost:new Decimal(100),
				mult:new Decimal(1),
				bought:new Decimal(0),
				costMult:new Decimal(1.41)
			},
			{
				amount:new Decimal(0),
				cost:new Decimal(1000),
				mult:new Decimal(1),
				bought:new Decimal(0),
				costMult:new Decimal(1.42)
			}
			],
		exist: new Decimal(0),
		lastTick: new Date().getTime(),
		creations: new Decimal(0),
	}
}

let player = getDefaultSave();

function gameLoop() {
	let newTime = new Date().getTime()
	let diff = (newTime - player.lastTick) / 1000;
	player.lastTick = newTime;
	produce(diff);
	update();
}

function produce(time) {
	player.ideas = player.thinkers[1].amount.times(time).add(player.ideas);
	for(let i = 1; i < 8; i++) {
		player.thinkers[i].amount = player.thinkers[i+1].amount.times(time).add(player.thinkers[i].amount);
	}
}

function update() {
	get("ideas").innerHTML = player.ideas.floor().toString();
	let unlocked7 = false;
	for(let i = 1; i <= 8; i++) {
		get("tier"+i+"Amount").innerHTML = player.thinkers[i].amount.floor().toString();
		get("tier"+i+"Mult").innerHTML = player.thinkers[i].mult.toString();
		get("tier"+i+"Cost").innerHTML = player.thinkers[i].cost.floor().toString();
		if(i <= 6) {
			if(player.creations.gte(i-1)) {
				get("tier"+i).style.display = "";
			} else {
				get("tier"+i).style.display = "none";
			}
		} else {
			if(player.exist.gte(player.thinkers[i].cost) || player.thinkers[i].amount.gt(0)) {
				get("tier"+i).style.display = "";
				unlocked7 = true;
			} else {
				get("tier"+i).style.display = "none";
			}
		}
	}
	if(unlocked7) {
		get("weakMaxAll").style.display = "";
	} else {
		get("weakMaxAll").style.display = "none";
	}
	if(existOnCreate().gte(1)) {
		get("creation").style.display = "";
		get("existOnCreate").style.display = existOnCreate().floor().toString();
	} else {
		get("creation").style.display = "none";
	}
	if(player.creations.gt(0)) {
		get("existenceTab").style.display = "";
	} else {
		get("existenceTab").style.display = "none";
	}
}

function existOnCreate() {
	return player.ideas.div(100).log2()+1;
}
function buyTier(tier) {
	if(player.ideas.gte(player.thinkers[tier].cost) && tier <= 6) {
		player.thinkers[tier].amount = player.thinkers[tier].amount.add(1);
		player.ideas = player.ideas.sub(player.thinkers[tier].cost);
		player.thinkers[tier].cost = player.thinkers[tier].cost.times(player.thinkers[tier].costMult);
	} else if(player.exist.gte(player.thinkers[tier].cost)) {
		player.thinkers[tier].amount = player.thinkers[tier].amount.add(1);
		player.exist = player.exist.sub(player.thinkers[tier].cost);
		player.thinkers[tier].cost = player.thinkers[tier].cost.times(player.thinkers[tier].costMult);
	}
}
function buyMaxTier(tier) {
	if(tier <= 6) {
		while(player.ideas.gte(player.thinkers[tier].cost)) {
			buyTier(tier);
		}
	} else {
		while(player.exist.gte(player.thinkers[tier].cost)) {
			buyTier(tier);
		}
	}
}
function creation() {
	player.ideas = new Decimal(10);
	for(let i = 1; i <= 6; i++) {
		player.thinkers[i].amount = new Decimal(0);
		player.thinkers[i].bought = new Decimal(0);
	}
	player.thinkers[1].cost = new Decimal(10);
	player.thinkers[2].cost = new Decimal(100);
	player.thinkers[3].cost = new Decimal(10000);
	player.thinkers[4].cost = new Decimal(1000000);
	player.thinkers[5].cost = new Decimal(1e9);
	player.thinkers[6].cost = new Decimal(1e11);
	
	player.thinkers[1].costMult = new Decimal(1.15);
	player.thinkers[2].costMult = new Decimal(1.2);
	player.thinkers[3].costMult = new Decimal(1.3);
	player.thinkers[4].costMult = new Decimal(1.35);
	player.thinkers[5].costMult = new Decimal(1.375);
	player.thinkers[6].costMult = new Decimal(1.4);
	player.creations = player.creations.add(1)++;
	player.exist = player.exist.add(existOnCreate());
}

function start() {
	setInterval(gameLoop, 33);
}
function showTab(tab) {
	let tabs = document.getElementsByClassName("tab");
	for(let i = 0; i < tabs.length; i++) {
		tabs[i].style.display = "none";
	}
	get(tab).style.display = "";
}
