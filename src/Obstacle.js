export class Obstacle {
    constructor(ctx, width, height, speed) {
        this.ctx = ctx;
        this.w = 30 + Math.random() * 30;
        this.h = 40 + Math.random() * 40;
        this.x = width;
        this.y = height - 50 - this.h;
        this.speed = speed;
    }

    update() {
        this.x -= this.speed;
    }

    draw() {
        this.ctx.fillStyle = '#FF4500';
        this.ctx.fillRect(this.x, this.y, this.w, this.h);
    }
}