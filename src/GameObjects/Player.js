class Player extends Phaser.GameObjects.Sprite
{
	// Attributes:
	// Constant Variables
	#scale = 0.5;
	#moveSpeed = 5;			// in pixels per tick
	#shootCooldown = 0.5;		// in seconds
	#invincibilityDuration = 1;
	#numInvincibilityFlashes = 5;

	// Dynamic Variables
	#lives = 3;
	#shootCooldownTimer = 0;
	#invincibilityTimer = 0;
	#invincibilityFlashTimer = 0;

	// Reference Variables
	#scene = null;
	#moveLeftKey = null;
	#moveRightKey = null;
	#shootKey = null;
	#bulletPool = null;
	#bulletTextureName = "Player Projectile";
	#waveManager = null;


	// Methods:
	// Getters & Setters
	get lives() { return this.#lives; }

	// Other
	constructor(scene, x, y)
	{
		super(scene, x, y, "Player00");

		this.#scene = scene;
		this.setScale(this.#scale);
		this.anims.play("Player");

		scene.add.existing(this);
		return this;
	}

	initialize(moveLeftKey, moveRightKey, shootKey, bulletPool, waveManager)
	{
		// Create references to things outside this object
		this.#moveLeftKey = moveLeftKey;
		this.#moveRightKey = moveRightKey;
		this.#shootKey = shootKey;
		this.#bulletPool = bulletPool;
		this.#waveManager = waveManager;

		// Create shoot event
		this.#shootKey.on("down", this.#shoot, this);		// on down, execute the shoot function, specifically the one found in this Player instance
	}

	#shoot()
	{
		// Check that shoot is off cooldown and player is alive
		if (this.#shootCooldownTimer <= 0 && this.#lives > 0)
		{
			// Get a bullet
			let bullet = this.#bulletPool.getInactiveBullet();
			if (bullet != null)
			{
				// Set the bullet
				bullet.x = this.x;
				bullet.y = this.y - this.displayHeight / 2;
				bullet.initialize("up", "Player", this.#bulletTextureName);
				bullet.setActive();

				// Play sound
				this.#scene.sound.play("Player Shoot");
			}
			else
			{
				console.log("ERROR: getInactiveBullet() from BulletPool returned null.");
			}

			// Put shoot on cooldown
			this.#shootCooldownTimer = this.#shootCooldown;
		}
	}

	onInitializeGame()
	{
		// Reset dynamic variables
		this.x = game.config.width / 2;
		this.visible = true;
		this.#lives = 3;
		this.#scene.updateLivesText(this.#lives);
		this.#shootCooldownTimer = 0;
		this.#invincibilityTimer = 0;
		this.#invincibilityFlashTimer = 0;
	}

	update(time, delta)
	{
		// Movement:
		// Move Left
		if (this.#moveLeftKey.isDown)
		{
			// Check that the player isn't at the left end of the screen and can actually move left
			if (this.x > this.displayWidth / 2)
			{
				this.x -= this.#moveSpeed;
			}
		}

		// Move Right
		if (this.#moveRightKey.isDown)
		{
			// Check that the player isn't at the right end of the screen and can actually move right
			if (this.x < game.config.width - this.displayWidth / 2)
			{
				this.x += this.#moveSpeed;
			}
		}

		// Shooting:
		// Decrease shootCooldownTimer if shoot is on cooldown
		if (this.#shootCooldownTimer > 0)
		{
			this.#shootCooldownTimer -= delta / 1000;		// delta is in ms, we want to convert it to seconds and 1000 ms = 1 second

			if (this.#shootCooldownTimer < 0)
			{
				this.#shootCooldownTimer = 0;
			}
		}

		// Collision and Invincibility:
		if (this.#invincibilityTimer <= 0)
		{
			// Check for collision
			this.#checkForCollisionsWithEnemyProjectile();
			this.#checkForCollisionsWithEnemy();
		}
		else
		{
			// Decrease invincibility flash timer
			this.#invincibilityFlashTimer -= delta / 1000;
			if (this.#invincibilityFlashTimer < 0)
			{
				if (this.visible)
				{
					this.visible = false;
				}
				else
				{
					this.visible = true;
				}

				this.#invincibilityFlashTimer = this.#invincibilityDuration / (this.#numInvincibilityFlashes * 2);
			}

			// Decrease invincibility timer
			this.#invincibilityTimer -= delta / 1000;
			if (this.#invincibilityTimer < 0)
			{
				this.visible = true;
				this.#invincibilityTimer = 0;
			}

			
		}
		
	}

	#collides(object)
	{
		if (Math.abs(this.x - object.x) > (this.displayWidth / 2 + object.displayWidth / 2))
			{
				return false;
			}
			if (Math.abs(this.y - object.y) > (this.displayHeight / 2 + object.displayHeight / 2))
			{
				return false;
			}
	
			return true;
	}

	#onCollision()
	{
		// Handle player
		this.#lives--;
		this.#invincibilityTimer = this.#invincibilityDuration;
		this.#invincibilityFlashTimer = this.#invincibilityDuration / (this.#numInvincibilityFlashes * 2);

		// Handle scene
		this.#scene.updateLivesText(this.#lives);
		if (this.#lives <= 0)
		{
			this.#scene.gameOver();
		}

		// Play sound
		this.#scene.sound.play("Player Hit");
	}

	#checkForCollisionsWithEnemyProjectile()
	{
		for (let bullet of this.#bulletPool.getActiveBulletsOfOwner("Enemy"))
		{
			if (this.#collides(bullet))
			{
				// Handle bullet
				bullet.setInactive();

				// Handle other
				this.#onCollision();
			}
		}
	}

	#checkForCollisionsWithEnemy()
	{
		for (let enemy of this.#waveManager.getCurrentActiveEnemies())
		{
			if (this.#collides(enemy))
			{
				// Handle other
				this.#onCollision();
			}
		}
	}

}