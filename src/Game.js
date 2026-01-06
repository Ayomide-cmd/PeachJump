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
        
        const handleJump = (e) => {
            
            if (e && e.type === 'keydown') {
                const jumpKeys = ['Space', 'ArrowUp', 'KeyW'];
                if (!jumpKeys.includes(e.code)) return;
                e.preventDefault(); 
            }
            
            this.player.jump();
        };
    
        
        window.addEventListener('keydown', handleJump);
    
    
        window.addEventListener('mousedown', (e) => {
            
            if (e.button === 0) handleJump();
        });
    
        
        window.addEventListener('touchstart', (e) => {          
            if (e.cancelable) e.preventDefault(); 
            handleJump();
        }, { passive: false });
    
        window.addEventListener('resize', () => this.handleResize());
    
        this.loop();
    }
    
    handleResize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.background.width = this.canvas.width;
        this.background.height = this.canvas.height;
        this.player.groundY = this.canvas.height - 90;
        if(!this.player.isJumping) this.player.y = this.player.groundY;
    }
        
    spawnObstacle() {
        this.spawnTimer++;
        const spawnRate = Math.max(50, 100 - this.score / 20);
        if (this.spawnTimer > spawnRate) {
            this.obstacles.push(new Obstacle(this.ctx, this.canvas.width, this.canvas.height, this.gameSpeed));
            this.spawnTimer = 0;
        }
    }

    checkCollision(p, o) {
        const padding = 8;
        return (
            p.x + padding < o.x + o.w &&
            p.x + p.w - padding > o.x &&
            p.y + padding < o.y + o.h &&
            p.y + p.h - padding > o.y
        );
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
        
        
        gsap.to(this.canvas, { 
            x: 10, 
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