// global vars
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let particleArray = [];
let adjustX = 6;
let adjustY = 1;

// handle mouse
const mouse = {
    x: null,
    y: null,
    radius: 200,
}

window.addEventListener('mousemove', function(event) {
    mouse.x = event.x;
    mouse.y = event.y;
    mouse.radius = 100;
});

// insert text on canvas
ctx.font = '30px Verdana';
ctx.fillStyle = 'white';
ctx.fillText('A', 0, 30);
const textCoordinates = ctx.getImageData(0, 0, 100, 100);

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
    for(let y = 0, y2 = textCoordinates.height; y < y2; y++) {
        for(let x = 0, x2 = textCoordinates.width; x < x2; x++) {
            if(textCoordinates.data[(y * 4 * textCoordinates.width) + (x * 4) + 3] > 128) {
                let positionX = x + adjustX;
                let positionY = y + adjustY;
                particleArray.push(new Particle(positionX * 20, positionY * 20));
            }
        }
    }
}

init();

function connect() {
    let opacityValue = 1;
    for(let a = 0; a < particleArray.length; a++) {
        for(let b = a; b < particleArray.length; b++) {
            let dx = particleArray[a].x - particleArray[b].x;
            let dy = particleArray[a].y - particleArray[b].y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            opacityValue = 1 - (distance / 50);
            ctx.strokeStyle = `rgba(255, 255, 255, ${opacityValue})`;

            if(distance < 50) {
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(particleArray[a].x, particleArray[a].y);
                ctx.lineTo(particleArray[b].x, particleArray[b].y);
                ctx.stroke();
            }
        }
    }
}

// animation loop (redraw canvas on every frame)
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for(let i = 0; i < particleArray.length; i++) {
        particleArray[i].draw();
        particleArray[i].update();
    }
    connect();
    requestAnimationFrame(animate);
}

animate();
