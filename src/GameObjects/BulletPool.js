class BulletPool
{
	// Attributes:
	#size = 10;		// amount of bullets in the pool
	#pool = [];		// array of bullets - the pool


	// Methods:
	constructor(scene, x, y)
	{
		// Create the Bullets
		for (let i = 0; i < this.#size; i++)
		{
			this.#pool.push(new Bullet(scene, x, y));
		}
	}

	onInitializeGame()
	{
		// Make every bullet inactive
		for (let bullet of this.#pool)
		{
			bullet.setInactive();
		}
	}

	getInactiveBullet()
	{
		// Loop over the bullets in the pool and return the first inactive one
		for (let bullet of this.#pool)
		{
			if (!bullet.active)
			{
				return bullet;
			}
		}

		// Return null if there are no inactive bullets
		return null;
	}
	
	getActiveBulletsOfOwner(owner)
	{
		let activeBulletsOfOwner = [];

		// Scan through all bullets in the pool and add the ones that are active and have the owner of the owner parameter to activeBulletsOfOwner
		for (let bullet of this.#pool)
		{
			if (bullet.active && bullet.owner == owner)
			{
				activeBulletsOfOwner.push(bullet);
			}
		}

		return activeBulletsOfOwner;
	}

	update()
	{
		for (let bullet of this.#pool)
		{
			bullet.update();
		}
	}

}