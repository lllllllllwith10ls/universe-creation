function get(id) {
	return document.getElementById(id);
}
function getDefaultSave() {
	return {
		ideas: new Decimal(10),
		thinkers: [
			"empty",
			{
				unlocked: true,
				amount:new Decimal(0),
				cost:new Decimal(10),
				mult:new Decimal(1),
				bought:new Decimal(0),
				costMult:new Decimal(1.15),
				costScale:new Decimal(1.5),
				superCostScale:new Decimal(0.5)
			},
			{
				unlocked: false,
				amount:new Decimal(0),
				cost:new Decimal(100),
				mult:new Decimal(1),
				bought:new Decimal(0),
				costMult:new Decimal(1.2),
				costScale:new Decimal(1.5),
				superCostScale:new Decimal(0.5)
			},
			{
				unlocked: false,
				amount:new Decimal(0),
				cost:new Decimal(10000),
				mult:new Decimal(1),
				bought:new Decimal(0),
				costMult:new Decimal(1.3),
				costScale:new Decimal(1.5),
				superCostScale:new Decimal(0.5)
			},
			{
				unlocked: false,
				amount:new Decimal(0),
				cost:new Decimal(1000000),
				mult:new Decimal(1),
				bought:new Decimal(0),
				costMult:new Decimal(1.35),
				costScale:new Decimal(1.5),
				superCostScale:new Decimal(0.5)
			},
			{
				unlocked: false,
				amount:new Decimal(0),
				cost:new Decimal(1e9),
				mult:new Decimal(1),
				bought:new Decimal(0),
				costMult:new Decimal(1.375),
				costScale:new Decimal(1.5),
				superCostScale:new Decimal(0.5)
			},
			{
				unlocked: false,
				amount:new Decimal(0),
				cost:new Decimal(1e11),
				mult:new Decimal(1),
				bought:new Decimal(0),
				costMult:new Decimal(1.4),
				costScale:new Decimal(1.5),
				superCostScale:new Decimal(0.5)
			},
			{
				unlocked: false,
				amount:new Decimal(0),
				cost:new Decimal(100),
				mult:new Decimal(1),
				bought:new Decimal(0),
				costMult:new Decimal(1.41),
				costScale:new Decimal(1.5),
				superCostScale:new Decimal(0.5)
			},
			{
				unlocked: false,
				amount:new Decimal(0),
				cost:new Decimal(1000),
				mult:new Decimal(1),
				bought:new Decimal(0),
				costMult:new Decimal(1.42),
				costScale:new Decimal(1.5),
				superCostScale:new Decimal(0.5)
			}
		],
		exist: new Decimal(0),
		lastTick: new Date().getTime(),
		creations: new Decimal(0),
		upgrades: [],
		existMult: new Decimal(1),
		existMultCost: new Decimal(2),
		existMultCostMult: new Decimal(2),
		existMultCostScale: new Decimal(1.5),
		tab: "s thinkers",
		subtab: {
			existence: "s existUpgrades",
			existence: "s treeUpgrades",
		},
		things: new Decimal(0),
		creators: [
			"empty",
			{
				amount:new Decimal(0),
				cost:new Decimal(100),
				mult:new Decimal(1),
				bought:new Decimal(0),
				costMult:new Decimal(5),
				costScale:new Decimal(5),
				superCostScale:new Decimal(1.5)
			},
			{
				amount:new Decimal(0),
				cost:new Decimal(1000),
				mult:new Decimal(1),
				bought:new Decimal(0),
				costMult:new Decimal(10),
				costScale:new Decimal(5),
				superCostScale:new Decimal(1.5)
			},
			{
				amount:new Decimal(0),
				cost:new Decimal(100000),
				mult:new Decimal(1),
				bought:new Decimal(0),
				costMult:new Decimal(20),
				costScale:new Decimal(5),
				superCostScale:new Decimal(1.5)
			},
			{
				amount:new Decimal(0),
				cost:new Decimal(10000000),
				mult:new Decimal(1),
				bought:new Decimal(0),
				costMult:new Decimal(50),
				costScale:new Decimal(5),
				superCostScale:new Decimal(1.5)
			}
		],
		space: new Decimal(0),
		abstractions: new Decimal(0),
		manifolds: new Decimal(0),
		manifoldCost: new Decimal(1),
		manifoldCostMult: new Decimal(2),
		manifoldCostScale: new Decimal(2),
		manifoldCostScale2: new Decimal(2),
		manifoldMult: new Decimal(1),
		manifoldMult2: new Decimal(1),
		treeUpgrades: [],
		autos: [false,false,false,false,false,false,false,false],
		autoCs: [false,false,false,false],
		autoEm: false,
	}
}

let player = getDefaultSave();

function gameLoop() {
	let newTime = new Date().getTime()
	let diff = (newTime - player.lastTick) / 1000;
	player.lastTick = newTime;
	produce(diff);
	update();
	mults();
	autoBuyers();
}

function produce(time) {
	
	player.ideas = player.thinkers[1].amount.times(time).times(player.thinkers[1].mult).add(player.ideas);
	for(let i = 1; i < 8; i++) {
		player.thinkers[i].amount = player.thinkers[i+1].amount.times(time).times(player.thinkers[i+1].mult).add(player.thinkers[i].amount);
	}
	player.things = player.creators[1].amount.times(time).times(player.creators[1].mult).add(player.things);
	for(let i = 1; i < 4; i++) {
		player.creators[i].amount = player.creators[i+1].amount.times(time).times(player.creators[i+1].mult).add(player.creators[i].amount);
	}
}

function update() {
	get("ideas").innerHTML = format(player.ideas,true);
	let unlocked7 = false;
	for(let i = 1; i <= 8; i++) {
		get("tier"+i+"Amount").innerHTML = format(player.thinkers[i].amount,true);
		get("tier"+i+"Mult").innerHTML = format(player.thinkers[i].mult);
		get("tier"+i+"Cost").innerHTML = format(player.thinkers[i].cost,true);
		if(canBuyTier(i)) {
			get("buy1Tier"+i).className = "storebtn";
			get("buyMaxTier"+i).className = "storebtn";
		} else {
			get("buy1Tier"+i).className = "storebtnlocked";
			get("buyMaxTier"+i).className = "storebtnlocked";
		}
		if(i <= 6) {
			if(player.creations.gte(i-1)) {
				get("tier"+i).style.display = "";
				player.thinkers[i].unlocked = true;
			} else {
				get("tier"+i).style.display = "none";
				player.thinkers[i].unlocked = false;
			}

		} else {
			if((player.exist.gte(player.thinkers[i].cost) || player.thinkers[i].amount.gt(0))&& player.creations.gte(5)) {
				get("tier"+i).style.display = "";
				unlocked7 = true;
				player.thinkers[i].unlocked = true;
			} else {
				get("tier"+i).style.display = "none";
				player.thinkers[i].unlocked = false;
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
		get("existOnCreate").innerHTML = format(existOnCreate(),true);
	} else {
		get("creation").style.display = "none";
	}
	if(player.creations.gt(0)) {
		get("existenceTab").style.display = "";
		get("exist").innerHTML = format(player.exist,true);
	} else {
		get("existenceTab").style.display = "none";
	}
	if(player.upgrades.includes("s11")) {
		get("upgrade11").className = "upgradebtn upgradebought";
	} else if(canBuyUpgrade("11")) {
		get("upgrade11").className = "upgradebtn creationbtn";
	} else {
		get("upgrade11").className = "upgradebtn storebtnlocked";
	}
	
	if(player.upgrades.includes("s21")) {
		get("upgrade21").className = "upgradebtn upgradebought";
	} else if(canBuyUpgrade("21")) {
		get("upgrade21").className = "upgradebtn creationbtn";
	} else {
		get("upgrade21").className = "upgradebtn storebtnlocked";
	}
	if(canBuyUpgrade("12")) {
		get("upgrade12").className = "upgradebtn creationbtn";
	} else {
		get("upgrade12").className = "upgradebtn storebtnlocked";
	}
	get("existMult").innerHTML = format(player.existMult);
	get("existMultCost").innerHTML = format(player.existMultCost,true);
	
	if(player.upgrades.includes("s22")) {
		get("upgrade22").className = "upgradebtn upgradebought";
		get("creatorsSubtab").style.display = "";
	} else if(canBuyUpgrade("22")) {
		get("upgrade22").className = "upgradebtn creationbtn";
		get("creatorsSubtab").style.display = "none";
	} else {
		get("upgrade22").className = "upgradebtn storebtnlocked";
		get("creatorsSubtab").style.display = "none";
	}
	get("things").innerHTML = format(player.things,true);
	get("thingsMult").innerHTML = format(player.things.sqr().add(1),true);
	for(let i = 1; i <= 4; i++) {
		get("tier"+i+"CAmount").innerHTML = format(player.creators[i].amount,true);
		get("tier"+i+"CMult").innerHTML = format(player.creators[i].mult);
		get("tier"+i+"CCost").innerHTML = format(player.creators[i].cost,true);
		if(canBuyTierC(i)) {
			get("buy1Tier"+i+"C").className = "creationbtn";
			get("buyMaxTier"+i+"C").className = "creationbtn";
		} else {
			get("buy1Tier"+i+"C").className = "storebtnlocked";
			get("buyMaxTier"+i+"C").className = "storebtnlocked";
		}
	}
	if(spaceOnAbstract().gte(1)) {
		get("abstraction").style.display = "";
		get("spaceOnAbstract").innerHTML = format(spaceOnAbstract(),true);
	} else {
		get("abstraction").style.display = "none";
	}

	if(player.abstractions.gt(0)) {
		get("abstractTab").style.display = "";
		get("upgradeTreeTab").style.display = "";
		get("space").innerHTML = format(player.space,true);
	} else {
		get("abstractTab").style.display = "none";
		get("upgradeTreeTab").style.display = "none";
	}
	get("manifolds").innerHTML = format(player.manifolds,true);
	get("manifoldCost").innerHTML = format(player.manifoldCost,true);
	if(canBuyManifold()) {
		get("buyManifold").className = "storebtn";
	} else {
		get("buyManifold").className = "storebtnlocked";
	}
	if(player.treeUpgrades.includes("st11")) {
		get("st11").className = "treebtn upgradebought";
	} else if(canBuyTreeUpgrade("t11")) {
		get("st11").className = "treebtn creationbtn";
	} else {
		get("st11").className = "treebtn storebtnlocked";
	}
	if(player.treeUpgrades.includes("st21")) {
		get("st21").className = "treebtn upgradebought";
	} else if(canBuyTreeUpgrade("t21")) {
		get("st21").className = "treebtn creationbtn";
	} else {
		get("st21").className = "treebtn storebtnlocked";
	}
	if(player.treeUpgrades.includes("st22")) {
		get("st22").className = "treebtn upgradebought";
	} else if(canBuyTreeUpgrade("t22")) {
		get("st22").className = "treebtn creationbtn";
	} else {
		get("st22").className = "treebtn storebtnlocked";
	}
	if(player.treeUpgrades.includes("st31")) {
		get("st31").className = "smalltext treebtn upgradebought";
		get("autobuyersSubtab").style.display = "";
	} else if(canBuyTreeUpgrade("t31")) {
		get("st31").className = "smalltext treebtn creationbtn";
	} else {
		get("st31").className = "smalltext treebtn storebtnlocked";
	}
	resizeCanvas();
	for(let i = 0; i < player.autos.length; i++) {
		if(player.autos[i]) {
			get("toggleAuto"+(i+1)).className = "storebtn";
		} else {
			get("toggleAuto"+(i+1)).className = "storebtnlocked";
		}
	}
	for(let i = 0; i < player.autoCs.length; i++) {
		if(player.autoCs[i]) {
			get("toggleAutoC"+(i+1)).className = "creationbtn";
		} else {
			get("toggleAutoC"+(i+1)).className = "storebtnlocked";
		}
	}
	if(player.autoEm) {
		get("toggleAutoEm").className = "creationbtn";
	} else {
		get("toggleAutoEm").className = "storebtnlocked";
	}
}
function mults() {
	player.manifoldMult = new Decimal(1.2).pow(player.manifolds);
	player.manifoldMult2 = new Decimal(1.05).pow(player.manifolds.cbrt());
	if(player.treeUpgrades.includes("st22")) {
		player.manifoldMult = player.manifoldMult.pow(1.5);
		player.manifoldMult2 = player.manifoldMult2.pow(1.5);
	}
	for(let i = 1; i <= 8; i++) {
		if(player.upgrades.includes("s11")) {
			player.thinkers[i].mult = (player.manifoldMult.times(1.02)).pow(player.thinkers[i].bought);
		} else {
			player.thinkers[i].mult = (player.manifoldMult.times(1.01)).pow(player.thinkers[i].bought);
		}
		if(player.upgrades.includes("s21")) {
			player.thinkers[i].mult = player.thinkers[i].mult.times(player.creations.cbrt().plus(1));
		}
		player.thinkers[i].mult = player.thinkers[i].mult.times(player.things.sqr().add(1));
	}
	for(let i = 1; i <= 4; i++) {
		if(player.treeUpgrades.includes("st11")) {
			player.creators[i].mult = player.manifoldMult2.times(1.1).pow(player.creators[i].bought);
		} else {
			player.creators[i].mult = new Decimal(1.1).pow(player.creators[i].bought);
		}
	}
}
function existOnCreate() {
	return new Decimal(2).pow((player.ideas.add(1)).log2().div(Math.log2(100)).sub(1)).times(player.existMult);
}
function buyTier(tier) {
	if(canBuyTier(tier) && tier <= 6) {
		player.thinkers[tier].amount = player.thinkers[tier].amount.add(1);
		player.ideas = player.ideas.sub(player.thinkers[tier].cost);
		player.thinkers[tier].cost = player.thinkers[tier].cost.times(player.thinkers[tier].costMult);
		player.thinkers[tier].bought = player.thinkers[tier].bought.add(1);
		if(player.thinkers[tier].cost.gte(1e9)) {
			player.thinkers[tier].costMult = player.thinkers[tier].costMult.times(player.thinkers[tier].costScale);
			if(player.thinkers[tier].cost.gte(1e50)) {
				player.thinkers[tier].costScale = player.thinkers[tier].costScale.add(player.thinkers[tier].superCostScale);
			}
		}
	} else if(canBuyTier(tier) && tier >= 7) {
		player.thinkers[tier].amount = player.thinkers[tier].amount.add(1);
		player.exist = player.exist.sub(player.thinkers[tier].cost);
		player.thinkers[tier].cost = player.thinkers[tier].cost.times(player.thinkers[tier].costMult);
		player.thinkers[tier].bought = player.thinkers[tier].bought.add(1);
		if(player.thinkers[tier].cost.gte(1e3)) {
			player.thinkers[tier].costMult = player.thinkers[tier].costMult.times(player.thinkers[tier].costScale);
			if(player.thinkers[tier].cost.gte(1e9)) {
				player.thinkers[tier].costScale = player.thinkers[tier].costScale.add(player.thinkers[tier].superCostScale);
			}
		}
	}
}
function canBuyTier(tier) {
	if(player.ideas.gte(player.thinkers[tier].cost) && tier <= 6 && player.thinkers[tier].unlocked) {
		return true;
	} else if(player.exist.gte(player.thinkers[tier].cost) && tier > 6 && player.thinkers[tier].unlocked) {
		return true;
	} else {
		return false
	}
}
function buyMaxTier(tier) {
	if(tier <= 6) {
		while(canBuyTier(tier)) {
			buyTier(tier);
		}
	} else {
		while(canBuyTier(tier)) {
			buyTier(tier);
		}
	}
}

function maxAll(weak) {
	let j;
	if(weak) {
		j = 6;
	} else {
		j = 8;
	}
	for(let i = j; i > 0; i--) {
		buyMaxTier(i);
	}
}
function buyTierC(tier) {
	if(canBuyTierC(tier)) {
		player.creators[tier].amount = player.creators[tier].amount.add(1);
		player.exist = player.exist.sub(player.creators[tier].cost);
		player.creators[tier].cost = player.creators[tier].cost.times(player.creators[tier].costMult);
		player.creators[tier].bought = player.creators[tier].bought.add(1);
		if(player.creators[tier].cost.gte(1e9)) {
			player.creators[tier].costMult = player.creators[tier].costMult.times(player.creators[tier].costScale);
		}
		if(player.creators[tier].cost.gte(1e300)) {
			player.creators[tier].costScale = player.creators[tier].costScale.times(player.creators[tier].superCostScale);
		}
	}
}
function canBuyTierC(tier) {
	if(player.exist.gte(player.creators[tier].cost)) {
		return true;
	} else {
		return false
	}
}
function buyMaxTierC(tier) {
	while(canBuyTierC(tier)) {
		buyTierC(tier);
	}
}
function maxAllC() {
	for(let i = 4; i > 0; i--) {
		buyMaxTierC(i);
	}
}
function upgradeCost(upgrade) {
	let cost = new Decimal(0);
	switch(upgrade) {
		case "11":
			cost = new Decimal(1);
			break;
		case "12":
			cost = player.existMultCost;
			break;
		case "21":
			cost = new Decimal(10);
			break;
		case "22":
			cost = new Decimal(100);
			break;
		case "t11":
			cost = new Decimal(100);
			break;
		case "t21":
			cost = new Decimal(1e8);
			break;
		case "t22":
			cost = new Decimal(1e8);
			break;
		case "t31":
			cost = new Decimal(1e33);
			break;
	}
	return cost;
}
function upgradeUnlock(upgrade) {
	let unlock = ["none"];
	switch(upgrade) {
		case "t21":
			unlock = ["st11"];
			break;
		case "t22":
			unlock = ["st11"];
			break;
		case "t31":
			unlock = ["st21","st22"];
			break;
	}
	return unlock;
}
function canBuyUpgrade(upgrade) {
	let cost = upgradeCost(upgrade);
	
	if(player.exist.gte(cost)) {
		return true;
	}
	return false;
}

function canBuyUpgrade(upgrade) {
	let cost = upgradeCost(upgrade);
	
	if(player.exist.gte(cost)) {
		return true;
	}
	return false;
}
function canBuyTreeUpgrade(upgrade) {
	if(!player.treeUpgrades.includes("s"+upgrade)) {
		let cost = upgradeCost(upgrade);
		
		if(player.space.gte(cost) && (upgradeUnlock(upgrade).every(val => player.treeUpgrades.includes(val)) || upgradeUnlock(upgrade)[0] === "none")) {
			return true;
		}
		return false;
	}
}
function buyTreeUpgrade(upgrade) {
	if(canBuyTreeUpgrade(upgrade) && !player.treeUpgrades.includes("s"+upgrade)) {
		player.treeUpgrades.push("s"+upgrade);
		
		if(upgrade === "t21") {
			rebuyManifolds();
		}
	}
}
function buyUpgrade(upgrade) {
	if(canBuyUpgrade(upgrade) && !player.upgrades.includes("s"+upgrade)) {
		player.exist = player.exist.sub(upgradeCost(upgrade));
		if(upgrade === "12") {
			player.existMultCost = player.existMultCost.times(player.existMultCostMult);
			player.existMult = player.existMult.times(1.25);
			if(player.existMultCost.gte(1e9)) {
				player.existMultCostMult = player.existMultCostMult.times(player.existMultCostScale);
			}
		} else {
			player.upgrades.push("s"+upgrade);
		}
	}
}

function creation() {
	player.exist = player.exist.add(existOnCreate());
	player.ideas = new Decimal(10);
	for(let i = 1; i <= 6; i++) {
		player.thinkers[i].amount = new Decimal(0);
		player.thinkers[i].bought = new Decimal(0);
		player.thinkers[i].costScale = new Decimal(1.5);
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
	player.creations = player.creations.add(1);
}

function spaceOnAbstract() {
	return new Decimal(2).pow((player.exist.add(existOnCreate()).add(1)).log2().div(Math.log2(1e4)).sub(9));
}

function canBuyManifold() {
	if(player.space.gte(player.manifoldCost)) {
		return true;
	} else {
		return false
	}
}
function buyManifold(free = false) {
	if(free) {
		player.manifolds = player.manifolds.add(1);
		player.manifoldCost = player.manifoldCost.times(player.manifoldCostMult);
		if(player.manifoldCost.gte(16)) {
			if(player.treeUpgrades.includes("st21")) {
				player.manifoldCostMult = player.manifoldCostMult.times(player.manifoldCostScale.div(1.5));
			} else {
				player.manifoldCostMult = player.manifoldCostMult.times(player.manifoldCostScale);
			}
		}
		if(player.manifoldCost.gte(1e20)) {
			player.manifoldCostScale = player.manifoldCostScale.times(player.manifoldCostScale2);
		}
	} else if(canBuyManifold()) {
		player.space = player.space.sub(player.manifoldCost);
		player.manifolds = player.manifolds.add(1);
		player.manifoldCost = player.manifoldCost.times(player.manifoldCostMult);
		if(player.manifoldCost.gte(16)) {
			if(player.treeUpgrades.includes("st21")) {
				player.manifoldCostMult = player.manifoldCostMult.times(player.manifoldCostScale.div(1.5));
			} else {
				player.manifoldCostMult = player.manifoldCostMult.times(player.manifoldCostScale);
			}
		}
		if(player.manifoldCost.gte(1e20)) {
			player.manifoldCostScale = player.manifoldCostScale.times(player.manifoldCostScale2);
		}
	}
}
function rebuyManifolds() {
	let manifolds = player.manifolds;
	player.manifolds = new Decimal(0);
	player.manifoldCost = new Decimal(1);
	player.manifoldCostMult = new Decimal(2);
	player.manifoldCostScale = new Decimal(2);
	player.manifoldCostScale2 = new Decimal(2);
	player.manifoldMult = new Decimal(1);
	while(manifolds.gt(0)) {
		buyManifold(true);
		manifolds = manifolds.minus(1);
	}
}
function abstract() {
	creation();
	player.space = player.space.add(spaceOnAbstract());
	player.exist = new Decimal(0);
	for(let i = 7; i <= 8; i++) {
		player.thinkers[i].amount = new Decimal(0);
		player.thinkers[i].bought = new Decimal(0);
		player.thinkers[i].costScale = new Decimal(1.5);
	}
	for(let i = 1; i <= 4; i++) {
		player.creators[i].amount = new Decimal(0);
		player.creators[i].bought = new Decimal(0);
		player.creators[i].costScale = new Decimal(5);
	}
	player.thinkers[7].cost = new Decimal(10);
	player.thinkers[8].cost = new Decimal(100);
	player.creators[1].cost = new Decimal(100);
	player.creators[2].cost = new Decimal(1000);
	player.creators[3].cost = new Decimal(100000);
	player.creators[4].cost = new Decimal(10000000);
	
	player.thinkers[7].costMult = new Decimal(1.41);
	player.thinkers[8].costMult = new Decimal(1.42);
	player.creators[1].costMult = new Decimal(5);
	player.creators[2].costMult = new Decimal(10);
	player.creators[3].costMult = new Decimal(20);
	player.creators[4].costMult = new Decimal(50);
	player.abstractions = player.abstractions.add(1);
	player.creations = new Decimal(0);
	player.things = new Decimal(0);
	if(!player.treeUpgrades.includes("st31")) {
		player.upgrades = [];
	}
	player.existMult = new Decimal(1);
	player.existMultCost = new Decimal(2);
	player.existMultCostMult = new Decimal(2);
	player.existMultCostScale = new Decimal(1.5);
	player.subtab.existence = "s existUpgrades";
}
function toggleAuto(tier) {
	if(player.autos[tier-1]) {
		player.autos[tier-1] = false;
	} else {
		player.autos[tier-1] = true;
	}
}
function toggleAutoC(tier) {
	if(player.autoCs[tier-1]) {
		player.autoCs[tier-1] = false;
	} else {
		player.autoCs[tier-1] = true;
	}
}
function toggleAutoEm(tier) {
	if(player.autoEm) {
		player.autoEm = false;
	} else {
		player.autoEm = true;
	}
}

function autoBuyers() {
	for(let i = 0; i < player.autos.length; i++) {
		if(player.autos[i]) {
			buyMaxTier(i+1);
		}
	}
	for(let i = 0; i < player.autoCs.length; i++) {
		if(player.autoCs[i]) {
			buyMaxTierC(i+1);
		}
	}
	if(player.autoEm) {
		while(canBuyUpgrade("12")) {
			buyUpgrade("12");
		}
	}
}
function start() {
	setInterval(gameLoop, 33);
	load();
	showTab(player.tab.substr(2));
	window.addEventListener("resize", resizeCanvas);
	resizeCanvas();
}
function showTab(tab) {
	let tabs = document.getElementsByClassName("tab");
	for(let i = 0; i < tabs.length; i++) {
		tabs[i].style.display = "none";
	}
	get(tab).style.display = "";
	if(player.subtab[tab]) {
		showSubtab(player.subtab[tab].substr(2),tab);
	}
	player.tab = "s "+tab;
}
function showSubtab(subtab,tab) {
	let subtabs = document.getElementsByClassName("subtab");
	for(let i = 0; i < subtabs.length; i++) {
		subtabs[i].style.display = "none";
	}
	get(subtab).style.display = "";
	player.subtab[tab] = "s "+subtab;
}
function format(number,int=false) {
	
	if(int && number instanceof Decimal) {
		number = number.floor();
	} else if(int) {
		number = Math.floor(number);
	}
	
	let power;
	let matissa;
	let mag;
	if (number instanceof Decimal) {
		power = number.e;
		matissa = number.mantissa;
		mag = number.mag
        } else {
		matissa = number / Math.pow(10, Math.floor(Math.log10(number)));
		power = Math.floor(Math.log10(number));
        }
	
	if(power < 3) {
		if(int) {
			return (matissa*Math.pow(10,power)).toFixed(0);
		} else {
			return (matissa*Math.pow(10,power)).toFixed(2);
		}
	} if (number.layer === 0 || number.layer === 1) {
		matissa = matissa.toFixed(2);
		return matissa + "e" + power;
	} else {
		if(mag) {
			mag = mag.toFixed(2);
		}
		if (number.layer <= 5) {
			return (number.sign === -1 ? "-" : "") + "e".repeat(number.layer) + mag;
		}
		else {
			return (number.sign === -1 ? "-" : "") + "(e^" + number.layer + ")" + mag;
		}
	}
}
