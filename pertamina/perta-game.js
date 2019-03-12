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
        families: ['Finger Paint']
    }

};

var timer;
var score;

function preload() {

    game.load.spritesheet('button', 'assets/buttons/button_sprite_sheet.png', 193, 71);
    game.load.image('button1', 'assets/perta/placeholder/pertamax-turbo-button.png');
    game.load.image('button2', 'assets/perta/placeholder/solar-button.png');
    game.load.image('button3', 'assets/perta/placeholder/pertamax-button.png');
    game.load.image('button4', 'assets/perta/placeholder/pertalite-button.png');
    game.load.image('buttonMaintenance', 'assets/perta/placeholder/maintenance-button.png');
    game.load.image('buttonMaintenanceCancel', 'assets/perta/placeholder/maintenance-button-cancel.png');
    game.load.image('background', 'assets/perta/proto.jpg');
    game.load.image('ship1', 'assets/perta/placeholder/pertamax-turbo.png');
    game.load.image('ship2', 'assets/perta/placeholder/solar.png');
    game.load.image('ship3', 'assets/perta/placeholder/pertamax.png');
    game.load.image('ship4', 'assets/perta/placeholder/pertalite.png');
    game.load.image('ship5', 'assets/perta/placeholder/pertamax-turbo-solar.png');
    game.load.image('ship6', 'assets/perta/placeholder/pertamax-turbo-pertamax.png');
    game.load.image('ship7', 'assets/perta/placeholder/pertamax-turbo-pertalite.png');
    game.load.image('ship8', 'assets/perta/placeholder/solar-pertamax.png');
    game.load.image('ship9', 'assets/perta/placeholder/solar-pertalite.png');
    game.load.image('ship10', 'assets/perta/placeholder/pertamax-pertalite.png');
    game.load.image('panel', 'assets/perta/placeholder/panel.png');
    game.load.image('icon1', 'assets/perta/placeholder/pertamax-turbo-icon.png');
    game.load.image('icon2', 'assets/perta/placeholder/solar-icon.png');
    game.load.image('icon3', 'assets/perta/placeholder/pertamax-icon.png');
    game.load.image('icon4', 'assets/perta/placeholder/pertalite-icon.png');
    game.load.image('icon4', 'assets/perta/placeholder/pertalite-icon.png');
    game.load.image('icon5', 'assets/perta/placeholder/pertamax-turbo-solar-icon.png');
    game.load.image('icon6', 'assets/perta/placeholder/pertamax-turbo-pertamax-icon.png');
    game.load.image('icon7', 'assets/perta/placeholder/pertamax-turbo-pertalite-icon.png');
    game.load.image('icon8', 'assets/perta/placeholder/solar-pertamax-icon.png');
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
var buttonGroup;
var firstQueue;
var secondQueue;
var thirdQueue;
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

function create() {
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

    background = game.add.tileSprite(0, 0, 972, 564, 'background');

    var rand = chooseShip();
    spawnShip(rand);


    buttonMaintenance = game.add.button(15, game.world.height - 135, 'buttonMaintenance', maintenance, this);
    buttonMaintenance.scale.setTo(0.75, 0.75);

    button1 = game.add.button(120, game.world.height - 135, 'button1', buttonOneClick, this);
    button1.scale.setTo(0.75, 0.75);
    button2 = game.add.button(120 + (205 * 1), game.world.height - 135, 'button2', buttonTwoClick, this);
    button2.scale.setTo(0.75, 0.75);
    button3 = game.add.button(120 + (205 * 2), game.world.height - 135, 'button3', buttonThreeClick, this);
    button3.scale.setTo(0.75, 0.75);
    button4 = game.add.button(120 + (205 * 3), game.world.height - 135, 'button4', buttonFourClick, this);
    button4.scale.setTo(0.75, 0.75);

    mask1 = game.add.graphics(0, 0);
    mask1.beginFill(0xffffff);
    mask1.drawRect(button1.x, button1.y, button1.width, button1.height);

    mask2 = game.add.graphics(0, 0);
    mask2.beginFill(0xffffff);
    mask2.drawRect(button2.x, button2.y, button2.width, button2.height);

    mask3 = game.add.graphics(0, 0);
    mask3.beginFill(0xffffff);
    mask3.drawRect(button3.x, button3.y, button3.width, button3.height);

    mask4 = game.add.graphics(0, 0);
    mask4.beginFill(0xffffff);
    mask4.drawRect(button4.x, button4.y, button4.width, button4.height);

    button1.mask = mask1;
    button2.mask = mask2;
    button3.mask = mask3;
    button4.mask = mask4;

    var scorePanel = game.add.sprite(30, 40, 'panel');
    scorePanel.scale.setTo(0.35, 0.35);

    var timerPanel = game.add.sprite(30, 100, 'panel');
    timerPanel.scale.setTo(0.35, 0.35);

    var orderPanel = game.add.sprite(750, 60, 'panel');
    orderPanel.scale.setTo(0.5, 0.75);

    buttonGroup = game.add.group();
    buttonGroup.add(buttonMaintenance);
    buttonGroup.add(button1);
    buttonGroup.add(button2);
    buttonGroup.add(button3);
    buttonGroup.add(button4);

    initQueue();
}

function createText() {
    //  You can either set the tab size in the style object:
    var style = {
        font: "28px Finger Paint",
        fill: "#fff",
        tabs: [150, 150, 200]
    };

    timer = game.add.text(64, 100, "00:00", style);
    timer.setShadow(-3, 3, 'rgba(0,0,0,0.5)', 0);

    score = game.add.text(64, 40, "0", style);
    score.setShadow(-3, 3, 'rgba(0,0,0,0.5)', 0);
}

function processComplete() {
    tween = game.add.tween(ship).to({
        x: -1500
    }, 5000, Phaser.Easing.Quartic.In, true);
    tween.onComplete.add(onCompleteMoveShip, this);
}

function maintenance() {
    isMaintenance = !isMaintenance;

    console.log("maintenance : " + isMaintenance);
}

function moveMask(mask, value) {
    var maskMove = game.add.tween(mask).to({ y: value }, 500, Phaser.Easing.Linear.None, true);
}

function buttonOneClick() {
    if (buttonEnable && !isMaintenance && health1 > 0 && !btn1Maintenance) {

        if (requirement1 == 1 && !status1) {
            status1 = true;
            health1--;

            moveMask(mask1, mask1.y + (button1.height / maxHealth))
        } else if (requirement2 == 1 && !status2) {
            status2 = true;
            health1--;

            moveMask(mask1, mask1.y + (button1.height / maxHealth))
        }

        checkRequirements();
    } else if(isMaintenance) {
        btn1Maintenance = true;
        var repair = game.add.tween(mask1).to({ y:mask1.y - ((button1.height / maxHealth) * (maxHealth - health1)) }, 5000 * (maxHealth - health1), Phaser.Easing.Linear.None, true);
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
            status1 = true;
            health2--;

            moveMask(mask2, mask2.y + (button2.height / maxHealth));
        } else if (requirement2 == 2 && !status2) {
            status2 = true;
            health2--;

            moveMask(mask2, mask2.y + (button2.height / maxHealth));
        }

        checkRequirements();
    } else if(isMaintenance) {
        btn2Maintenance = true;
        var repair = game.add.tween(mask2).to({ y:mask2.y - ((button2.height / maxHealth) * (maxHealth - health2)) }, 5000 * (maxHealth - health2), Phaser.Easing.Linear.None, true);
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
            status1 = true;
            health3--;

            moveMask(mask3, mask3.y + (button3.height / maxHealth));
        } else if (requirement2 == 3 && !status2) {
            status2 = true;
            health3--;

            moveMask(mask3, mask3.y + (button3.height / maxHealth));
        }

        checkRequirements();
    } else if(isMaintenance) {
        btn3Maintenance = true;
        var repair = game.add.tween(mask3).to({ y: mask3.y - ((button3.height / maxHealth) * (maxHealth - health3)) }, 5000 * (maxHealth - health3), Phaser.Easing.Linear.None, true);
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
            status1 = true;
            health4--;

            moveMask(mask4, mask4.y + (button4.height / maxHealth));
        } else if (requirement2 == 4 && !status2) {
            status2 = true;
            health4--;

            moveMask(mask4, mask4.y + (button4.height / maxHealth));
        }

        checkRequirements();
    } else if(isMaintenance) {
        console.log("maintenance button 4");
        btn4Maintenance = true;
        var repair = game.add.tween(mask4).to({ y: mask4.y - ((button4.height / maxHealth) * (maxHealth - health4)) }, 5000 * (maxHealth - health4), Phaser.Easing.Linear.None, true);
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
    ship = game.add.sprite(1500, game.world.centerY - 100, 'ship' + shipType);
    currentQueue = shipType;
    setRequirements(shipType);
    tween = game.add.tween(ship).to({
        x: game.world.centerX - 256
    }, 3000, Phaser.Easing.Quartic.Out, true);
    tween.onComplete.add(onCompleteMoveShipMid);
    buttonEnable = false;
}

function onCompleteMoveShip() {
    ship.x = 1500;
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
    firstQueue = game.add.sprite(775, 90, "icon" + queue[0]);
    firstQueue.scale.setTo(0.5, 0.5);
    secondQueue = game.add.sprite(825, 90, "icon" + queue[1]);
    secondQueue.scale.setTo(0.5, 0.5);
    thirdQueue = game.add.sprite(875, 90, "icon" + queue[2]);
    thirdQueue.scale.setTo(0.5, 0.5);
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