// Koi Pond Background Animation
// Modified from original Koi-Fish-master for background use

class Fish {
  constructor(dx, dy, radius, id, c, foodarr) {
    const colors = [
      "#d7dde5",
      "#ea4504", 
      "#d8d215",
      "#d61515",
      "#ff9400",
      "black",
      "#d8d8d8",
      "white"
    ];

    this.headColor = colors[Math.round(Math.random() * (colors.length - 1))];
    this.bodyColor = colors[Math.round(Math.random() * (colors.length - 1))];
    this.tailColor = colors[Math.round(Math.random() * (colors.length - 1))];
    this.neckColor = colors[Math.round(Math.random() * (colors.length - 1))];
    this.finColor = colors[Math.round(Math.random() * (colors.length - 1))];
    this.tailFinColor = colors[Math.round(Math.random() * (colors.length - 1))];

    const width = c.canvas.width;
    const height = c.canvas.height;

    this.x = (0.15 + 0.7 * Math.random()) * width;
    this.y = (0.15 + 0.7 * Math.random()) * height;
    this.dx = dx;
    this.dy = dy;
    this.radius = radius;
    this.time = Math.random() * 5;
    this.tipTime = Math.random() * 5;
    this.angles = [];
    this.foodPotential = 0;
    this.c = c;
    this.foodarr = foodarr;

    this.speed = (this.dx * this.dx) + (this.dy + this.dy);
    this.fishLength = Math.round(40 / Math.sqrt(this.speed));

    // Initialize angles array
    while (this.angles.length < this.fishLength) {
      this.angles.unshift([Math.atan(this.dx/this.dy), 1]);
    }
  }

  draw() {
    if (this.dx === 0) {
      this.dx = 0.001;
    }

    let cc = true;
    let mc = false;
    let nd = 1;
    if (this.dx >= 0) {
      cc = false;
      mc = true;
      nd = 1;
    } else {
      nd = -1;
    }

    const headAngle = Math.atan(this.dy / this.dx);
    this.angles.unshift([headAngle, nd, cc]);
    if (this.angles.length > this.fishLength) {
      this.angles.pop();
    }

    const neckDistance = 0.5;
    const neckX = this.x - this.angles[5][1] * neckDistance * (Math.cos(this.angles[5][0]));
    const neckY = this.y - this.angles[5][1] * neckDistance * (Math.sin(this.angles[5][0]));

    const bodyDistance = 10;
    const bodyPosition = 15;
    const bodyX = this.x - this.angles[bodyPosition][1] * bodyDistance * (Math.cos(this.angles[bodyPosition][0]));
    const bodyY = this.y - this.angles[bodyPosition][1] * bodyDistance * (Math.sin(this.angles[bodyPosition][0]));

    const tipDistance = 7;
    const tip1X = neckX - tipDistance * Math.sin(headAngle);
    const tip1Y = neckY + tipDistance * Math.cos(headAngle);
    const tip2X = neckX + tipDistance * Math.sin(headAngle);
    const tip2Y = neckY - tipDistance * Math.cos(headAngle);

    const bodySegment1Distance = 17;
    const body1X = neckX - this.angles[5][1] * bodySegment1Distance * (Math.cos(this.angles[5][0]));
    const body1Y = neckY - this.angles[5][1] * bodySegment1Distance * (Math.sin(this.angles[5][0]));

    const bodySegment1Width = 7;
    const body1LX = body1X - bodySegment1Width * Math.sin(headAngle);
    const body1LY = body1Y + bodySegment1Width * Math.cos(headAngle);
    const body1RX = body1X + bodySegment1Width * Math.sin(headAngle);
    const body1RY = body1Y - bodySegment1Width * Math.cos(headAngle);

    const bodyTipDistance = 35;
    let bodyTipX = neckX - this.angles[10][1] * bodyTipDistance * (Math.cos(this.angles[10][0]));
    let bodyTipY = neckY - this.angles[10][1] * bodyTipDistance * (Math.sin(this.angles[10][0]));

    // Handle body wagging
    this.tipTime += Math.sqrt(this.dx * this.dx + this.dy * this.dy) / 22;
    const bodyTipOX = -1 * Math.sin(headAngle);
    const bodyTipOY = Math.cos(headAngle);
    const bodyOscillation = 8 * Math.sin(this.tipTime);
    bodyTipX += bodyTipOX * bodyOscillation;
    bodyTipY += bodyTipOY * bodyOscillation;

    let tailDir;
    const tailDX = neckX - bodyTipX;
    if (tailDX >= 0) {
      tailDir = false;
    } else {
      tailDir = true;
    }

    const tailDY = neckY - bodyTipY;
    const tailAngle = Math.atan(tailDY / tailDX);

    // Draw tail
    this.c.beginPath();
    this.c.ellipse(
      bodyTipX,
      bodyTipY,
      0.5 * this.radius,
      0.25 * this.radius,
      tailAngle,
      -Math.PI / 2,
      Math.PI / 2,
      tailDir
    );
    this.c.fillStyle = this.tailFinColor;
    this.c.strokeStyle = 'black';
    this.c.lineWidth = 0.5;
    this.c.stroke();
    this.c.fill();

    // Draw body
    this.c.beginPath();
    this.c.moveTo(tip1X, tip1Y);
    this.c.quadraticCurveTo(body1LX, body1LY, bodyTipX, bodyTipY);
    this.c.quadraticCurveTo(body1RX, body1RY, tip2X, tip2Y);
    this.c.lineTo(tip1X, tip1Y);
    this.c.fillStyle = this.bodyColor;
    this.c.fill();

    // Draw side fin
    const finOscillate = 0.7 + 0.075 * Math.sin(this.time);
    this.c.beginPath();
    this.c.ellipse(
      neckX,
      neckY,
      0.5 * this.radius,
      finOscillate * this.radius,
      headAngle,
      -Math.PI / 2,
      Math.PI / 2,
      cc
    );
    this.c.strokeStyle = 'black';
    this.c.lineWidth = 0.5;
    this.c.stroke();
    this.c.fillStyle = this.finColor;
    this.c.fill();

    // Draw neck
    this.c.beginPath();
    this.c.arc(neckX, neckY, 7, 0, 2 * Math.PI, false);
    this.c.fillStyle = this.headColor;
    this.c.fill();

    // Draw head
    this.c.beginPath();
    this.c.ellipse(
      this.x,
      this.y,
      this.radius,
      this.radius / 2,
      headAngle,
      -Math.PI / 2,
      Math.PI / 2,
      cc
    );
    this.c.fillStyle = this.headColor;
    this.c.fill();
  }

  distance(x0, y0, x1, y1) {
    return Math.sqrt(Math.pow(x0 - x1, 2) + Math.pow(y0 - y1, 2));
  }

  speedDif(initial, desired) {
    return Math.abs(initial - desired) / Math.abs(initial);
  }

  chaseFood() {
    let chaseIndex = 0;
    for (let a = 0; a < this.foodarr.length; a++) {
      if (
        this.distance(this.x, this.y, this.foodarr[a].x, this.foodarr[a].y) <
        this.distance(this.x, this.y, this.foodarr[chaseIndex].x, this.foodarr[chaseIndex].y)
      ) {
        chaseIndex = a;
      }
    }

    if (this.distance(this.x, this.y, this.foodarr[chaseIndex].x, this.foodarr[chaseIndex].y) < 30) {
      if (this.foodPotential < 30) {
        this.foodPotential += 10;
      }
    }

    const yDif = this.foodarr[chaseIndex].y - this.y;
    const xDif = this.foodarr[chaseIndex].x - this.x;
    const angle = Math.atan(yDif / xDif);

    let foodDir = 1;
    if (xDif < 0) {
      foodDir = -1;
    }

    const turnChange = 0.07;
    this.dfy = (this.dy * Math.sin(angle) * foodDir);
    this.dfx = (this.dx * Math.cos(angle) * foodDir);

    if (this.speedDif(this.dx, this.dfx) > 0.01) {
      this.dx = (1 - turnChange) * this.dx + turnChange * this.dfx;
    }

    if (this.speedDif(this.dy, this.dfy) > 0.01) {
      this.dy = (1 - turnChange) * this.dy + turnChange * this.dfy;
    }

    // Eat the food
    for (let f = 0; f < this.foodarr.length; f++) {
      if (this.distance(this.x, this.y, this.foodarr[f].x, this.foodarr[f].y) < 20) {
        this.foodarr.splice(f, 1);
      }
    }
  }

  update() {
    const width = this.c.canvas.width;
    const height = this.c.canvas.height;
    const margin = this.radius + 10; // Safety margin

    // Simple and robust boundary handling
    // Right boundary
    if (this.x + this.radius >= width - margin) {
      this.x = width - margin - this.radius;
      this.dx = -Math.abs(this.dx); // Ensure moving left
    }
    
    // Left boundary
    if (this.x - this.radius <= margin) {
      this.x = margin + this.radius;
      this.dx = Math.abs(this.dx); // Ensure moving right
    }
    
    // Bottom boundary
    if (this.y + this.radius >= height - margin) {
      this.y = height - margin - this.radius;
      this.dy = -Math.abs(this.dy); // Ensure moving up
    }
    
    // Top boundary
    if (this.y - this.radius <= margin) {
      this.y = margin + this.radius;
      this.dy = Math.abs(this.dy); // Ensure moving down
    }

    // Add some randomness to prevent fish from getting stuck in patterns
    if (Math.random() < 0.01) {
      this.dx += (Math.random() - 0.5) * 0.1;
      this.dy += (Math.random() - 0.5) * 0.1;
    }

    // Gentle steering away from boundaries when approaching
    const steerForce = 0.02;
    const boundaryZone = 50;
    
    // Steer away from right edge
    if (this.x > width - boundaryZone) {
      this.dx -= steerForce;
    }
    // Steer away from left edge
    if (this.x < boundaryZone) {
      this.dx += steerForce;
    }
    // Steer away from bottom edge
    if (this.y > height - boundaryZone) {
      this.dy -= steerForce;
    }
    // Steer away from top edge
    if (this.y < boundaryZone) {
      this.dy += steerForce;
    }
  }

  calcSpeed(xv, yv) {
    return Math.sqrt(xv * xv + yv * yv);
  }

  controlSpeed() {
    const currentSpeed = this.calcSpeed(this.dx, this.dy);
    const maxSpeed = 2.0;
    const minSpeed = 0.3;
    
    // Limit maximum speed
    if (currentSpeed > maxSpeed) {
      const scale = maxSpeed / currentSpeed;
      this.dx *= scale;
      this.dy *= scale;
    }
    
    // Ensure minimum speed to prevent getting stuck
    if (currentSpeed < minSpeed) {
      if (currentSpeed > 0) {
        const scale = minSpeed / currentSpeed;
        this.dx *= scale;
        this.dy *= scale;
      } else {
        // If completely stopped, give random direction
        this.dx = (Math.random() - 0.5) * minSpeed;
        this.dy = (Math.random() - 0.5) * minSpeed;
      }
    }
  }

  controlChaseSpeed() {
    this.dx *= 1.05;
    this.dy *= 1.05;
  }

  rotate() {
    this.foodPotential -= 0.1 * (2 - Math.random());
    const rotation = 0.045;
    const turnX = -1 * this.dy;
    const turnY = this.dx;
    this.dx = (1 - rotation) * this.dx + rotation * turnX;
    this.dy = (1 - rotation) * this.dy + rotation * turnY;
  }

  generalBehavior() {
    const normalVectorX = -1 * this.dy;
    const normalVectorY = this.dx;

    this.time += 0.08;
    const oscillation = 0.4 * Math.sin(this.time);
    
    const degree = 0.08;

    this.dx += this.dx * degree * (Math.random() - 0.5);
    this.dx += this.dy * degree * (Math.random() - 0.5);

    this.x += this.dx + oscillation * normalVectorX;
    this.y += this.dy + oscillation * normalVectorY;
  }

  fishAnimate() {
    if (this.foodarr.length === 0) {
      this.update();
      this.controlSpeed();
    } else {
      this.chaseFood();
      this.controlChaseSpeed();
    }

    this.generalBehavior();
    this.draw();
  }
}

class LilyPad {
  constructor(c) {
    const width = c.canvas.width;
    const height = c.canvas.height;
    this.x = (0.2 + 0.65 * Math.random()) * width;
    this.y = (0.2 + 0.65 * Math.random()) * height;
    this.dx = (Math.random() - 0.5) * 1;
    this.dy = (Math.random() - 0.5) * 1;
    this.time = 0;
    this.radius = 20;
    this.c = c;

    this.startAngle = Math.random() * Math.PI * 2;

    const petalColors = [
      "#ff00fa",
      "#8c00ff", 
      "#ce3b63",
      "#e00ba7",
      "#ff35e4",
      "#7c1531",
      "#7c1531"
    ];

    this.petalColor = Math.round(Math.random() * (petalColors.length - 1));
    this.petalColors = petalColors;
    this.petalLength = 12 + Math.random() * 4;
  }

  draw() {
    this.startAngle += 0.009;

    const endAngle = this.startAngle + Math.PI;

    // Main lily pad
    this.c.beginPath();
    this.c.arc(this.x, this.y, this.radius, this.startAngle, endAngle, false);
    this.c.fillStyle = "#21af31";
    this.c.fill();

    // Lily pad highlight
    this.c.beginPath();
    this.c.arc(
      this.x,
      this.y,
      this.radius,
      this.startAngle + 1.7 * (Math.PI / 2),
      endAngle + 1.7 * (Math.PI / 2),
      false
    );
    this.c.fillStyle = "white";
    this.c.fill();

    // Lines on the lily pad
    for (let i = 0; i < 5; i++) {
      this.c.beginPath();
      this.c.moveTo(this.x, this.y);
      this.c.lineTo(
        this.x + (this.radius - 2) * Math.cos(this.startAngle + Math.PI / 2.18 * i),
        this.y + (this.radius - 2) * Math.sin(this.startAngle + Math.PI / 2.18 * i)
      );
      this.c.lineWidth = 2;
      this.c.strokeStyle = "#024219";
      this.c.stroke();
    }

    // Flower petals
    for (let i = 0; i < 4; i++) {
      this.c.beginPath();
      this.c.ellipse(
        this.x,
        this.y,
        4,
        this.petalLength,
        this.startAngle + 2 * Math.PI / 4 * i,
        0,
        Math.PI,
        true
      );
      this.c.fillStyle = this.petalColors[this.petalColor];
      this.c.fill();
    }

    for (let i = 0; i < 4; i++) {
      this.c.beginPath();
      this.c.ellipse(
        this.x,
        this.y,
        3,
        this.petalLength * 0.75,
        this.startAngle + Math.PI / 4 + 2 * Math.PI / 4 * i,
        0,
        Math.PI,
        true
      );
      this.c.fillStyle = this.petalColors[this.petalColor];
      this.c.fill();
    }

    // Flower center
    this.c.beginPath();
    this.c.arc(this.x, this.y, this.radius / 4, 0, 2 * Math.PI, false);
    this.c.fillStyle = "#fffa00";
    this.c.fill();
  }

  update() {
    const width = this.c.canvas.width;
    const height = this.c.canvas.height;

    if (this.x > width - 50 || this.x < 50) {
      this.dx *= -1;
    }

    if (this.y > height - 50 || this.y < 50) {
      this.dy *= -1;
    }

    this.x += this.dx;
    this.y += this.dy;
  }

  do() {
    this.update();
    this.draw();
  }
}

class Food {
  constructor(x, y, radius, c) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.dx = (Math.random() - 0.5) * 2;
    this.dy = (Math.random() - 0.5) * 2;
    this.c = c;
  }

  draw() {
    this.c.beginPath();
    this.c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    this.c.fillStyle = '#e0ac28';
    this.c.fill();
  }

  update() {
    const width = this.c.canvas.width;
    const height = this.c.canvas.height;

    if (this.x < 0.9 * width && this.x > 0.1 * width) {
      this.x += this.dx;
    }

    if (this.y < 0.9 * height && this.y > 0.1 * height) {
      this.y += this.dy;
    }
  }

  do() {
    this.update();
    this.draw();
  }
}

class KoiPond {
  constructor(canvasId, fishCount = 15, lilypadCount = 5) {
    this.canvas = document.getElementById(canvasId);
    this.c = this.canvas.getContext('2d');
    this.fishes = [];
    this.foods = [];
    this.pads = [];
    
    this.resizeCanvas();
    this.createFishes(fishCount);
    this.createPads(lilypadCount);
    
    // Bind resize event
    window.addEventListener('resize', () => this.resizeCanvas());
    
    // Start animation
    this.animate();
  }

  resizeCanvas() {
    this.canvas.width = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;
  }

  createFishes(fishCount) {
    const dx = 0.8;
    const dy = 0.8;
    const radius = 18;

    if (fishCount > this.fishes.length) {
      for (let f = this.fishes.length; f < fishCount; f++) {
        this.fishes.push(new Fish(dx, dy, radius, f, this.c, this.foods));
      }
    } else {
      const difference = this.fishes.length - fishCount;
      this.fishes = this.fishes.slice(difference);
    }
  }

  createPads(padCount) {
    if (padCount > this.pads.length) {
      for (let p = this.pads.length; p < padCount; p++) {
        this.pads.push(new LilyPad(this.c));
      }
    } else {
      const difference = this.pads.length - padCount;
      this.pads = this.pads.slice(difference);
    }
  }

  addFood(x, y) {
    this.foods.push(new Food(x, y, 5, this.c));
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    this.c.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw a subtle pond background
    const gradient = this.c.createRadialGradient(
      this.canvas.width / 2, this.canvas.height / 2, 0,
      this.canvas.width / 2, this.canvas.height / 2, Math.max(this.canvas.width, this.canvas.height) / 2
    );
    gradient.addColorStop(0, 'rgba(135, 206, 235, 0.3)'); // Light blue center
    gradient.addColorStop(1, 'rgba(70, 130, 180, 0.5)'); // Darker blue edges
    
    this.c.fillStyle = gradient;
    this.c.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Animate elements
    for (let j = 0; j < this.foods.length; j++) {
      this.foods[j].do();
    }

    for (let i = 0; i < this.fishes.length; i++) {
      this.fishes[i].fishAnimate();
    }

    for (let k = 0; k < this.pads.length; k++) {
      this.pads[k].do();
    }
  }
}

// Make KoiPond available globally
window.KoiPond = KoiPond; 