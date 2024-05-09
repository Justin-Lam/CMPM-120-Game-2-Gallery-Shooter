class Game extends Phaser.Scene
{
	#gameObjects = {sprites: {}, managers: {}, texts: {}};
	#score = 0;
	#scoreIncreaseAmount = 100;
	#gameIsOver = false;

	constructor()
	{
		super("gameScene");
	}

	preload()
	{
		this.load.setPath("./assets/");

		this.load.image("Player00", "Player00.png");
		this.load.image("Player01", "Player01.png");
		this.load.image("Player Projectile", "Player Projectile.png");
		this.load.image("Enemy Projectile", "Enemy Projectile.png");
		this.load.image("Wing Enemy00", "Wing Enemy00.png");
		this.load.image("Wing Enemy01", "Wing Enemy01.png");
		this.load.image("Helicopter Enemy00", "Helicopter Enemy00.png");
		this.load.image("Helicopter Enemy01", "Helicopter Enemy01.png");
		this.load.image("White Puff00", "whitePuff20.png");
		this.load.image("White Puff01", "whitePuff21.png");
		this.load.image("White Puff02", "whitePuff22.png");
		this.load.image("White Puff03", "whitePuff23.png");
		this.load.image("White Puff04", "whitePuff24.png");

		this.load.audio("Player Shoot", "Player Shoot.ogg");
		this.load.audio("Enemy Shoot", "Enemy Shoot.ogg");
		this.load.audio("Player Hit", "Player Hit.ogg");
		this.load.audio("Enemy Hit", "Enemy Hit.ogg");
	}

	create()
	{
		// Set HTML description
		document.getElementById('description').innerHTML = '<h2>Lightning Force</h2>Movement: A & D | Shoot: SPACE | Restart: R'

		// Create animations
		this.anims.create({
			key: "Player",
			frames: [
				{ key: "Player00" },
				{ key: "Player01" },
			],
			frameRate: 4,
			repeat: -1
		});
		this.anims.create({
			key: "Wing Enemy",
			frames: [
				{ key: "Wing Enemy00" },
				{ key: "Wing Enemy01" },
			],
			frameRate: 4,
			repeat: -1
		});
		this.anims.create({
			key: "Helicopter Enemy",
			frames: [
				{ key: "Helicopter Enemy00" },
				{ key: "Helicopter Enemy01" },
			],
			frameRate: 4,
			repeat: -1
		});
		this.anims.create({
			key: "Puff",
			frames: [
				{ key: "White Puff00" },
				{ key: "White Puff01" },
				{ key: "White Puff02" },
				{ key: "White Puff03" },
				{ key: "White Puff04" }
			],
			frameRate: 20,
			hideOnComplete: true
		});

		// Create restartKey binding
		let restartGameKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
		restartGameKey.on("down", () => {
			if (this.#gameIsOver)
			{
				this.#initializeGame();
			}
		});

		// Create key bindings for the player
		this.moveLeftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
		this.moveRightKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
		this.shootKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

		// Create the player
		this.#gameObjects.sprites.player = new Player(this, game.config.width / 2, game.config.height - 40);

		// Create the bullet pool and wave manager
		this.#gameObjects.managers.bulletPool = new BulletPool(this, -100, -100);
		this.#gameObjects.managers.waveManager = new WaveManager(this, this.#gameObjects.managers.bulletPool, this.#gameObjects.sprites.player);

		// Initialize the player
		this.#gameObjects.sprites.player.initialize(this.moveLeftKey, this.moveRightKey, this.shootKey, this.#gameObjects.managers.bulletPool, this.#gameObjects.managers.waveManager);

		// Create texts
		this.#gameObjects.texts.livesText = this.add.text(75, 35, "Lives: " + this.#gameObjects.sprites.player.lives, {fontFamily: "'Orbitron'"}).setOrigin(0.5, 0.5);
		this.#gameObjects.texts.livesText.setFontSize(25);
		this.#gameObjects.texts.scoreText = this.add.text(game.config.width - 20, 35, "Score: " + this.#score, {fontFamily: "'Orbitron'"}).setOrigin(1, 0.5);
		this.#gameObjects.texts.scoreText.setFontSize(25);
		this.#gameObjects.texts.gameOverText = this.add.text(game.config.width/2, game.config.height/2 - 100, "GAME OVER", {fontFamily: "'Orbitron'"}).setOrigin(0.5, 0.5);
		this.#gameObjects.texts.gameOverText.setFontSize(75);
		this.#gameObjects.texts.gameOverText.visible = false;
		this.#gameObjects.texts.restartText = this.add.text(game.config.width/2, game.config.height/2 - 25, "Press R to restart", {fontFamily: "'Orbitron'"}).setOrigin(0.5, 0.5);
		this.#gameObjects.texts.restartText.visible = false;

		// Initialize the game
		this.#initializeGame();
	}

	#initializeGame()
	{
		// Hide game over and restart texts
		this.#gameObjects.texts.gameOverText.visible = false;
		this.#gameObjects.texts.restartText.visible = false;

		// Reset dynamic variables
		this.#score = 0;
		this.#gameObjects.texts.scoreText.setText("Score: " + this.#score);
		this.#gameIsOver = false;

		// Call game objects' onInitializeGame() functions
		this.#gameObjects.sprites.player.onInitializeGame();
		this.#gameObjects.managers.bulletPool.onInitializeGame();
		this.#gameObjects.managers.waveManager.onInitializeGame();

		// Spawn in the first wave
		this.#gameObjects.managers.waveManager.spawnNextWave();
	}

	update(time, delta)
	{
		if (!this.#gameIsOver)
		{
			this.#gameObjects.sprites.player.update(time, delta);				// player
			this.#gameObjects.managers.bulletPool.update();						// bullets
			this.#gameObjects.managers.waveManager.update(time, delta);			// enemies
		}
	}

	updateLivesText(lives)
	{
		this.#gameObjects.texts.livesText.setText("Lives: " + lives);
	}

	increaseScore()
	{
		this.#score += this.#scoreIncreaseAmount;
		this.#gameObjects.texts.scoreText.setText("Score: " + this.#score);
	}

	gameOver()
	{
		// Set gameIsOver to true
		this.#gameIsOver = true;

		// Tell the waveManager that the game is over
		this.#gameObjects.managers.waveManager.gameOver();

		// Show game over and restart texts
		this.#gameObjects.texts.gameOverText.visible = true;
		this.#gameObjects.texts.restartText.visible = true;
	}
}