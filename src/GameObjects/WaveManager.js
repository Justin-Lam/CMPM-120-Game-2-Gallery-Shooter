class WaveManager
{
	// Attributes:
	// Constant Variables
	#nextWaveWaitDuration = 1;
	#waves = [];

	// Dynamic Variables
	#nextWaveTimer = this.#nextWaveWaitDuration;
	#currentWave = -1;
	#numAliveEnemies = 0;
	#currentEnemies = [];


	// Methods:
	constructor(scene, bulletPool, player)
	{
		// Create the enemies of each wave
		this.#waves = 
		[
			// 1
			[
				new WingEnemy(scene, game.config.width/2, 200)
			],

			// 2
			[
				new HelicopterEnemy(scene, game.config.width/2, 200)
			],

			// 3
			[
				new WingEnemy(scene, game.config.width/2, 200),
				new HelicopterEnemy(scene, game.config.width/2, 200)
			],

			// 4
			[
				new WingEnemy(scene, game.config.width/2 - 200, 200),
				new HelicopterEnemy(scene, game.config.width/2, 200),
				new WingEnemy(scene, game.config.width/2 + 200, 200)
			],

			// 5
			[
				new WingEnemy(scene, game.config.width/2 - 300, 200),
				new HelicopterEnemy(scene, game.config.width/2 - 150, 200),
				new WingEnemy(scene, game.config.width/2, 200),
				new HelicopterEnemy(scene, game.config.width/2 + 150, 200),
				new WingEnemy(scene, game.config.width/2 + 300, 200)
			],

			// 6
			[
				new HelicopterEnemy(scene, game.config.width/2 - 200, 100),
				new WingEnemy(scene, game.config.width/2, 100),
				new HelicopterEnemy(scene, game.config.width/2 + 200, 100),

				new HelicopterEnemy(scene, game.config.width/2 - 400, 200),
				new WingEnemy(scene, game.config.width/2 - 200, 200),
				new HelicopterEnemy(scene, game.config.width/2, 200),
				new WingEnemy(scene, game.config.width/2 + 200, 200),
				new HelicopterEnemy(scene, game.config.width/2 + 400, 200)
			]
		]

		// Initialize each enemy of each wave
		for (let wave of this.#waves)
		{
			for (let enemy of wave)
			{
				enemy.initialize(bulletPool, this, player);
			}
		}
	}

	onInitializeGame()
	{
		// Disable every current enemy
		for (let enemy of this.#currentEnemies)
		{
			enemy.disable();
		}

		// Reset dynamic variables
		this.#nextWaveTimer = this.#nextWaveWaitDuration;
		this.#currentWave = -1;
		this.#numAliveEnemies = 0;
		this.#currentEnemies = [];
	}

	spawnNextWave()
	{
		this.#currentEnemies = [];
		this.#currentWave = (this.#currentWave + 1) % this.#waves.length;
		
		for (let enemy of this.#waves[this.#currentWave])
		{
			this.#numAliveEnemies++;
			this.#currentEnemies.push(enemy);
			enemy.enable();
		}

	}

	getCurrentActiveEnemies()
	{
		return this.#currentEnemies.filter( (enemy) => enemy.active );
	}

	onEnemyDeath()
	{
		this.#numAliveEnemies--;
	}

	update(time, delta)
	{
		// Enemies are alive
		if (this.#numAliveEnemies > 0)
		{
			for (let enemy of this.#currentEnemies)
			{
				enemy.update(time, delta);
			}
		}

		// All enemies are dead
		else
		{
			if (this.#nextWaveTimer > 0)
			{
				this.#nextWaveTimer -= delta / 1000;

				if (this.#nextWaveTimer <= 0)
				{
					this.#nextWaveTimer = 0;
				}
			}

			if (this.#nextWaveTimer <= 0)
			{
				this.spawnNextWave();
				this.#nextWaveTimer = this.#nextWaveWaitDuration;
			}
		}	
	}

	gameOver()
	{
		// Issue stopFollow() to every current enemy
		for (let enemy of this.#currentEnemies)
		{
			enemy.stopFollow();
		}
	}

}