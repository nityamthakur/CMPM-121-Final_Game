class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
        this.balloons = [];
        this.enemies = [];
        this.bulletSpeed = -300;
        this.balloonSpeed = 100;
        this.shootDelay = 300;
        this.lastShot = 0;
        this.extraLifeThreshold = 200; // Points needed for extra life
        this.extraLivesGiven = 0; // Track number of extra lives given
        this.shieldActive = false;
        this.shieldDuration = 5000; // Shield lasts for 5 seconds
        this.powerUpInterval = 10000; // Time between power-ups
    }

    preload() {
        // Assets should be loaded in BootScene
    }

    create() {
        this.createBackground();
        this.createPlayer();
        this.createControls();
        this.createBalloons();
        this.createEnemies();
        this.createThunderCloud();
        this.createPowerUps();
        this.createMeteors();
        this.score = 0;
        this.createScoreText();
        this.lives = 3;
        this.createLivesText();
    }

    createBackground() {
        this.add.image(400, 300, 'background');
    }

    createPlayer() {
        this.player = this.physics.add.sprite(400, 550, 'player');
        this.player.setCollideWorldBounds(true);
        this.playerSpeed = 600;
    }

    createControls() {
        this.cursors = this.input.keyboard.createCursorKeys();
        this.spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    createBalloons() {
        this.time.addEvent({
            delay: 3000,
            callback: this.spawnBalloon,
            callbackScope: this,
            loop: true
        });
    }

    spawnBalloon() {
        let x = Phaser.Math.Between(50, 750);
        let isSpecial = Phaser.Math.Between(0, 100) > 98;
        let type = isSpecial ? 'special' : Phaser.Math.RND.pick(['large', 'medium', 'small']);
        this.createBalloon(x, 0, type);
    }

    createBalloon(x, y, type) {
        let balloon = this.physics.add.image(x, y, `balloon${this.capitalizeFirstLetter(type)}`);
        balloon.setData('type', type);
        balloon.setData('hits', { 'small': 1, 'medium': 2, 'large': 3, 'special': 1 }[type]);
        balloon.setVelocityY(this.balloonSpeed);
        this.balloons.push(balloon);
        this.updateBalloonSize(balloon, type);

        if (type === 'special') {
            this.physics.add.overlap(this.player, balloon, this.activateSpecialBalloon, null, this);
        }
    }

    updateBalloonSize(balloon, type) {
        const sizes = { 'small': 0.5, 'medium': 0.75, 'large': 1, 'special': 1.2 };
        balloon.setScale(sizes[type]);
    }

    createEnemies() {
        this.time.addEvent({
            delay: 10000,
            callback: this.spawnEnemy,
            callbackScope: this,
            loop: true
        });
    }

    spawnEnemy() {
        let x = Phaser.Math.Between(50, 750);
        let enemy = this.physics.add.image(x, 0, 'enemy');
        enemy.setScale(0.5);
        enemy.setData('hits', 2);
        this.physics.add.overlap(this.player, enemy, this.hitPlayer, null, this);
        this.time.addEvent({
            delay: 2000,
            callback: () => this.enemyShoot(enemy),
            callbackScope: this,
            loop: true
        });

        this.time.addEvent({
            delay: 500,
            callback: () => this.moveEnemy(enemy),
            callbackScope: this,
            loop: true
        });

        this.enemies.push(enemy);
    }

    moveEnemy(enemy) {
        if (enemy.active) {
            let x = Phaser.Math.Between(-100, 100);
            let y = Phaser.Math.Between(10, 30);
            enemy.setVelocity(x, y);

            if (enemy.x < 50) {
                enemy.x = 50;
            } else if (enemy.x > 750) {
                enemy.x = 750;
            }

            if (enemy.y > 600) {
                enemy.destroy();
            }
        }
    }

    enemyShoot(enemy) {
        if (enemy.active) {
            let bullet = this.physics.add.image(enemy.x, enemy.y, 'enemyBullet');
            bullet.setVelocityY(300);
            this.physics.add.overlap(this.player, bullet, this.hitPlayer, null, this);
        }
    }

    hitPlayer(player, enemyOrBullet) {
        if (this.shieldActive) {
            return;
        }

        if (enemyOrBullet.texture.key === 'enemy') {
            enemyOrBullet.destroy();
        } else {
            enemyOrBullet.destroy();
            this.lives--;
            this.livesText.setText(`Lives: ${this.lives}`);
            if (this.lives <= 0) {
                this.scene.start('GameOverScene', { score: this.score });
            }
        }
    }

    createThunderCloud() {
        this.time.addEvent({
            delay: 20000,
            callback: this.spawnThunderCloud,
            callbackScope: this,
            loop: true
        });
    }

    spawnThunderCloud() {
        let x = Phaser.Math.Between(50, 750);
        let cloud = this.physics.add.image(x, 100, 'thunderCloud');
        cloud.setVelocityX(100);
        cloud.setScale(0.7);
        this.time.addEvent({
            delay: 2000,
            callback: () => this.strikeLightning(cloud),
            callbackScope: this,
            loop: true
        });
    }

    strikeLightning(cloud) {
        if (cloud.active) {
            let lightning = this.physics.add.image(cloud.x, cloud.y + 50, 'lightning');
            lightning.setVelocityY(300);
            this.physics.add.overlap(this.player, lightning, this.hitPlayer, null, this);
        }
    }

    createPowerUps() {
        this.time.addEvent({
            delay: this.powerUpInterval,
            callback: () => {
                if (this.powerUpExists) return;
                this.powerUpExists = true;
                let x = Phaser.Math.Between(50, 750);
                let powerUp = this.physics.add.image(x, 0, 'powerUp1');
                powerUp.setVelocityY(150);
                powerUp.setScale(2.5); // Increase power-up size by 2.5 times
                this.physics.add.overlap(this.player, powerUp, this.activateRapidFire, null, this);
            },
            callbackScope: this,
            loop: true
        });

        this.time.addEvent({
            delay: this.powerUpInterval + 10000,
            callback: () => {
                if (this.powerUpExists) return;
                this.powerUpExists = true;
                let x = Phaser.Math.Between(50, 750);
                let shieldPowerUp = this.physics.add.image(x, 0, 'shield');
                shieldPowerUp.setVelocityY(150);
                this.physics.add.overlap(this.player, shieldPowerUp, this.activateShield, null, this);
            },
            callbackScope: this,
            loop: true
        });
    }

    activateRapidFire(player, powerUp) {
        powerUp.destroy();
        this.powerUpExists = false;
        this.shootDelay = 150;
        this.time.delayedCall(5000, () => {
            this.shootDelay = 300;
        }, [], this);
        this.sound.play('powerUpCollect');
    }

    activateShield(player, shieldPowerUp) {
        shieldPowerUp.destroy();
        this.powerUpExists = false;
        this.shieldActive = true;
        let shieldEffect = this.add.image(this.player.x, this.player.y, 'shield_effect');
        shieldEffect.setScale(0.5);
        this.time.delayedCall(this.shieldDuration, () => {
            this.shieldActive = false;
            shieldEffect.destroy();
        }, [], this);

        this.time.addEvent({
            delay: 10,
            callback: () => {
                if (shieldEffect.active) {
                    shieldEffect.x = this.player.x;
                    shieldEffect.y = this.player.y;
                }
            },
            callbackScope: this,
            loop: true
        });
    }

    createMeteors() {
        this.time.addEvent({
            delay: 15000,
            callback: this.spawnMeteor,
            callbackScope: this,
            loop: true
        });
    }

    spawnMeteor() {
        let x = Phaser.Math.Between(50, 750);
        let meteor = this.physics.add.image(x, 0, 'meteor');
        meteor.setVelocityY(300);
        this.physics.add.overlap(this.player, meteor, this.hitPlayer, null, this);
    }

    update() {
        this.player.setVelocity(0);

        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-this.playerSpeed);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(this.playerSpeed);
        }

        if (this.spaceBar.isDown && this.time.now > this.lastShot) {
            this.shootBullet();
            this.lastShot = this.time.now + this.shootDelay;
        }

        this.cleanupBalloons();
        this.cleanupEnemies();
        this.checkForExtraLife();
        }shootBullet() {
            let bullet = this.physics.add.image(this.player.x, this.player.y, 'bullet');
            bullet.setVelocityY(this.bulletSpeed);
            this.physics.add.overlap(bullet, this.balloons, this.hitBalloon, null, this);
            this.physics.add.overlap(bullet, this.enemies, this.hitEnemy, null, this);
        }
        
        hitBalloon(bullet, balloon) {
            bullet.destroy();
            balloon.setData('hits', balloon.getData('hits') - 1);
        
            if (balloon.getData('hits') <= 0) {
                this.popBalloon(balloon);
            } else {
                this.updateBalloonType(balloon);
            }
        
            this.score += 10;
            this.scoreText.setText(`Score: ${this.score}`);
        }
        
        updateBalloonType(balloon) {
            const nextType = this.getNextBalloonType(balloon.getData('type'));
            if (nextType) {
                balloon.setTexture(`balloon${this.capitalizeFirstLetter(nextType)}`);
                balloon.setData('type', nextType);
                this.updateBalloonSize(balloon, nextType);
            }
        }
        
        hitEnemy(bullet, enemy) {
            bullet.destroy();
            enemy.setData('hits', enemy.getData('hits') - 1);
        
            if (enemy.getData('hits') <= 0) {
                enemy.destroy();
            }
        
            this.score += 20;
            this.scoreText.setText(`Score: ${this.score}`);
        }
        
        createSpecialBalloon(x, y) {
            let specialBalloon = this.physics.add.image(x, y, 'balloonSpecial');
            specialBalloon.setData('type', 'special');
            specialBalloon.setVelocityY(this.balloonSpeed);
            specialBalloon.setScale(1.2);
            this.balloons.push(specialBalloon);
        }
        
        activateSpecialBalloon(player, balloon) {
            this.sound.play('powerUpUse');
            balloon.destroy();
            this.balloons.forEach(balloon => balloon.destroy());
            this.enemies.forEach(enemy => enemy.destroy());
            // Add destruction for any other threats like thunderclouds
        }
        
        popBalloon(balloon) {
            this.sound.play('pop');
            balloon.destroy();
            let scoreIncrement = 10;
        
            if (balloon.getData('type') === 'special') {
                scoreIncrement = 100;
            }
        
            this.score += scoreIncrement;
            this.scoreText.setText(`Score: ${this.score}`);
        }
        
        getNextBalloonType(currentType) {
            const types = { 'large': 'medium', 'medium': 'small', 'small': null, 'special': null };
            return types[currentType];
        }
        
        cleanupBalloons() {
            this.balloons = this.balloons.filter(balloon => balloon.active);
        }
        
        cleanupEnemies() {
            this.enemies = this.enemies.filter(enemy => enemy.active);
        }
        
        checkForExtraLife() {
            if (this.score >= this.extraLifeThreshold * (this.extraLivesGiven + 1)) {
                let x = Phaser.Math.Between(50, 750);
                let extraLife = this.physics.add.image(x, 0, 'heart');
                extraLife.setVelocityY(150); // Increase speed
                this.physics.add.overlap(this.player, extraLife, this.collectExtraLife, null, this);
                this.extraLivesGiven++;
            }
        }
        
        collectExtraLife(player, heart) {
            heart.destroy();
            this.lives++;
            this.livesText.setText(`Lives: ${this.lives}`);
        }
        
        createScoreText() {
            this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#FFF' });
        }
        
        createLivesText() {
            this.livesText = this.add.text(16, 50, `Lives: ${this.lives}`, { fontSize: '32px', fill: '#FFF' });
        }
        
        capitalizeFirstLetter(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }
    }