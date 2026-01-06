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
        
        this.player = new Player(this.ctx, this.canvas.height);
        this.background = new Background(this.ctx, this.canvas.width, this.canvas.height);
        this.obstacles = [];
        this.score = 0;
        this.gameSpeed = 6;
        this.isGameOver = false;
        this.spawnTimer = 0;
    }

    init() {
        window.addEventListener('keydown', (e) => {
            if (e.code === 'Space') this.player.jump();
        });
        this.loop();
    }

    spawnObstacle() {
        this.spawnTimer++;
        if (this.spawnTimer > Math.max(60, 120 - this.score / 10)) {
            this.obstacles.push(new Obstacle(this.ctx, this.canvas.width, this.canvas.height, this.gameSpeed));
            this.spawnTimer = 0;
        }
    }

    checkCollision(p, o) {
        return (p.x < o.x + o.w && p.x + p.w > o.x && p.y < o.y + o.h && p.y + p.h > o.y);
    }

    loop() {
        if (this.isGameOver) return;

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
                this.gameSpeed += 0.1;
                document.getElementById('score').innerText = `${this.score}m`;
            }
        });

        requestAnimationFrame(() => this.loop());
    }

    gameOver() {
        this.isGameOver = true;
        this.player.explode();
        gsap.to(this.canvas, { x: 20, repeat: 5, yoyo: true, duration: 0.05, onComplete: () => {
            gsap.set(this.canvas, { x: 0 });
            document.getElementById('game-over').classList.remove('hidden');
        }});
    }
}