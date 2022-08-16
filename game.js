const ranArr = (arr) => arr[Math.floor(Math.random() * arr.length)];
let img, lastScore, startImg;
let faces = {};
const social = document.querySelector("#social");
let started = false;
let gameState = "START";
let moveSpeed = 1;
let lastDirection = "right";
let ministers;

function preload() {
    faces.scottFace = loadImage('./img/scott.png');
    ministers = [
        { title: "Minister of Health", img: loadImage('./img/greg.png') },
        { title: "Minister of Finance", img: loadImage('./img/birmo.png') },
        { title: "Minister of Home Affairs", img: loadImage('./img/andrews.png') },
        { title: "Minister of Foreign Affairs", img: loadImage('./img/payne.png') },
        { title: "Minister of Defence", img: loadImage('./img/dutton.png') },
        { title: "Treasurer", img: loadImage('./img/fryd.png') }
    ];
    gameOverScreen = loadImage('./img/sadscomo.png');
    collectSFX = loadSound('./sfx/collect.wav');
    swipeIcon = loadImage('./img/swipet.gif');
    gameoverSFX = loadSound("./sfx/scomo.wav");
    pixelFont = loadFont('assets/VCR.ttf');
}

// 1. Press Play at the top
// 2. Click on dark grey canvas (before snake hit the wall)
// 3. Use key arrows to move snake

var s;
let gridSize;
let scl;
var food;

function setup() {
    const w = Math.min(1000, window.innerWidth);
    gridSize = w < 1000 ? 8 : 15;
    console.log(gridSize)
    const h = Math.ceil((window.innerHeight) / gridSize) * gridSize;
    scl = w / gridSize;
    const cnv = createCanvas(w, h);
    cnv.parent("container");
    s = new Snake();
    frameRate(9);
    food = createVector(random(width), random(height));
    pickLocation();
    cnv.mouseClicked(changeState);
}

function changeState() {
    if (gameState === "GAME_OVER") {
        gameState = "START";
        return;
    }
    if (gameState !== "PLAY") {
        gameState = "PLAY";
    }
}

//function to store snake's location on the grid
//floor calculates the closest int value that is less than or equal to the value of the parameter.
function pickLocation() {
    const ranArr = items => items[Math.floor(Math.random() * items.length)];

    var cols = floor(width / scl);
    var rows = floor(height / scl);
    const x = floor(random(cols));
    const y = floor(random(rows));
    food = createVector(x, y);//this ensure the food is in the grid aligned with snake
    food.mult(scl);//to expand it back out
    const minister = ranArr(ministers);
    food.img = minister.img;
    food.title = minister.title;

}

function draw() {
    background(51);
    noStroke();
    if (gameState === "START") {
        pickLocation();
        const textHeight = 30;
        social.style.display = "none";
        const size = 50;
        background(51);
        fill('#ED225D');
        textFont(pixelFont);
        textSize(36);
        textAlign(CENTER);
        text('CLICK TO START!', (width / 2), 50);
        textSize(18);
        text('Help Scott Morrison secretly steal', (width / 2), 50 + (textHeight * 2));
        text('as many portfolios as possible.', (width / 2), 50 + (textHeight * 3));
        text("Be careful not to get caught and", (width / 2), 50 + (textHeight * 4));
        text("trip over yourself!", (width / 2), 50 + (textHeight * 5));
        image(swipeIcon, (width - size) / 2, (height - size) / 2, size, size);
        text('Swipe to move', (width / 2), height / 2 + size + 20);
        textAlign(LEFT);
        s.show();
    }


    if (gameState === "PLAY") {
        //if snake eat food, pick location
        if (s.eat(food)) {
            s.update();
            pickLocation();
        }
        s.death();
        s.update();
        s.show();
        //drawing snake food
        fill(255, 0, 100);
        image(food.img, food.x, food.y, scl, scl);
        noFill();
        rect(food.x, food.y, scl, scl);
    }


    if (gameState === "GAME_OVER") {
        const textHeight = 36;
        background(51);
        image(gameOverScreen, 0, 0, width, height)
        fill('#ED225D');
        textAlign(CENTER)
        textFont(pixelFont);
        textSize(36);
        text('BUSTED!', (width / 2), 50);
        textSize(25);
        text(`You stole ${s.lastScore} portfolios.`, (width / 2), 50 + (textHeight * 1));
        textSize(25);
        let record = parseInt(localStorage.getItem("best")) || 0;
        text(`Your best is ${record}.`, (width / 2), 50 + (textHeight * 2));
        social.style.top = `${50 + (textHeight * 3)}px`
        social.style.display = "block";
        social.querySelector(".tweet").href = `https://twitter.com/intent/tweet?url=https%3A%2F%2Fflappyguy.com&text=I helped Scott Morrison steal ${record} portfolios%21&hashtags=ScomoSnake`

        // let a = createA('http://p5js.org/', 'this is a link');
        // a.position((width / 2), 50 + (textHeight * 3));
        // console.log(a)
    }

}

function keyPressed() {
    changeState();
    if (keyCode === UP_ARROW) {
        changeDirection("up")
    } else if (keyCode === DOWN_ARROW) {
        changeDirection("down")
    } else if (keyCode === RIGHT_ARROW) {
        changeDirection("right")
    } else if (keyCode === LEFT_ARROW) {
        changeDirection("left")
    }
}


function changeDirection(direction) {
    navigator.vibrate(10);
    if (!s) {
        return;
    }
    const moveDir = () => {
        switch (direction) {
            case "up": return lastDirection !== "down" ? s.dir(0, -1) : null;
            case "down": return lastDirection !== "up" ? s.dir(0, 1) : null;
            case "left": return lastDirection !== "right" ? s.dir(-1, 0) : null;
            case "right": return lastDirection !== "left" ? s.dir(1, 0) : null;
        }
    }
    moveDir();
    lastDirection = direction;
}

// const UP_KEY = document.querySelector(".up").onclick = function () { changeDirection("up") }
// const DOWN_KEY = document.querySelector(".down").onclick = function () { changeDirection("down") }
// const LEFT_KEY = document.querySelector(".left").onclick = function () { changeDirection("left") }
// const RIGHT_KEY = document.querySelector(".right").onclick = function () { changeDirection("right") }


// SWIPE CONTROLS
const root = document.querySelector('body');
const touchStart = { x: 0, y: 0 };

root.addEventListener('touchstart', handleTouchStart, false);
root.addEventListener('touchend', handleTouchEnd, false);

function handleTouchStart(e) {
    touchStart.x = e.changedTouches[0].screenX;
    touchStart.y = e.changedTouches[0].screenY;
}

function handleTouchEnd(e) {
    const dX = e.changedTouches[0].screenX - touchStart.x;
    const dY = e.changedTouches[0].screenY - touchStart.y;
    getDirection(dX, dY);
}

function getDirection(dX, dY) {
    if (dX === 0 && dY === 0) return 'TOUCH';
    changeState();
    if (Math.abs(dX) > Math.abs(dY)) {
        return dX > 0 ? changeDirection("right") : changeDirection("left");
    } else {
        return dY > 0 ? changeDirection("down") : changeDirection("up");
    }
}