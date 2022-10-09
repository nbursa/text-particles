// global vars
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let particleArray = [];

// handle mouse
const mouse = {
    x: null,
    y: null,
    radius: 150,
}

window.addEventListener('mousemove', function(event) {
    mouse.x = event.x;
    mouse.y = event.y;
    mouse.radius = 150;
});

// insert text on canvas
ctx.font = '30px Verdana';
ctx.fillStyle = 'white';
ctx.fillText('A', 0, 30);
const data = ctx.getImageData(0, 0, 100, 100);

// create particle
class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 3;
        this.initialX = this.x;
        this.initialY = this.y;
        this.density = (Math.random() * 30) + 1;
    }

    draw() {
        ctx.fillStyle = 'yellow';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    }

    // calculate distance between cursor and particle
    update() {
        let distanceX = mouse.x - this.x;
        let distanceY = mouse.y - this.y;
        let distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
        let forceDirectionX = distanceX / distance;
        let forceDirectionY = distanceY / distance;
        let maxDistance = mouse.radius;
        let force = (maxDistance - distance) / maxDistance;
        let directionX = forceDirectionX * force * this.density;
        let directionY = forceDirectionY * force * this.density;
        if(distance < mouse.radius) {
            this.x -= directionX;
            this.y -= directionY;
        } else {
            if(this.x !== this.initialX) {
                let dx = this.x - this.initialX;
                this.x -= dx / 5;
            }
            if(this.y !== this.initialY) {
                let dy = this.y - this.initialY;
                this.y -= dy / 5;
            }
        }
    }
}

// fill particleArray with particles
function init() {
    particleArray = [];
    for(let i = 0; i < 500; i++) {
        let x = Math.random() * canvas.width;
        let y = Math.random() * canvas.height;
        particleArray.push(new Particle(x, y));
    }
}

init();

// animation loop (redraw canvas on every frame)
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for(let i = 0; i < particleArray.length; i++) {
        particleArray[i].draw();
        particleArray[i].update();
    }
    requestAnimationFrame(animate);
}

animate();
