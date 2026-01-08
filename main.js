import { Game } from './src/Game.js';
import gsap from 'gsap';

const game = new Game();
const tl = gsap.timeline();

gsap.set(".loading-content h1", { opacity: 0, y: 40, scale: 0.9 });

tl.to(".loading-content h1", {
    opacity: 1,
    y: 0,
    scale: 1,
    duration: 1.2,
    ease: "elastic.out(1, 0.5)"
})
.add(() => {
    gsap.to(".loading-content h1", {
        y: -20,
        duration: 0.5,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut"
    });
})
.to("#progress-bar", {
    width: "100%",
    duration: 3,
    ease: "none"
}, "-=0.5")
.to("#loading-screen", {
    opacity: 0,
    scale: 1.1,
    duration: 0.8,
    ease: "power2.in",
    onComplete: () => {
        document.getElementById("loading-screen").style.display = "none";
        game.init();
    }
});

const handleRestart = () => location.reload();

const restartBtn = document.getElementById('restart');
if (restartBtn) {
    restartBtn.addEventListener('click', handleRestart);
    restartBtn.addEventListener('touchend', (e) => {
        e.preventDefault();
        handleRestart();
    });
}

const resetBtn = document.getElementById('reset-link');

if (resetBtn) {
    const handleReset = (e) => {
        e.preventDefault(); 
        localStorage.removeItem('peachJumpHighScore_v1');
        location.reload();
    };

    
    resetBtn.addEventListener('click', handleReset);
    
    
    resetBtn.addEventListener('touchend', handleReset);
}
