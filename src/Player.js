import gsap from 'gsap';

export class Player {
    constructor(ctx, height) {
        this.ctx = ctx;
        this.w = 50; 
        this.h = 50;
        this.x = 100;
        this.groundY = height - 90;
        this.y = this.groundY;
        
        this.gravity = 0.8;
        this.velocity = 0;
        this.jumpForce = -16;
        this.isJumping = false;
        
        
        this.scaleX = 1;
        this.scaleY = 1;
    }

    jump() {
        if (!this.isJumping) {
            this.velocity = this.jumpForce;
            this.isJumping = true;
            
            // Squash and stretch effect using GSAP
            gsap.to(this, { 
                scaleY: 1.4, 
                scaleX: 0.7, 
                duration: 0.15, 
                yoyo: true, 
                repeat: 1,
                ease: "power1.out"
            });
        }
    }

    update() {
        this.velocity += this.gravity;
        this.y += this.velocity;

        // Ground collision
        if (this.y >= this.groundY) {
            // If we just landed, do a small "thud" squash
            if (this.isJumping) {
                gsap.to(this, { 
                    scaleY: 0.7, 
                    scaleX: 1.3, 
                    duration: 0.1, 
                    yoyo: true, 
                    repeat: 1 
                });
            }
            this.y = this.groundY;
            this.velocity = 0;
            this.isJumping = false;
        }
    }

    draw() {
        this.ctx.save();
        
        // Move to the player position (centered)
        this.ctx.translate(this.x + this.w / 2, this.y + this.h / 2);
        this.ctx.scale(this.scaleX, this.scaleY);

        // 1. THE PEACH (Round Ball)
        this.ctx.beginPath();
        this.ctx.arc(0, 0, this.w / 2, 0, Math.PI * 2);
        this.ctx.fillStyle = '#FF85A1'; // Pink
        this.ctx.fill();
        
        // 2. THE LEAF
        this.ctx.beginPath();
        this.ctx.fillStyle = '#4CAF50'; // Green
        // Draw a small ellipse for the leaf
        this.ctx.ellipse(0, -this.h / 2, 12, 6, -Math.PI / 4, 0, Math.PI * 2);
        this.ctx.fill();

        // 3. THE SHINE (Makes it look round/3D)
        this.ctx.beginPath();
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        this.ctx.arc(-this.w / 5, -this.h / 5, this.w / 8, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.restore();
    }

    explode() {
        // Visual particles for game over
        for (let i = 0; i < 15; i++) {
            const dot = document.createElement('div');
            dot.classList.add('particle');
            dot.style.position = 'absolute';
            dot.style.left = `${this.x + 25}px`;
            dot.style.top = `${this.y + 25}px`;
            dot.style.width = '12px';
            dot.style.height = '12px';
            dot.style.borderRadius = '50%';
            dot.style.backgroundColor = '#FF85A1';
            dot.style.pointerEvents = 'none';
            document.body.appendChild(dot);

            gsap.to(dot, {
                x: (Math.random() - 0.5) * 300,
                y: (Math.random() - 0.5) * 300,
                opacity: 0,
                scale: 0,
                duration: 1,
                ease: "power2.out",
                onComplete: () => dot.remove()
            });
        }
    }
}