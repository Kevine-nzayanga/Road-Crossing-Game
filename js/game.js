// create a new scene
let gameScene = new Phaser.Scene('Game');

gameScene.init = function(){
  this.playerSPeed =3;

  // enemy speed
  this.enemyMinSpeed=2;
  this.enemyMaxSpeed=3;

  
  this.enemyMinY = 80;
  this.enemyMaxY= 280;

  this.isTerminating = false;
}

gameScene.preload = function() {
  this.load.image('background', 'assets/background.png');
  this.load.image('player', 'assets/player.png');
  this.load.image('enemy', 'assets/dragon.png');
  this.load.image('goal', 'assets/treasure.png');

}


// called once after the preload ends
gameScene.create = function() {
  // create bg sprite
  let bg = this.add.sprite(0, 0, 'background');

  // change the origin to the top-left corner
  bg.setOrigin(0,0);

  this.player = this.add.sprite (40,this.sys.game.config.height/2, 'player');
  this.player.setScale(0.5);


  this.goal = this.add.sprite (this.sys.game.config.width-80, this.sys.game.config.height/2, 'goal').setScale(0.6);

  // create enemy group
  this.enemies = this.add.group(
    {key:'enemy',
    repeat:4,
    setXY:{
      x:90,
      y:100,
      stepX:100,
      stepY:20
    }
    });
    

console.log(this.enemies.getChildren());

// change the scale of the group
Phaser.Actions.ScaleXY (this.enemies.getChildren(),-0.4, -0.4);

// set flipX enemy speed 
Phaser.Actions.Call(this.enemies.getChildren(), function(enemy){
enemy.flipX = true;

// set enemy speed 
let dir = Math.random() < 0.5 ? 1 : -1;
let speed = this.enemyMinSpeed + Math.random() * (this.enemyMaxSpeed - this.enemyMinSpeed);
enemy.speed = dir * speed;

},this);

};


gameScene.update = function() {

  // dont execute if we are terminating
  if(this.isTerminating) return;

  if(this.input.activePointer.isDown){
    this.player.x +=this.playerSPeed
  }

  let playerRect= this.player.getBounds();
  let treasureRect = this.goal.getBounds();

    // making sure the player doesnt go beyond the borders

  if(Phaser.Geom.Intersects.RectangleToRectangle(playerRect, treasureRect)){
    console.log('reached goal!');
    return this.gameOver();
  }




// get enemies
  let enemies = this.enemies.getChildren();
  let numEnmenies = enemies.length;

  for (let i = 0; i < numEnmenies; i++) {
    enemies[i].y +=enemies[i].speed

  // check we havent passed the minimum and maximum y
  let conditionUp= enemies[i].speed <0 && enemies[i].y <= this.enemyMinY;
  let conditionDown = enemies[i].speed >0 && enemies[i].y >= this.enemyMaxY;


  if(conditionUp || conditionDown) {
    enemies[i].speed *=-1;
  }



let enemyRect = enemies[i].getBounds()

if(Phaser.Geom.Intersects.RectangleToRectangle(playerRect, enemyRect)){
  console.log('game over!');
  return this.gameOver();
}

  };


  };

  gameScene.gameOver = function(){

    this.isTerminating= true;

    this.cameras.main.shake(500);

    this.cameras.main.on('camerashakecomplete', function (camera, effect){
      // fade out after shaking
      this.cameras.main.fade(500);

    },this);

    this.cameras.main.on ('camerafadeoutcomplete', function(camera,effect){
    this.scene.restart();
  },this);


  }



// set the configuration of the game
let config = {
  type: Phaser.AUTO, // Phaser will use WebGL if available, if not it will use Canvas
  width: 640,
  height: 360,
  scene: gameScene
};

// create a new game, pass the configuration
let game = new Phaser.Game(config);
