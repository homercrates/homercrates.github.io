// get canvas
const cvs = document.getElementById("paddle");
const ctx = cvs.getContext("2d");

// border to canvas
cvs.style.border = "1px solid #000000";

// canvas line width
ctx.lineWidth = 3;

//img for background
const bgImg = new Image();
bgImg.src = "img/backgroundw.jpg";


// game variables and consts
const paddleWidth = 100;
const paddleHeight = 20;
const paddleMarginBottom = 50;
const ballRadius = 8;
let life = 3;
let gameOver = false;
let gameLevel = 1;
const maxLevel = 7;
let score = 0;
const scoreUnit = 10;
// left arrow pressed boolean
let leftArrow = false;
let rightArrow = false;

// make paddle
const paddle = {
    x: cvs.width/2 - paddleWidth/2,
    y: cvs.height - paddleHeight - paddleMarginBottom,
    height: paddleHeight,
    width: paddleWidth,
    dx: 5
}

// draw paddle
function drawPaddle(){
    // fill rectangle
    ctx.fillStyle = "#666666";
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
    
    // stroke
    ctx.strokeStyle = "#000000";
    ctx.strokeRect(paddle.x, paddle.y, paddle.width, paddle.height);

}

// move paddle
document.addEventListener("keydown", function(event) {
    if(event.keyCode == 37) {
        leftArrow = true;
    } else if (event.keyCode == 39) {
        rightArrow = true;
    }
});

document.addEventListener("keyup", function(event) {
    if(event.keyCode == 37) {
        leftArrow = false;
    } else if (event.keyCode == 39) {
        rightArrow = false;
    }
});

function movePaddle() {
    if(leftArrow && paddle.x > 0) {
        paddle.x -= paddle.dx;
    } else if (rightArrow && paddle.x + paddle.width < cvs.width) {
        paddle.x += paddle.dx;
    }
};

//mkae ball
const ball = {
    x: cvs.width/2,
    y: paddle.y - ballRadius,
    radius: ballRadius,
    speed: 4,
    dx: 3 * (Math.random() * 2 - 1),
    dy: -3,
}

// draw ball
function drawBall() {
    ctx.beginPath();

    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI*2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();

    ctx.strokeStyle = '#666666';
    ctx.stroke();

    ctx.closePath();


}

// move the ball now 
function moveBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;
};


// ball and wall collision
function ballAndWallCollision() {
    if(ball.x + ball.radius > cvs.width || ball.x - ball.radius < 0) {
        ball.dx = -ball.dx;
    }
    if(ball.y - ball.radius < 0) {
        ball.dy = -ball.dy;
    }
    if(ball.y > cvs.height) {
        life--;
        resetBall();
    }
}

// ball and paddle collision
function ballAndPaddleCollision() {
    if(ball.x < paddle.x + paddle.width 
        && ball.x > paddle.x 
        && ball.y < paddle.y + paddle.height 
        && ball.y > paddle.y
        )  {
            // where does ball hit paddle
            let collidePoint = ball.x - (paddle.x + paddle.width / 2);
            
            // normalize values
            collidePoint = collidePoint / (paddle.width / 2);

            // calc angle of ball
            let angle = collidePoint * (Math.PI / 3);

            ball.dx = ball.speed * Math.sin(angle);
            ball.dy = - ball.speed * Math.cos(angle);
    }
};

// reset ball
function resetBall() {
    ball.x = cvs.width/2;
    ball.y = paddle.y - ballRadius;
    ball.dx = 3 * (Math.random() * 2 - 1);
    ball.dy = -3;
}

// bricks object
const brick = {
    bricks: [],
    row: 1,
    column: 5,
    width: 55,
    height: 20,
    offSetLeft: 20,
    offSetTop: 20,
    marginTop: 40,
    fillColor: '#ffffff',
    strokeColor: '#hhhhhh',
}

// make and place the bricks
function createBricks() {
    for(let c = 0; c < brick.column; c++) {
        brick.bricks[c] = [];
        for(let r = 0; r < brick.row; r++) {
            brick.bricks[c][r] = {
                x: (c * (brick.width + brick.offSetLeft)) + brick.offSetLeft,
                y: (r * (brick.height + brick.offSetTop)) + brick.offSetTop + brick.marginTop,
                status: 1,
            };
        }
    }
}
createBricks();

// draw bricks to canvas
function drawBricks() {
    for(let c = 0; c < brick.column; c++) {
        for(let r = 0; r < brick.row; r++) {
            if(brick.bricks[c][r].status == 1) {
                ctx.beginPath();

                ctx.fillStyle = brick.fillColor;
                ctx.rect(
                    brick.bricks[c][r].x,
                    brick.bricks[c][r].y,
                    brick.width,
                    brick.height
                    );
                ctx.fill();

                ctx.strokeStyle = brick.strokeColor;
                ctx.strokeRect(
                    brick.bricks[c][r].x,
                    brick.bricks[c][r].y,
                    brick.width,
                    brick.height,
                    );
                ctx.stroke();

                ctx.closePath();
            }
        }
    }
}

// brick collision
function brickCollision() {
    for(let c = 0; c < brick.column; c++) {
        for(let r = 0; r < brick.row; r++) {
            let b = brick.bricks[c][r];

            if(b.status == 1) {
                if(ball.x + ball.radius > b.x 
                    && ball.x - ball.radius < b.x + brick.width
                    && ball.y + ball.radius > b.y
                    && ball.y - ball.radius < b.y + brick.height
                    ) {
                        ball.dy = - ball.dy;
                        b.status = 0;
                        score += scoreUnit;
                    }
            }
        }
    }
}

// game level increase
function levelUp() {
    let isLevelDone = true;
    for(let c = 0; c < brick.column; c++) {
        for(let r = 0; r < brick.row; r++) {
            let bbrick = brick.bricks[c][r].status;
            isLevelDone = isLevelDone && !bbrick;
        }
    }

    if(isLevelDone) {
        if(gameLevel >= maxLevel) {
            gameOver = true;
            return;
        }

        brick.row++;
        createBricks();
        drawBricks();
        ball.speed += 0.5;
        resetBall();

        gameLevel++;
    }
}

// game over lose
function lose() {
    if(life == 0) {
        gameOver = true;
    }
}

// draw game stats  score, lives, level
function drawGameStats(text, value, valueX, valueY, img, imgX, imgY, imgWidth, imgHeight){
    ctx.fillStyle = "#ffffff";
    ctx.font = "25px Germania One";
    ctx.fillText(text + value, valueX, valueY);
    //ctx.drawImage(img, imgX, imgY, imgWidth, imgHeight);
}

function update() {
    movePaddle();
    moveBall();
    ballAndWallCollision();
    ballAndPaddleCollision();
    brickCollision();
    levelUp();
    lose();
    //handleMouseMove();
}


// draw it   function
function draw() {
    ctx.drawImage(bgImg, 0, 0);
    

    drawPaddle();
    drawBall();
    drawBricks();
    // semi circle test
    //drawSemiCircle();


    const textScore = "Score ";
    const textLives = "Lives ";
    const textLevel = "Lvl "


    // draw score
   drawGameStats(textScore, score, 35, 25);
    
    // draw lives
   drawGameStats(textLives, life, cvs.width - 90, 25);

    // draw game level
   drawGameStats(textLevel, gameLevel, cvs.width / 2 - 20, 25);

}

//draw paddle
drawPaddle();



// game loop draw draw draw
function gameLoop() {
    draw();
    update();

    // if game is NOT over reuqest animation frame
    if(!gameOver) {
        requestAnimationFrame(gameLoop);
    }
    
}
gameLoop();