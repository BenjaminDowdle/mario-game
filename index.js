const groundPlatform = new Image();
groundPlatform.src = "./img/groundPlatform.png";

console.log(groundPlatform);

const stop = false;
let frameCount = 0;
var fps, fpsInterval, startTime, now, then, elapsed;

const canvas = document.querySelector("canvas");

const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

const gravity = 1.5;

class Player {
  constructor() {
    this.position = {
      x: 100,
      y: 400,
    };
    this.velocity = {
      x: 0,
      y: 0,
    };

    this.width = 50;
    this.height = 50;
  }

  draw() {
    c.fillStyle = "red";
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }

  update() {
    this.draw();
    this.position.y += this.velocity.y;
    this.position.x += this.velocity.x;

    if (this.position.y + this.height + this.velocity.y < canvas.height) {
      this.velocity.y += gravity;
    } else {
      this.velocity.y = 0;
    }
  }
}

class Platform {
  constructor({ x, y, image }) {
    this.position = {
      x,
      y,
    };
    this.width = image.width;
    this.height = image.height;

    this.image = image;
  }

  draw() {
    c.drawImage(this.image, this.position.x, this.position.y);
  }
}

const player = new Player();
const platforms = [
  new Platform({ x: 0, y: 512, image: groundPlatform }),
  new Platform({ x: 576, y: 512, image: groundPlatform }),
];

const keys = {
  right: {
    pressed: false,
  },
  left: {
    pressed: false,
  },
  down: {
    pressed: false,
  },
  up: {
    pressed: false,
  },
};

function animate() {
  requestAnimationFrame(animate);

  now = Date.now();
  elapsed = now - then;

  if (elapsed > fpsInterval) {
    then = now - (elapsed % fpsInterval);

    c.clearRect(0, 0, canvas.width, canvas.height);

    platforms.forEach((platform) => {
      platform.draw();
    });
    player.update();

    if (keys.right.pressed && player.position.x < 400) {
      player.velocity.x = 8;
    } else if (keys.left.pressed && player.position.x > 100) {
      player.velocity.x = -8;
    } else {
      player.velocity.x = 0;

      if (keys.right.pressed) {
        platforms.forEach((platform) => {
          platform.position.x -= 8;
        });
      } else if (keys.left.pressed) {
        platforms.forEach((platform) => {
          platform.position.x += 8;
        });
      }
    }

    platforms.forEach((platform) => {
      if (
        player.position.y + player.height <= platform.position.y &&
        player.position.y + player.height + player.velocity.y >=
          platform.position.y &&
        player.position.x + player.width >= platform.position.x &&
        player.position.x <= platform.position.x + platform.width
      ) {
        player.velocity.y = 0;
      }
    });
  }
}

function startAnimating(fps) {
  fpsInterval = 1000 / fps;
  then = Date.now();
  startTime = then;
  animate();
}

startAnimating(60);

addEventListener("keydown", ({ keyCode }) => {
  switch (keyCode) {
    case 65:
      keys.left.pressed = true;
      break;
    case 83:
      keys.down.pressed = true;
      break;
    case 68:
      keys.right.pressed = true;
      break;
    case 87:
    case 32:
      if (player.velocity.y === 0) player.velocity.y -= 25;
      break;
  }
});

addEventListener("keyup", ({ keyCode }) => {
  switch (keyCode) {
    case 65:
      keys.left.pressed = false;
      break;
    case 83:
      break;
    case 68:
      keys.right.pressed = false;
      break;
    case 87:
    case 32:
      if (player.velocity.y === 0) player.velocity.y -= 20;
      break;
  }
});
