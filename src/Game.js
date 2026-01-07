import { Player } from './Player.js';
import { Obstacle } from './Obstacle.js';
import { Background } from './Background.js';
import gsap from 'gsap';

export class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        this.storageKey = 'peachJumpHighScore_v1';
        
        this.player = new Player(this.ctx, this.canvas.height);
        this.background = new Background(this.ctx, this.canvas.width, this.canvas.height);
        this.obstacles = [];
        this.score = 0;
    
        this.highScore = localStorage.getItem(this.storageKey) || 0;
        
        this.gameSpeed = 6;
        this.isGameOver = false;
        this.isPaused = true;
        this.spawnTimer = 0;

        this.updateHighScoreUI();
    }

    updateHighScoreUI() {
        document.getElementById('high-score').innerText = `Best: ${this.highScore}m`;
    }

    init() {
        this.isPaused = false;

        // 3. RESET using the standard key
        document.getElementById('reset-btn').addEventListener('click', () => {
            localStorage.removeItem(this.storageKey);
            location.reload();
        });

        const triggerJump = (e) => {
            if (e && e.type === 'keydown') {
                const keys = ['Space', 'ArrowUp', 'KeyW'];
                if (!keys.includes(e.code)) return;
                e.preventDefault();
            }
            if (!this.isGameOver) this.player.jump();
        };

        window.addEventListener('keydown', triggerJump);
        window.addEventListener('mousedown', triggerJump);
        window.addEventListener('touchstart', (e) => {
            if (e.cancelable) e.preventDefault();
            triggerJump();
        }, { passive: false });

        window.addEventListener('resize', () => this.handleResize());
        
        this.loop();
    }

    handleResize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.background.width = this.canvas.width;
        this.background.height = this.canvas.height;
        
        const newGround = this.canvas.height - 90;
        this.player.groundY = newGround;
        if (!this.player.isJumping) this.player.y = newGround;
    }

    spawnObstacle() {
        this.spawnTimer++;
        const rate = Math.max(50, 100 - this.score / 25);
        if (this.spawnTimer > rate) {
            this.obstacles.push(new Obstacle(this.ctx, this.canvas.width, this.canvas.height, this.gameSpeed));
            this.spawnTimer = 0;
        }
    }

    checkCollision(p, o) {
        const padding = 10;  
        return (
            p.x + padding < o.x + o.w &&
            p.x + p.w - padding > o.x &&
            p.y + padding < o.y + o.h &&
            p.y + p.h - padding > o.y
        );
    }

    loop() {
        if (this.isGameOver || this.isPaused) return;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.background.draw();
        
        this.player.update();
        this.player.draw();

        this.spawnObstacle();

        this.obstacles.forEach((obs, index) => {
            obs.update();
            obs.draw();

            if (this.checkCollision(this.player, obs)) {
                this.gameOver();
            }

            if (obs.x + obs.w < 0) {
                this.obstacles.splice(index, 1);
                this.score += 10;
                this.gameSpeed += 0.15;
                document.getElementById('score').innerText = `${this.score}m`;
            }
        });

        requestAnimationFrame(() => this.loop());
    }

    gameOver() {
        this.isGameOver = true;
        this.player.explode();

        let newBest = false;
        if (this.score > this.highScore) {
            this.highScore = this.score;
            // 4. SAVE using the standard key
            localStorage.setItem(this.storageKey, this.highScore);
            newBest = true;
        }

        document.getElementById('final-score').innerText = `Distance: ${this.score}m`;
        const bestDisplay = document.getElementById('best-score');
        if (newBest) {
            bestDisplay.innerText = "🏆 NEW RECORD! 🏆";
            bestDisplay.style.color = "#FF85A1";
        } else {
            bestDisplay.innerText = `Best: ${this.highScore}m`;
            bestDisplay.style.color = "#555";
        }

        gsap.to(this.canvas, { 
            x: 15, 
            repeat: 5, 
            yoyo: true, 
            duration: 0.05, 
            onComplete: () => {
                gsap.set(this.canvas, { x: 0 });
                document.getElementById('game-over').classList.remove('hidden');
            }
        });
    }
}