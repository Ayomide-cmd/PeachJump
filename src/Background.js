import gsap from 'gsap';

export class Background {
    constructor(ctx, width, height) {
        this.ctx = ctx;
        this.width = width;
        this.height = height;
        this.clouds = [
            { x: 100, y: 100, w: 120, s: 0.5 },
            { x: 400, y: 150, w: 180, s: 0.3 },
            { x: 700, y: 80, w: 150, s: 0.4 }
        ];
    }

    draw() {
        this.ctx.fillStyle = '#FFDAB9';
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        this.clouds.forEach(c => {
            this.ctx.beginPath();
            this.ctx.roundRect(c.x, c.y, c.w, 40, 20);
            this.ctx.fill();
            c.x -= c.s;
            if (c.x + c.w < 0) c.x = this.width + 50;
        });

        this.ctx.fillStyle = '#FFB347';
        this.ctx.fillRect(0, this.height - 50, this.width, 50);
    }
}