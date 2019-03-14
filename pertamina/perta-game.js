var game = new Phaser.Game(972, 564, Phaser.AUTO, 'phaser-example', {
    preload: preload,
    create: create
});

WebFontConfig = {

    //  'active' means all requested fonts have finished loading
    //  We set a 1 second delay before calling 'createText'.
    //  For some reason if we don't the browser cannot render the text the first time it's created.
    active: function () {
        game.time.events.add(Phaser.Timer.SECOND, createText, this);
    },

    //  The Google Fonts we want to load (specify as many as you like in the array)
    google: {
        families: ['Dosis:800']
    }

};

var timer;
var scoreText;

function preload() {
    game.load.image('button1', 'assets/perta/perta-01-up.png');
    game.load.image('button2', 'assets/perta/perta-02-up.png');
    game.load.image('button3', 'assets/perta/perta-03-up.png');
    game.load.image('button4', 'assets/perta/perta-04-up.png');
    game.load.image('button1down', 'assets/perta/perta-01-down@3x.png');
    game.load.image('button2down', 'assets/perta/perta-02-down@3x.png');
    game.load.image('button3down', 'assets/perta/perta-03-down@3x.png');
    game.load.image('button4down', 'assets/perta/perta-04-down@3x.png');
    game.load.image('buttonMaintenance', 'assets/perta/placeholder/maintenance-button.png');
    game.load.image('buttonMaintenanceCancel', 'assets/perta/placeholder/maintenance-button-cancel.png');
    game.load.image('background', 'assets/perta/bg.png');
    game.load.image('ship', 'assets/perta/kapal.png');
    game.load.image('flag1', 'assets/perta/flag-01.png');
    game.load.image('flag2', 'assets/perta/flag-02.png');
    game.load.image('flag3', 'assets/perta/flag-03.png');
    game.load.image('flag4', 'assets/perta/flag-04.png');
    game.load.image('flag5', 'assets/perta/flag-01-2.png');
    game.load.image('flag6', 'assets/perta/flag-02-2.png');
    game.load.image('flag7', 'assets/perta/flag-03-2.png');
    game.load.image('flag8', 'assets/perta/flag-04-2.png');
    game.load.image('scorePanel', 'assets/perta/box-score@3x.png');
    game.load.image('timerPanel', 'assets/perta/box-time@3x.png');
    game.load.image('hose1', 'assets/perta/selang-01@3x.png');
    game.load.image('hose2', 'assets/perta/selang-02@3x.png');
    game.load.image('hose3', 'assets/perta/selang-03@3x.png');
    game.load.image('hose4', 'assets/perta/selang-04@3x.png');
    game.load.image('panel', 'assets/perta/box-antrian@3x.png');
    game.load.image('icon1', 'assets/perta/siluet-01-a.png');
    game.load.image('icon2', 'assets/perta/siluet-02-a.png');
    game.load.image('icon3', 'assets/perta/siluet-03-a.png');
    game.load.image('icon4', 'assets/perta/siluet-04-a.png');
    game.load.image('icon5', 'assets/perta/siluet-01-b.png');
    game.load.image('icon6', 'assets/perta/siluet-02-b.png');
    game.load.image('icon7', 'assets/perta/siluet-03-b.png');
    game.load.image('icon8', 'assets/perta/siluet-04-b.png');
    game.load.image('icon9', 'assets/perta/placeholder/solar-pertalite-icon.png');
    game.load.image('icon10', 'assets/perta/placeholder/pertamax-pertalite-icon.png');

    game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');


}

var button1;
var button2;
var button3;
var button4;
var buttonCancelMaintenance
var buttonMaintenance;
var background;
var ship;
var tween;
var currentQueue;
var requirement1;
var requirement2;
var status1, status2;
var buttonEnable;
var health1, health2, health3, health4;
var maxHealth;
var mask1, mask2, mask3, mask4;
var isMaintenance;
var btn1Maintenance, btn2Maintenance, btn3Maintenance, btn4Maintenance;
var hose1, hose2, hose3, hose4;
var uiGroup, gameGroup, hoseGroup;
var titleText;
var flag1, flag2;

var startTime = new Date();

var totalTime = 120;
var timeElapsed = 0;
var score = 0;
var shipCount = 0;

var titles

function create() {
    totalTime = 120;
    timeElapsed = 0;
    score = 0;
    shipCount;
    titles = ["Pemula","Ngerti Maen","Mulai Bisaan","Boleh Dipuji","Awas Keringetan","Jago Dikit","Jago Dikit +1","Jago Banyak","Pemain Serius","Pemain Veteran","Pejuang Tangguh","Calon Juara","Juara Kelas","Sarjana IPK 4","Petugas Beneran","Jempol Emas","Pantas Dikeceng","Tebar Pesona","Idol Komplek","Raja Minyak","Jelmaan Si Toha","Udahan Woy Mainnya"]

    maxHealth = 5;
    health1 = maxHealth;
    health2 = maxHealth;
    health3 = maxHealth;
    health4 = maxHealth;

    btn1Maintenance = false;
    btn2Maintenance = false;
    btn3Maintenance = false;
    btn4Maintenance = false;

    isMaintenance = false;

    game.stage.backgroundColor = '#182d3b';

    background = game.add.sprite(0, 0, 'background');
    background.width = 972;
    background.height = 564;

    gameGroup = game.add.group();
    uiGroup = game.add.group();
    hoseGroup = game.add.group();

    var rand = chooseShip();
    spawnShip(rand);

    // buttonMaintenance = game.add.button(15, game.world.height - 135, 'buttonMaintenance', maintenance, this);
    // buttonMaintenance.scale.setTo(0.75, 0.75);

    button1 = game.add.button(20, game.world.height - 120, 'button1', buttonOneClick, this);
    button1.anchor.y = 0;
    button1.anchor.x = 0;
    button1.onInputUp.add(function() {
        changeButtonSprite(button1, 'button1');
    });
    button1.onInputDown.add(function() {
        changeButtonSprite(button1, 'button1down');
    });
    button1.width = 205;
    button1.height = 120;
    button2 = game.add.button(20 + (250), game.world.height - 120, 'button2', buttonTwoClick, this);
    button2.anchor.y = 0;
    button2.anchor.x = 0;
    button2.onInputUp.add(function() {
        changeButtonSprite(button2, 'button2');
    });
    button2.onInputDown.add(function() {
        changeButtonSprite(button2, 'button2down');
    });
    button1.width = 205;
    button1.height = 120;
    button3 = game.add.button(game.world.width - 260, game.world.height - 120, 'button3', buttonThreeClick, this);
    button3.anchor.y = 0;
    button3.anchor.x = 1;
    button3.onInputUp.add(function() {
        changeButtonSprite(button3, 'button3');
    });
    button3.onInputDown.add(function() {
        changeButtonSprite(button3, 'button3down');
    });
    button3.width = 205;
    button3.height = 120;
    button4 = game.add.button(game.world.width - 20, game.world.height - 120, 'button4', buttonFourClick, this);
    button4.anchor.y = 0;
    button4.anchor.x = 1;
    button4.onInputUp.add(function() {
        changeButtonSprite(button4, 'button4');
    });
    button4.onInputDown.add(function() {
        changeButtonSprite(button4, 'button4down');
    });
    button4.width = 205;
    button4.height = 120;
    // button2 = game.add.button(120 + (205 * 1), game.world.height - 135, 'button2', buttonTwoClick, this);
    // button3 = game.add.button(120 + (205 * 2), game.world.height - 135, 'button3', buttonThreeClick, this);
    // button4 = game.add.button(120 + (205 * 3), game.world.height - 135, 'button4', buttonFourClick, this);

    // mask1 = game.add.graphics(0, 0);
    // mask1.beginFill(0xffffff);
    // mask1.drawRect(button1.x, button1.y, button1.width, button1.height);

    // mask2 = game.add.graphics(0, 0);
    // mask2.beginFill(0xffffff);
    // mask2.drawRect(button2.x, button2.y, button2.width, button2.height);

    // mask3 = game.add.graphics(0, 0);
    // mask3.beginFill(0xffffff);
    // mask3.drawRect(button3.x, button3.y, button3.width, button3.height);

    // mask4 = game.add.graphics(0, 0);
    // mask4.beginFill(0xffffff);
    // mask4.drawRect(button4.x, button4.y, button4.width, button4.height);

    // button1.mask = mask1;
    // button2.mask = mask2;
    // button3.mask = mask3;
    // button4.mask = mask4;

    hose1 = game.add.sprite(255, -100, 'hose1');
    hose1.width = 61;
    hose1.height = 223;

    hose2 = game.add.sprite(367.5, -100, 'hose2');
    hose2.width = 61;
    hose2.height = 223;

    hose3 = game.add.sprite(486, -100, 'hose3');
    hose3.width = 61;
    hose3.height = 223;

    hose4 = game.add.sprite(605, -100, 'hose4');
    hose4.width = 61;
    hose4.height = 223;

    var scorePanel = game.add.sprite(23, 15, 'scorePanel');
    scorePanel.scale.setTo(0.35, 0.35);

    var timerPanel = game.add.sprite(23, 85, 'timerPanel');
    timerPanel.scale.setTo(0.35, 0.35);

    var orderPanel = game.add.sprite(game.world.width - 13, 21.5, 'panel');
    orderPanel.width = 210;
    orderPanel.height = 120.5;
    orderPanel.anchor.x = 1;

    hoseGroup.add(hose1);
    hoseGroup.add(hose2);
    hoseGroup.add(hose3);
    hoseGroup.add(hose4);

    // uiGroup.add(buttonMaintenance);
    uiGroup.add(button1);
    uiGroup.add(button2);
    uiGroup.add(button3);
    uiGroup.add(button4);
    // uiGroup.add(mask1);
    // uiGroup.add(mask2);
    // uiGroup.add(mask3);
    // uiGroup.add(mask4);
    uiGroup.add(scorePanel);
    uiGroup.add(timerPanel);
    uiGroup.add(orderPanel);
    game.world.bringToTop(uiGroup);

    initQueue();
}

function changeButtonSprite(btn, sprite) {
    btn.loadTexture(sprite);
    btn.width = 205;
    btn.height = 120;
}

function createText() {
    //  You can either set the tab size in the style object:
    var style = {
        font: "28px Dosis",
        fill: "#fff",
        tabs: [150, 150, 200]
    };
    var scoreStyle = {
        font: "Dosis",
        fontWeight: "900",
        fontSize: "30px",
        fill: "#299bea",
        align: "right"
    };
    var timerStyle = {
        font: "Dosis",
        fontWeight: "900",
        fontSize: "30px",
        fill: "#e94836",
        align: "right"
    };

    timer = game.add.text(175, 100, "00:00", timerStyle);
    timer.anchor.x = 1;

    scoreText = game.add.text(175, 30, "0", scoreStyle);
    scoreText.anchor.x = 1;

    titleText = game.add.text(2500, game.world.centerY, "RAJA MINYAK", style);
    // titleText = titles[0];

    uiGroup.add(timer);
    uiGroup.add(scoreText);
    uiGroup.add(titleText);

    startTime = new Date();

	var gameTimer = game.time.events.loop(100, function(){
		updateTimer();
	});
}

function showTitle(index) {
    titleText.x = 1000;
    titleText.anchor.x = 0.5;
    titleText.anchor.y = 0.5;

    if(index < titles.length) {
        titleText.text = titles[index];
    } else {
        titleText.text = titles[titles.length - 1];
    }

    var titleTween = game.add.tween(titleText).to({
        x: game.world.centerX
    }, 1000, Phaser.Easing.Cubic.Out);

    var titleHideTween = game.add.tween(titleText).to({
        x: -1000
    }, 1000, Phaser.Easing.Cubic.In, 2000);

    titleTween.chain(titleHideTween);
    titleTween.start();
}

function updateTimer() {

    var currentTime = new Date();
    var timeDifference = startTime.getTime() - currentTime.getTime();

    //Time elapsed in seconds
    timeElapsed = Math.abs(timeDifference / 1000);

    //Time remaining in seconds
    var timeRemaining = totalTime - timeElapsed;

    //Convert seconds into minutes and seconds
    var minutes = Math.floor(timeRemaining / 60);
    var seconds = Math.floor(timeRemaining) - (60 * minutes);

    //Display minutes, add a 0 to the start if less than 10
    var result = (minutes < 10) ? "0" + minutes : minutes;

    //Display seconds, add a 0 to the start if less than 10
    result += (seconds < 10) ? ":0" + seconds : ":" + seconds;

    timer.text = result;
}

function updateScore() {
    scoreText.text = score;
}

function processComplete() {
    tween = game.add.tween(ship).to({
        x: -ship.width
    }, 2500, Phaser.Easing.Quadratic.In, true, 500);
    tween.onComplete.add(onCompleteMoveShip, this);
}

function maintenance() {
    isMaintenance = !isMaintenance;

    console.log("maintenance : " + isMaintenance);
}

function moveMask(mask, value) {
    var maskMove = game.add.tween(mask).to({
        y: value
    }, 500, Phaser.Easing.Linear.None, true);
}

function moveHose1(hose) {
    var hoseTween = game.add.tween(hose).to({
        y: 0
    }, 1000, Phaser.Easing.Linear.None, true);
    // hoseTween.onComplete.add(checkRequirements);
    hoseTween.onComplete.add(function () {
        moveBackHose(hose);
        status1 = true;
        checkRequirements();
    }, this);
}

function moveHose2(hose) {
    var hoseTween = game.add.tween(hose).to({
        y: 0
    }, 1000, Phaser.Easing.Linear.None, true);
    // hoseTween.onComplete.add(checkRequirements);
    hoseTween.onComplete.add(function () {
        moveBackHose(hose);
        status2 = true;
        checkRequirements();
    }, this);
}

function moveBackHose(hose) {
    var hoseBackTween = game.add.tween(hose).to({
        y: -100
    }, 1000, Phaser.Easing.Linear.None, true, 500);
    // hoseBackTween.onComplete.add();
}

function buttonOneClick() {
    if (buttonEnable && !isMaintenance && health1 > 0 && !btn1Maintenance) {

        if (requirement1 == 1 && !status1) {
            // status1 = true;
            // health1--;

            // moveMask(mask1, mask1.y + (button1.height / maxHealth))
            moveHose1(hose1);
        } else if (requirement2 == 1 && !status2) {
            // status2 = true;
            // health1--;

            // moveMask(mask1, mask1.y + (button1.height / maxHealth))
            moveHose2(hose1);
        } else if(requirement1 != 1 && requirement2 != 1) {
            score -= 50;

            updateScore();
        }

        // moveHose(hose1);
    } else if (isMaintenance) {
        btn1Maintenance = true;
        var repair = game.add.tween(mask1).to({
            y: mask1.y - ((button1.height / maxHealth) * (maxHealth - health1))
        }, 5000 * (maxHealth - health1), Phaser.Easing.Linear.None, true);
        repair.onComplete.add(repairButton1);
    }
}

function repairButton1() {
    health1 = maxHealth;
    btn1Maintenance = false;
}

function buttonTwoClick() {
    if (buttonEnable && !isMaintenance && health2 > 0 && !btn2Maintenance) {

        if (requirement1 == 2 && !status1) {
            // status1 = true;
            // health2--;

            // moveMask(mask2, mask2.y + (button2.height / maxHealth));
            moveHose1(hose2);
        } else if (requirement2 == 2 && !status2) {
            // status2 = true;
            // health2--;

            // moveMask(mask2, mask2.y + (button2.height / maxHealth));
            moveHose2(hose2);
        } else if(requirement1 != 2 && requirement2 != 2) {
            score -= 50;

            updateScore();
        }

        // moveHose(hose2);
    } else if (isMaintenance) {
        btn2Maintenance = true;
        var repair = game.add.tween(mask2).to({
            y: mask2.y - ((button2.height / maxHealth) * (maxHealth - health2))
        }, 5000 * (maxHealth - health2), Phaser.Easing.Linear.None, true);
        repair.onComplete.add(repairButton2);
    }
}

function repairButton2() {
    health2 = maxHealth;
    btn2Maintenance = false;
}

function buttonThreeClick() {
    if (buttonEnable && !isMaintenance && health3 > 0 && !btn3Maintenance) {

        if (requirement1 == 3 && !status1) {
            // status1 = true;
            // health3--;

            // moveMask(mask3, mask3.y + (button3.height / maxHealth));
            moveHose1(hose3);
        } else if (requirement2 == 3 && !status2) {
            // status2 = true;
            // health3--;

            // moveMask(mask3, mask3.y + (button3.height / maxHealth));
            moveHose2(hose3);
        } else if(requirement1 != 3 && requirement2 != 3) {
            score -= 50;

            updateScore();
        }

        // moveHose(hose3);
    } else if (isMaintenance) {
        btn3Maintenance = true;
        var repair = game.add.tween(mask3).to({
            y: mask3.y - ((button3.height / maxHealth) * (maxHealth - health3))
        }, 5000 * (maxHealth - health3), Phaser.Easing.Linear.None, true);
        repair.onComplete.add(repairButton3);
    }
}

function repairButton3() {
    health3 = maxHealth;
    btn3Maintenance = false;
}

function buttonFourClick() {
    if (buttonEnable && !isMaintenance && health4 > 0 && !btn4Maintenance) {

        if (requirement1 == 4 && !status1) {
            // status1 = true;
            // health4--;

            // moveMask(mask4, mask4.y + (button4.height / maxHealth));
            moveHose1(hose4);
        } else if (requirement2 == 4 && !status2) {
            // status2 = true;
            // health4--;

            // moveMask(mask4, mask4.y + (button4.height / maxHealth));
            moveHose2(hose4);
        } else if(requirement1 != 4 && requirement2 != 4) {
            score -= 50;

            updateScore();
        }

        // moveHose(hose4);
    } else if (isMaintenance) {
        console.log("maintenance button 4");
        btn4Maintenance = true;
        var repair = game.add.tween(mask4).to({
            y: mask4.y - ((button4.height / maxHealth) * (maxHealth - health4))
        }, 5000 * (maxHealth - health4), Phaser.Easing.Linear.None, true);
        repair.onComplete.add(repairButton4);
    }
}

function repairButton4() {
    health4 = maxHealth;
    btn4Maintenance = false;
}

function spawnShip(shipType) {
    if (ship != null) {
        ship.destroy();
    }
    ship = game.add.sprite(game.world.width, game.world.centerY - 130, 'ship');
    ship.width = 760;
    ship.height = 316;
    currentQueue = shipType;
    setRequirements(shipType);
    drawFlag();
    tween = game.add.tween(ship).to({
        x: game.world.centerX - 384
    }, 2000, Phaser.Easing.Quadratic.Out, true, 1000);
    tween.onComplete.add(onCompleteMoveShipMid);
    buttonEnable = false;

    gameGroup.add(ship);
    game.world.bringToTop(gameGroup);
    game.world.bringToTop(uiGroup);
}

function drawFlag() {
    var reqs = getRequirement(currentQueue);
    var req2 = reqs[0] + 4;

    if(reqs.length > 1) {
        req2 = reqs[1];
    }

    // flag1 = game.add.sprite(game.world.width, game.world.centerY - 130, 'flag' + reqs[0]);
    // flag2 = game.add.sprite(game.world.width, game.world.centerY - 130, 'flag' + req2);
    flag1 = game.add.sprite(84, 0, 'flag' + reqs[0]);
    flag2 = game.add.sprite(84, 0, 'flag' + req2);

    ship.addChild(flag1);
    ship.addChild(flag2);
}

function onCompleteMoveShip() {
    ship.x = 972;
    nextQueue();
}

function onCompleteMoveShipMid() {
    buttonEnable = true;
}

function checkRequirements() {
    if (status1 && status2) {
        processComplete();
        status1 = false;
        status2 = false;
        buttonEnable = false;

        totalTime += 5;
        score += 100;
        shipCount++;

        updateScore();

        if(shipCount % 5 == 0) {
            showTitle(shipCount / 5);
        }
    }
}

var queue;

function initQueue() {
    var rand = chooseShip();
    var one = rand;
    rand = chooseShip();
    var two = rand;
    rand = chooseShip();
    var three = rand;

    var first = getType(one);
    var second = getType(two);
    var third = getType(three);
    queue = [one, two, three];

    drawQueue();
}

function nextQueue() {

    spawnShip(queue[0]);
    queue[0] = queue[1];
    queue[1] = queue[2];
    queue[2] = chooseShip();
    drawQueue();
}

function drawQueue() {
    var x = 795;

    var reqs1, req2, i = 0;

    for (let i = 0; i < 3; i++) {
        reqs1 = getRequirement(queue[i]);
        game.add.sprite(x, 70, "icon" + reqs1[0]);
        req2 = reqs1[0] + 4;
        if(reqs1.length > 1)
            req2 = reqs1[1];

        game.add.sprite(x - 23, 76, "icon" + req2);
        x += 57.5;

    }



    // reqs1 = getRequirement(queue[1]);
    // game.add.sprite(x, 70, "icon" + reqs1[0]);
    // req2 = reqs1[0] + 4;
    // if(reqs1.length > 1)
    //     req2 = reqs1[1];

    // game.add.sprite(x - 23, 76, "icon" + req2);

    // x += 57.5;

    // reqs1 = getRequirement(queue[2]);
    // game.add.sprite(x, 70, "icon" + reqs1[0]);
    // req2 = reqs1[0] + 4;
    // if(reqs1.length > 1)
    //     req2 = reqs1[1];

    // game.add.sprite(x - 23, 76, "icon" + req2);
}

function chooseShip() {
    return Math.floor(Math.random() * 10) + 1;
}

function setRequirements(shipType) {
    requirement1 = 0;
    requirement2 = 0;
    status1 = false;
    status2 = false;

    if (shipType == 1) {
        requirement1 = 1;
        status2 = true;
    } else if (shipType == 2) {
        requirement1 = 2;
        status2 = true;
    } else if (shipType == 3) {
        requirement1 = 3;
        status2 = true;
    } else if (shipType == 4) {
        requirement1 = 4;
        status2 = true;
    } else if (shipType == 5) {
        requirement1 = 1;
        requirement2 = 2;
    } else if (shipType == 6) {
        requirement1 = 1;
        requirement2 = 3;
    } else if (shipType == 7) {
        requirement1 = 1;
        requirement2 = 4;
    } else if (shipType == 8) {
        requirement1 = 2;
        requirement2 = 3;
    } else if (shipType == 9) {
        requirement1 = 2;
        requirement2 = 4;
    } else if (shipType == 10) {
        requirement1 = 3;
        requirement2 = 4;
    }
}

function getRequirement(shipType) {
    var reqs;
    if (shipType == 1) {
        reqs = [1]
    } else if (shipType == 2) {
        reqs = [2];
    } else if (shipType == 3) {
        reqs = [3];
    } else if (shipType == 4) {
        reqs = [4];
    } else if (shipType == 5) {
        reqs = [1, 6];
    } else if (shipType == 6) {
        reqs = [1, 7];
    } else if (shipType == 7) {
        reqs = [1, 8];
    } else if (shipType == 8) {
        reqs = [2, 7];
    } else if (shipType == 9) {
        reqs = [2, 8];
    } else if (shipType == 10) {
        reqs = [3, 8];
    }

    return reqs;
}

function getType(num) {
    var name;
    if (num == 0)
        name = "1";
    else if (num == 1)
        name = "2";
    else if (num == 2)
        name = "3";
    else if (num == 3)
        name = "4";

    return name;
}

// content :
// 1. pertamax turbo
// 2. solar
// 3. pertamax
// 4. pertalite
// 5. 1 & 2
// 6. 1 & 3
// 7. 1 & 4
// 8. 2 & 3
// 9. 2 & 4
//10. 3 & 4