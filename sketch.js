var mario, mario_running, mario_collided;
var bg, bgImage;
var brickGroup, brickImage;
var coinGroup, coinImage;
var coinScore=0;
var obstacleGroup;
var playState='play';
var mariodie;
var restartimg;

function preload(){
    // this function is used to upload images and sound files
    mario_running=loadAnimation("images/mar1.png","images/mar2.png","images/mar3.png","images/mar4.png","images/mar5.png","images/mar6.png","images/mar7.png")
    bgImage=loadImage("images/bgnew.jpg")
    brickImage=loadImage("images/brick.png")
    coinImage=loadAnimation("images/con1.png","images/con2.png","images/con3.png","images/con4.png","images/con5.png","images/con6.png")
    coinSound= loadSound("sounds/coinSound.mp3")
    jumpSound= loadSound("sounds/jump.mp3")
    mushObstacleImage= loadAnimation("images/mush1.png","images/mush2.png","images/mush3.png","images/mush4.png","images/mush5.png","images/mush6.png")
    turObstacleImage= loadAnimation("images/tur1.png","images/tur2.png","images/tur3.png","images/tur4.png","images/tur5.png")
    dieSound= loadSound("sounds/dieSound.mp3")
    keyObstacleImage= loadAnimation("images/keyObs1.png","images/keyObs2.png","images/keyObs3.png","images/keyObs4.png","images/keyObs5.png")
    mariodie=loadAnimation("images/dead.png")
    restartimg=loadImage("images/restart.png")
}

function setup() {

    createCanvas(1000, 600);
    // creating the background
    bg=createSprite(580,300)
    bg.addImage(bgImage)
    bg.scale=0.5
    bg.velocityX=-6

    // creating mario
    mario=createSprite(200,505,20,50)
    mario.addAnimation("running",mario_running)
    mario.scale=0.3
    mario.addAnimation("die",mariodie)

    // creating ground
    ground=createSprite(200,585,600,10)
    ground.visible=false;
    // creating groups
    brickGroup=new Group()
    coinGroup=new Group()
    obstacleGroup= new Group()
    restart=createSprite(500,300)
    restart.addImage(restartimg)
    restart.visible=false
}

function draw() {

    if(playState==='play'){
    // for scrolling background
    mario.setCollider("rectangle",0,0,200,500)
    mario.scale=0.3;
    bg.velocityX=-6
    if(bg.x<100){
        bg.x=bg.width/4
    }
    // using space for mario jump
    if(keyDown("space")){
        jumpSound.play()
        mario.velocityY = -16
    }
    // preventing mario from going outwards in X direction
    if(mario.x<200){
        mario.x=200
    }
    // preventing mario from going outwards in Y direction
    if(mario.y<50){
        mario.y=50
    }
    mario.velocityY=mario.velocityY + 0.5 // gravity for mario
    // colliding mario with ground
    mario.collide(ground)
    // calling the generate bricks function
    generateBricks()
    // colliding mario with bricks
    for(var i=0;i<(brickGroup).length;i++){
        var temp=(brickGroup).get(i)
        if(temp.isTouching(mario)){
            mario.collide(temp)
        }
    }

    // calling generate obstacle function
    generateObstacle();
    if(obstacleGroup.isTouching(mario)){
        dieSound.play()
        playState='end'
    }
    // calling generate coins
    generateCoin()
    // destroying the coins when mario is touching
    for(var i=0;i<(coinGroup).length;i++){
        var temp=(coinGroup).get(i)
        if(temp.isTouching(mario)){
            coinSound.play()
            coinScore++;
            temp.destroy()
            temp=null
        }
    }
    }
    else if(playState==='end'){
        mario.velocityX=0;
        mario.velocityY=0;
        bg.velocityX=0;
        coinGroup.setVelocityXEach(0);
        obstacleGroup.setVelocityXEach(0);
        brickGroup.setVelocityXEach(0);
        coinGroup.setLifetimeEach(-1);
        obstacleGroup.setLifetimeEach(-1);
        brickGroup.setLifetimeEach(-1);
        mario.changeAnimation("die",mariodie)
        mario.scale=0.4;
        mario.setCollider("rectangle",0,0,300,10);
        mario.y=550;
        restart.visible=true
        if(mousePressedOver(restart)){
            restartGame()
        }
    }
    drawSprites()
    // no. of coins collected 
    textSize(20)
    fill("brown")
    text("Coins Collected:"+coinScore,500,50)
}

// function to generate bricks 
function generateBricks(){
    if(frameCount%70==0){
        var brick=createSprite(1200,random(50,450),40,10)
        brick.addImage(brickImage)
        brick.scale=0.5
        brick.velocityX=-5
        brick.lifetime=250
        brickGroup.add(brick)
    }
}

// function to generate coins
function generateCoin(){
    if(frameCount%50==0){
        var coin=createSprite(1200,120,40,10)
        coin.addAnimation("coins",coinImage)
        coin.y=Math.round(random(80,350))
        coin.scale=0.1
        coin.velocityX=-3
        coin.lifetime=1200
        coinGroup.add(coin)        
    }
}

// function to generate obstacles
function generateObstacle(){
    if(frameCount%100==0){
        var obstacle=createSprite(1200,545,10,40)
        obstacle.velocityX=-4;
        obstacle.scale=0.2;
        var rand=Math.round(random(1,3))
        switch(rand){
            case 1 :
                obstacle.addAnimation("mush",mushObstacleImage)
                break;
            case 2 :
                obstacle.addAnimation("tur",turObstacleImage)
                break;
            case 3 :
                obstacle.addAnimation("keyObs",keyObstacleImage)
                obstacle.scale=0.5
                break;
            default :
                break;
        }
         obstacle.lifetime=300
         obstacleGroup.add(obstacle)
    }
}

function restartGame(){
    restart.visible=false
    playState="play";
    obstacleGroup.destroyEach();
    coinGroup.destroyEach();
    brickGroup.destroyEach();
    mario.changeAnimation("running",mario_running);
    coinScore=0;
}

    
