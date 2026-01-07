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

        this.dustParticles = [];
    }

    jump() {
        if (!this.isJumping) {
            this.velocity = this.jumpForce;
            this.isJumping = true;
            
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

        // Handle Landing
        if (this.y >= this.groundY) {
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
            
        
            if (Math.random() > 0.8) { this.createDust(); }
        }

       
        this.dustParticles.forEach((p, i) => {
            p.x -= 4; 
            p.opacity -= 0.02;
            if (p.opacity <= 0) this.dustParticles.splice(i, 1);
        });
    }

    createDust() {
        this.dustParticles.push({
            x: this.x + 10,
            y: this.groundY + this.h - 5,
            size: Math.random() * 8 + 2,
            opacity: 0.5
        });
    }

    draw() {
        
        this.dustParticles.forEach(p => {
            this.ctx.fillStyle = `rgba(255, 133, 161, ${p.opacity})`;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fill();
        });

        
        this.ctx.save();
        const shadowScale = Math.max(0.2, 1 - (this.groundY - this.y) / 300);
        this.ctx.globalAlpha = 0.2 * shadowScale;
        this.ctx.fillStyle = "black";
        this.ctx.beginPath();
        this.ctx.ellipse(this.x + this.w / 2, this.groundY + this.h - 5, 20 * shadowScale, 5 * shadowScale, 0, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.restore();

       
        this.ctx.save();
        this.ctx.translate(this.x + this.w / 2, this.y + this.h / 2);
        this.ctx.scale(this.scaleX, this.scaleY);

        
        this.ctx.beginPath();
        this.ctx.arc(0, 0, this.w / 2, 0, Math.PI * 2);
        this.ctx.fillStyle = '#FF85A1'; 
        this.ctx.fill();
        
        
        this.ctx.beginPath();
        this.ctx.fillStyle = '#4CAF50'; 
        this.ctx.ellipse(0, -this.h / 2, 12, 6, -Math.PI / 4, 0, Math.PI * 2);
        this.ctx.fill();

        
        this.ctx.beginPath();
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        this.ctx.arc(-this.w / 5, -this.h / 5, this.w / 8, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.restore();
    }

    explode() {
       
    }
}