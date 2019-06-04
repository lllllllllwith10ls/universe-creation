let canvas = get("treeCanvas");
let ctx = canvas.getContext("2d");
function resizeCanvas() {
    canvas.width = 0;
    canvas.height = 0;
    canvas.width = document.body.scrollWidth;
    canvas.height = document.body.scrollHeight;
    drawTree();
}
function drawTreeBranch(name1, name2) {
    if (get("upgradeTree").style.display === "none") return
    
    let start = get("s"+name1).getBoundingClientRect();
    let end = get("s"+name2).getBoundingClientRect();
    let x1 = start.left + (start.width / 2) + (document.documentElement.scrollLeft || document.body.scrollLeft);
    let y1 = start.top + (start.height / 2) + (document.documentElement.scrollTop || document.body.scrollTop);
    let x2 = end.left + (end.width / 2) + (document.documentElement.scrollLeft || document.body.scrollLeft);
    let y2 = end.top + (end.height / 2) + (document.documentElement.scrollTop || document.body.scrollTop);
    ctx.lineWidth=15;
    ctx.beginPath();

    if(player.treeUpgrades.includes("s"+name1) && player.treeUpgrades.includes("s"+name2)) {
        ctx.strokeStyle = "#5AC467";
    } else if (canBuyTreeUpgrade(name1) || canBuyTreeUpgrade(name2)) {
        ctx.strokeStyle = "#443284";
    } else {
        ctx.strokeStyle = "#000055";
    }
    
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}
function drawTree() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawTreeBranch("t11", "t21");
    drawTreeBranch("t11", "t22");
    drawTreeBranch("t21", "t31");
    drawTreeBranch("t22", "t31");
    
}
