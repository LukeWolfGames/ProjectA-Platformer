var config = {
	type: Phaser.AUTO,
	width: 800,
	height: 600,
	physics: {
		default: 'arcade',
		arcade: {
				gravity: { y: 300 },
				debug: false
		}
	},
	scene: {
		preload: preload,
		create: create,
		update: update
	}
};

var player;
var stars;
var platforms;
var cursors;

var game = new Phaser.Game(config);

function preload() {
	this.load.image('sky', 'assets/sky.png');
	this.load.image('ground', 'assets/platform.png');
	this.load.image('star', 'assets/star.png');
	this.load.image('bomb', 'assets/bomb.png');
	this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
}



function create() {
	// sky
	this.add.image(400, 300, 'sky');

	// platforms
	// grouping the platforms together
	platforms = this.physics.add.staticGroup();
	
	platforms.create(400, 568, 'ground').setScale(2).refreshBody();

	platforms.create(600, 400, 'ground');
	platforms.create(50, 250, 'ground');
	platforms.create(750, 220, 'ground');



	// adding the player sprite
	player = this.physics.add.sprite(100, 450, 'dude');

	// PLAYER PROPERTY SETTINGS
	// setting the bouncing properties for the player's jumping appropriate.
	// and setting the boundary for the player to remain within the game.
	player.setBounce(0.2);
	player.setCollideWorldBounds(true);
	
	// PLAYER ANIMATIONS
	// player left animation
	this.anims.create({
		key: 'left',
		frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
		frameRate: 10,
		repeat: -1
	});

	// player turn animation
	this.anims.create({
		key: 'turn',
		frames: [ { key: 'dude', frame: 4 } ],
		frameRate: 20
	});

	// player right animation
	this.anims.create({
		key: 'right',
		frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
		frameRate: 10,
		repeat: -1
	});

	// CREATING PLAYER CONTROLS
	cursors = this.input.keyboard.createCursorKeys();
	
	// STARS PROPERTY SETTINGS
	// creating multiple stars as a group and setting their position.
	stars = this.physics.add.group({
		key: "star",
		repeat: 11,
		setXY: { x: 12, y: 0, stepX: 70 }
	});

	stars.children.iterate(function (child) {
		child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
	});
		
	this.physics.add.collider(player, platforms);
	this.physics.add.collider(stars, platforms);

	this.physics.add.overlap(player, stars, collectStar, null, this);


	

	// setting collider for star object.	

}


function update() {
	if (cursors.left.isDown)
	{
		player.setVelocityX(-160);

		player.anims.play("left", true);
	}
	else if (cursors.right.isDown)
	{
		player.setVelocityX(160);

		player.anims.play("right", true);
	}
	else
	{
		player.setVelocityX(0);

		player.anims.play("turn");
	}

	if (cursors.up.isDown && player.body.touching.down)
	{
		player.setVelocityY(-330);
	}
}

function collectStar (player, star)
{
	star.disableBody(true, true);
}