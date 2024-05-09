class Enemy extends Phaser.GameObjects.PathFollower
{
	// Attributes:
	// Constant Variables
    #scale = 0.5
	#startX = 0;
	#startY = 0;
	
	// Reference Variables
	scene = null;
	bulletPool = null;
	#waveManager = null;
	

	// Methods:
	constructor(scene, path, x, y, texture, frame)
	{
		super(scene, path, x, y, texture, frame);

		this.scene = scene;
        this.setScale(this.#scale);
		this.startX = x;
		this.startY = y;
		this.disable();
	}
	
	initialize(bulletPool, waveManager)
	{
		// Create references to things outside this object
		this.bulletPool = bulletPool;
		this.#waveManager = waveManager;
	}

	enable()
	{
		this.x = this.startX;
		this.y = this.startY;
		this.active = true;
		this.visible = true;
	}
	disable()
	{
		this.active = false;
		this.visible = false;
	}

	update()
	{
		if (this.active)
		{
			// Check for collision with player bullet
			this.#checkForCollisionsWithPlayerProjectile();
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

	#checkForCollisionsWithPlayerProjectile()
	{
		for (let bullet of this.bulletPool.getActiveBulletsOfOwner("Player"))
		{
			if (this.#collides(bullet))
			{
				// Handle bullet
				bullet.setInactive();

				// Handle enemy
				this.#waveManager.onEnemyDeath();
				this.disable();

				// Handle scene
				this.scene.increaseScore();

				// Create puff
				this.scene.add.sprite(this.x, this.y, "White Puff00").setScale(0.25).play("Puff");

				// Play sound
				this.scene.sound.play("Enemy Hit", { volume: 0.5 });
			}
		}
	}

}