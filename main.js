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
				costMult:new Decimal(1.15),
				costScale:new Decimal(1.5),
				superCostScale:new Decimal(0.5)
			},
			{
				amount:new Decimal(0),
				cost:new Decimal(100),
				mult:new Decimal(1),
				bought:new Decimal(0),
				costMult:new Decimal(1.2),
				costScale:new Decimal(1.5),
				superCostScale:new Decimal(0.5)
			},
			{
				amount:new Decimal(0),
				cost:new Decimal(10000),
				mult:new Decimal(1),
				bought:new Decimal(0),
				costMult:new Decimal(1.3),
				costScale:new Decimal(1.5),
				superCostScale:new Decimal(0.5)
			},
			{
				amount:new Decimal(0),
				cost:new Decimal(1000000),
				mult:new Decimal(1),
				bought:new Decimal(0),
				costMult:new Decimal(1.35),
				costScale:new Decimal(1.5),
				superCostScale:new Decimal(0.5)
			},
			{
				amount:new Decimal(0),
				cost:new Decimal(1e9),
				mult:new Decimal(1),
				bought:new Decimal(0),
				costMult:new Decimal(1.375),
				costScale:new Decimal(1.5),
				superCostScale:new Decimal(0.5)
			},
			{
				amount:new Decimal(0),
				cost:new Decimal(1e11),
				mult:new Decimal(1),
				bought:new Decimal(0),
				costMult:new Decimal(1.4),
				costScale:new Decimal(1.5),
				superCostScale:new Decimal(0.5)
			},
			{
				amount:new Decimal(0),
				cost:new Decimal(100),
				mult:new Decimal(1),
				bought:new Decimal(0),
				costMult:new Decimal(1.41),
				costScale:new Decimal(1.5),
				superCostScale:new Decimal(0.5)
			},
			{
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
		tab: "s thinkers",
		subtab: {
			existence: "s existUpgrades",
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
				costScale:new Decimal(5)
			},
			{
				amount:new Decimal(0),
				cost:new Decimal(1000),
				mult:new Decimal(1),
				bought:new Decimal(0),
				costMult:new Decimal(10),
				costScale:new Decimal(5)
			},
			{
				amount:new Decimal(0),
				cost:new Decimal(100000),
				mult:new Decimal(1),
				bought:new Decimal(0),
				costMult:new Decimal(20),
				costScale:new Decimal(5)
			},
			{
				amount:new Decimal(0),
				cost:new Decimal(10000000),
				mult:new Decimal(1),
				bought:new Decimal(0),
				costMult:new Decimal(50),
				costScale:new Decimal(5)
			}
		],
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
			} else {
				get("tier"+i).style.display = "none";
			}
		} else {
			if((player.exist.gte(player.thinkers[i].cost) || player.thinkers[i].amount.gt(0))&& player.creations.gte(5)) {
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
}
function mults() {
	for(let i = 1; i <= 8; i++) {
		if(player.upgrades.includes("s11")) {
			player.thinkers[i].mult = new Decimal(1.02).pow(player.thinkers[i].bought);
		} else {
			player.thinkers[i].mult = new Decimal(1.01).pow(player.thinkers[i].bought);
		}
		if(player.upgrades.includes("s21")) {
			player.thinkers[i].mult = player.thinkers[i].mult.times(player.creations.cbrt());
		}
		player.thinkers[i].mult = player.thinkers[i].mult.times(player.things.sqr().add(1));
	}
	for(let i = 1; i <= 4; i++) {
		player.creators[i].mult = new Decimal(1.1).pow(player.creators[i].bought);
	}
}
function existOnCreate() {
	return player.ideas.div(100).log2().add(1).times(player.existMult);
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
				player.thinkers[tier].costMult = player.thinkers[tier].costMult.times(player.thinkers[tier].costScale);
				player.thinkers[tier].costScale = player.thinkers[tier].costMult.add(player.thinkers[tier].superCostScale);
			}
		}
	} else if(canBuyTier(tier) && tier >= 7) {
		player.thinkers[tier].amount = player.thinkers[tier].amount.add(1);
		player.exist = player.exist.sub(player.thinkers[tier].cost);
		player.thinkers[tier].cost = player.thinkers[tier].cost.times(player.thinkers[tier].costMult);
		player.thinkers[tier].bought = player.thinkers[tier].bought.add(1);
		if(player.thinkers[tier].cost.gte(1e3)) {
			player.thinkers[tier].costMult = player.thinkers[tier].costMult.times(1.5);
			if(player.thinkers[tier].cost.gte(1e9)) {
				player.thinkers[tier].costMult = player.thinkers[tier].costMult.times(player.thinkers[tier].costScale);
				player.thinkers[tier].costScale = player.thinkers[tier].costMult.add(player.thinkers[tier].superCostScale);
			}
		}
	}
}
function canBuyTier(tier) {
	if(player.ideas.gte(player.thinkers[tier].cost) && tier <= 6) {
		return true;
	} else if(player.exist.gte(player.thinkers[tier].cost) && tier > 6) {
		return true;
	} else {
		return false
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
	}
	return cost;
}
function canBuyUpgrade(upgrade) {
	let cost = upgradeCost(upgrade);
	
	if(player.exist.gte(cost)) {
		return true;
	}
	return false;
}
function buyUpgrade(upgrade) {
	if(canBuyUpgrade(upgrade) && !player.upgrades.includes("s"+upgrade)) {
		player.exist = player.exist.sub(upgradeCost(upgrade));
		if(upgrade === "12") {
			player.existMultCost = player.existMultCost.times(2);
			player.existMult = player.existMult.times(1.25);
			
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

function start() {
	setInterval(gameLoop, 33);
	load();
	showTab(player.tab.substr(2));
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
