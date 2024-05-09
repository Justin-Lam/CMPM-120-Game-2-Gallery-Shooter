class Bullet extends Phaser.GameObjects.Sprite
{
	// Attributes:
	#owner = null;
	#scale = 0.25;
	#moveSpeed = 10;


	// Methods:
	// Getters & Setters
	get owner() { return this.#owner; }

	//Other
	constructor(scene, x, y)
	{
		super(scene, x, y);

		this.setScale(this.#scale);
		this.setInactive();

		scene.add.existing(this);
		return this;
	}

	initialize(direction, owner, texture)
	{
		if (direction == "up")
		{
			this.#moveSpeed = Math.abs(this.#moveSpeed);
		}
		else if (direction == "down")
		{
			this.#moveSpeed = Math.abs(this.#moveSpeed) * -1;
		}

		this.#owner = owner;
		this.setTexture(texture);
	}

	update()
	{
		// Movement
		if (this.active)
		{
			this.y -= this.#moveSpeed;

			// neutralize bullet when it goes off the screen
			if (this.y < -(this.displayHeight / 2) || this.y > game.config.height + (this.displayHeight / 2))
			{
				this.setInactive();
			}
		}
	}

	setActive(direction, owner)
	{
		this.visible = true;
		this.active = true;
	}

	setInactive()
	{
		this.visible = false;
		this.active = false;
	}

}