import gsap from 'gsap';

export class Player {
    constructor(ctx, height) {
        this.ctx = ctx;
        this.x = 100;
        this.y = height - 100;
        this.w = 40;
        this.h = 40;
        this.gravity = 0.8;
        this.velocity = 0;
        this.jumpForce = -15;
        this.groundY = height - 90;
        this.isJumping = false;
        this.scaleX = 1;
        this.scaleY = 1;
    }

    jump() {
        if (!this.isJumping) {
            this.velocity = this.jumpForce;
            this.isJumping = true;
            gsap.to(this, { scaleY: 1.3, scaleX: 0.7, duration: 0.1, yoyo: true, repeat: 1 });
        }
    }

    update() {
        this.velocity += this.gravity;
        this.y += this.velocity;

        if (this.y > this.groundY) {
            this.y = this.groundY;
            this.velocity = 0;
            this.isJumping = false;
        }
    }

    draw() {
        this.ctx.save();
        this.ctx.translate(this.x + this.w / 2, this.y + this.h / 2);
        this.ctx.scale(this.scaleX, this.scaleY);
        this.ctx.fillStyle = '#FF85A1';
        this.ctx.fillRect(-this.w / 2, -this.h / 2, this.w, this.h);
        this.ctx.restore();
    }

    explode() {
        for (let i = 0; i < 15; i++) {
            const dot = document.createElement('div');
            dot.style.position = 'absolute';
            dot.style.left = `${this.x}px`;
            dot.style.top = `${this.y}px`;
            dot.style.width = '10px';
            dot.style.height = '10px';
            dot.style.backgroundColor = '#FF4500';
            document.body.appendChild(dot);

            gsap.to(dot, {
                x: (Math.random() - 0.5) * 200,
                y: (Math.random() - 0.5) * 200,
                opacity: 0,
                duration: 0.8,
                onComplete: () => dot.remove()
            });
        }
    }
}