//function to create snake object, with location and speed
function Snake() {
    this.x = (width / 2) - scl;
    this.y = (height / 2) - scl * 2;
    this.xspeed = 0;
    this.yspeed = 0;
    this.total = 0; //to track the lenght of snake. If the snakes eat the food, total should go up to 1. total++
    this.lastScore = 0;
    this.tail = [];//an array object for the tail
    this.eatText = [];

    //receives the position where the food is
    this.eat = function (pos) {
        //creates a distance variable to where the snake is in relation to where the food is
        var d = dist(this.x, this.y, pos.x, pos.y);
        //tells me wheter or not the snake reaches the food
        if (d < scl) {
            navigator.vibrate(10);
            this.total += 1;
            this.lastPos = pos;
            this.eatText.push({ text: "Minister of Health", opacity: 1, x: this.x, y: this.y });
            return true;
        } else {
            return false;
        }
    }

    //directions function receives two values x and y  
    this.dir = function (x, y) {
        this.xspeed = x * moveSpeed;
        this.yspeed = y * moveSpeed;
    }

    //function to kill the snake when it touches its own body
    this.death = function () {
        for (var i = 0; i < this.tail.length; i++) {//loop throught every spot in the tail (not inc. head)
            var pos = this.tail[i];
            var d = dist(this.x, this.y, pos.x, pos.y);
            if (d < 1) {
                this.die();
            }
        }
        if (this.x > width || this.y > height || this.x < 0 || this.y < 0) {
            this.die();
        }
    }

    this.die = function () {
        gameState = "GAME_OVER"
        this.lastScore = this.total;
        const bestScore = Math.max(localStorage.getItem("best"), this.total);
        localStorage.setItem("best", bestScore)
        this.total = 0;
        this.tail = [];
        gameoverSFX.play();


        this.x = 0;
        this.y = 0;
        this.xspeed = 0;
        this.yspeed = 0;

    }

    //function that updates object's moves based on current lcoation + speed.   
    this.update = function () {
        if (this.total !== this.tail.length) {
            console.log("NEW")
            this.tail.push(createVector(this.x, this.y))
        }
        //If the total is the same size as array length, meaning no food has been eaten, then shift everything over
        if (this.total === this.tail.length) {
            for (var i = 0; i < this.tail.length - 1; i++) { //as snakes move shift spots down getting the new spot at the end of the array
                this.tail[i] = this.tail[i + 1];//as it moves shift everything over by one
            }
        }
        this.tail[this.total - 1] = createVector(this.x, this.y);//when I am done moving I want the last spot to create Vector on the tail equals to current location of snake

        this.x = this.x + this.xspeed * scl;
        this.y = this.y + this.yspeed * scl;

        this.eatText.forEach(e => {
            fill(255, 0, 100, 255 * e.opacity);
            textSize(18);
            text(e.text, e.x, e.y);
            e.opacity -= 0.15;
            e.y -= 2;
            if (e.opacity <= 0) {
                this.eatText.shift()
            }
        })
    }

    this.show = function () {
        fill(255);
        //draw the tail on current location

        for (var i = 0; i < this.tail.length; i++) {
            image(faces.scottFace, this.tail[i].x, this.tail[i].y, scl, scl);
            noFill();
            rect(this.tail[i].x, this.tail[i].y, scl, scl);
        }

        //draw the face on current location
        fill(255);
        image(faces.scottFace, this.x, this.y, scl, scl);
        noFill();
        rect(this.x, this.y, scl, scl);
    }
}  