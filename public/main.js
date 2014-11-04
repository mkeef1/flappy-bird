var game = new Phaser.Game(800, 490, Phaser.AUTO, 'flappy-bird');

var mainState = {
  preload: function(){
    game.stage.backgroundColor = '#71c5cf';
    //game.load.image('bird', 'assets/bird.png');
    game.load.image('pipe', 'assets/pipe.png');
    game.load.spritesheet('bird', 'assets/megaman.png', 93.5, 144);
    game.load.audio('jump', 'assets/jump.wav');

  },


  create: function(){
    game.physics.startSystem(Phaser.Physics.ARCADE);
    this.bird = this.game.add.sprite(100, 245, 'bird');
    this.bird.scale.setTo(0.4, 0.4);
    game.physics.arcade.enable(this.bird);
    this.bird.animations.add('jump', [1, 2, 3, 4], 20, false);
    this.bird.body.gravity.y = 1000;
    var spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    spaceKey.onDown.add(this.jump, this);
    this.pipes = game.add.group();
    this.pipes.enableBody = true;
    this.pipes.createMultiple(20, 'pipe');
    this.timer = game.time.events.loop(1500, this.addRowOfPipes, this);
    this.score = 0;
    this.labelScore = game.add.text(20, 20, "0", {font: "30px Arial", fill: "#ffffff"});
    this.bird.anchor.setTo(-0.2, 0.5);
    this.jumpSound = game.add.audio('jump');

  },

  addOnePipe: function(x, y){
    var pipe =  this.pipes.getFirstDead();
    pipe.reset(x, y);
    pipe.body.velocity.x = -200;
    pipe.checkWorldBounds = true;
    pipe.outOfBoundsKill = true;
  },

  addRowOfPipes: function(){
    var hole = Math.floor(Math.random() * 5) + 2;
    for(var i = 0; i < 8; i++)
      if(i != hole && i != hole + 1)
        this.addOnePipe(800, i * 60 + 10);
    this.score += 1;
    this.labelScore.text = this.score;
  },

  update: function(){
    if(this.bird.inWorld === false)
      this.hitPipe();
    game.physics.arcade.overlap(this.bird, this.pipes, this.resartGame, null, this);
    if(this.bird.angle < 20)
      this.bird.angle += 1;
  },

  hitPipe: function(){
    if(this.bird.alive === false)
      return;
    this.bird.alive = false;
    game.time.events.remove(this.timer);
    this.pipes.forEachAlive(function(p){
      p.body.velocity.x = 0;
    }, this);
  },

  jump: function(){
    if(this.bird.alive === false)
      return;
    this.bird.body.velocity.y = -300;
    this.bird.animations.play('jump');
    var animation = game.add.tween(this.bird);
    animation.to({angle: -20}, 100);
    animation.start();
    this.jumpSound.play();
  },

  resartGame: function(){
    game.state.start('main');
  },

};
game.state.add('main', mainState);
game.state.start('main');
