import { Game } from './src/Game.js';
import gsap from 'gsap';

const game = new Game();
const tl = gsap.timeline();


gsap.to(".loading-content h1", {
    y: -20,
    duration: 0.5,
    repeat: -1,
    yoyo: true,
    ease: "power1.inOut"
});

tl.to("#progress-bar", {
    width: "100%",
    duration: 3, 
    ease: "none"
});

tl.to("#loading-screen", {
    opacity: 0,
    duration: 0.8,
    onComplete: () => {
        document.getElementById("loading-screen").style.display = "none";
        game.init(); 
    }
});

document.getElementById('restart').addEventListener('click', () => {
    location.reload();
});