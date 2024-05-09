class WingEnemy extends Enemy
{
	// Attributes:
	// Constant Variables
	#shootCooldown = 0.75;		// in seconds
	#followDuration = 2;
	#pathPoints = [
		290, 223,
		225, 283,
		131, 324,
		54, 312,
		21, 235,
		45, 145,
		142, 97,
		239, 144,
		289, 209,
		341, 274,
		434, 327,
		533, 303,
		567, 218,
		559, 115,
		495, 80,
		387, 111,
		331, 175,
		286, 225
	];

	// Dynamic Variables
	#shootCooldownTimer = this.#shootCooldown;

	// Reference Variables
	#bulletTextureName = "Enemy Projectile";


	// Methods:
	constructor(scene, x, y)
	{
		super(scene, null, x, y, "Wing Enemy00");

		this.path = new Phaser.Curves.Spline(this.#pathPoints);
		this.play("Wing Enemy");

		scene.add.existing(this);
		return this;
	}

	enable()
	{
		super.enable();

		this.startFollow({
			duration: this.#followDuration * 1000,
			repeat: -1
		});
	}

	update(time, delta)
	{
		if (this.active)
		{
			// Call Enemy class's update()
			// Checks for collision with player bullet
			super.update();

			//Shooting:
			// Decrease shootCooldownTimer if shoot is on cooldown
			if (this.#shootCooldownTimer > 0)
			{
				this.#shootCooldownTimer -= delta / 1000;		// delta is in ms, we want to convert it to seconds and 1000 ms = 1 second

				if (this.#shootCooldownTimer < 0)
				{
					this.#shootCooldownTimer = 0;
				}
			}

			// Shoot if shoot if off cooldown
			if (this.#shootCooldownTimer <= 0)
			{
				// Get a bullet
				let bullet = this.bulletPool.getInactiveBullet();
				if (bullet != null)
				{
					// Set the bullet
					bullet.x = this.x;
					bullet.y = this.y + this.displayHeight / 2;
					bullet.initialize("down", "Enemy", this.#bulletTextureName);
					bullet.setActive();

					// Play sound
					this.scene.sound.play("Enemy Shoot", { volume: 0.5 });
				}
				else
				{
					console.log("ERROR: getInactiveBullet() from BulletPool returned null.");
				}

				// Put shoot on cooldown
				this.#shootCooldownTimer = this.#shootCooldown;
			}
		}
		
	}

}