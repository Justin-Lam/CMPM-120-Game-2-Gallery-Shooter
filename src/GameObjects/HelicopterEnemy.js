class HelicopterEnemy extends Enemy
{
	// Attributes:
	// Constant Variables
	#horizonalMoveSpeed = 5;
	#followDuration = 2.5;
	#pathPoints = [
		278, 154,
		235, 334,
		284, 483,
		342, 665,
		278, 786,
		243, 660,
		283, 487,
		328, 334,
		278, 154
	];

	// Reference Variables
	#player = null;


	// Methods:
	constructor(scene, x, y)
	{
		super(scene, null, x, y, "Helicopter Enemy00");

		this.path = new Phaser.Curves.Spline(this.#pathPoints);
		this.play("Helicopter Enemy");

		scene.add.existing(this);
		return this;
	}

	initialize(bulletPool, waveManager, player)
	{
		super.initialize(bulletPool, waveManager);
		this.#player = player;
	}

	update()
	{
		if (this.active)
		{
			// Call Enemy class's update()
			// Checks for collision with player bullet
			super.update();

			if (!this.isFollowing())
			{
				if (this.x > this.#player.x - this.#player.displayWidth/2 && this.x < this.#player.x + this.#player.displayWidth/2)
				{
					this.startFollow({
						duration: this.#followDuration * 1000,
						onComplete: () => {
							this.pathTween.stop();
							this.pathTween = null;
						}
					});
				}

				else
				{
					// Move Left
					if (this.x > this.#player.x)
					{
						this.x -= this.#horizonalMoveSpeed;
					}
					// Move right
					else
					{
						this.x += this.#horizonalMoveSpeed;
					}
				}
			}
		}
	}

}