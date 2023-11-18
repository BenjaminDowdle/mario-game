const groundPlatform = new Image();
groundPlatform.src = "./img/groundPlatform.png";

const backgroundSky = new Image();
backgroundSky.src = "./img/background-sky.png";

const wellWall = new Image();
wellWall.src = "./img/wall-well.png";

const backgroundWellWall = new Image();
backgroundWellWall.src = "./img/background-well-wall.png";

const mountain1 = new Image();
mountain1.src = "./img/mountain1.png";

const mountain2 = new Image();
mountain2.src = "./img/mountain2.png";

const wellTop = new Image();
wellTop.src = "./img/well-top.png";

const cloud1 = new Image();
cloud1.src = "./img/cloud1.png";

const cloud2 = new Image();
cloud2.src = "./img/cloud2.png";

const cloud3 = new Image();
cloud3.src = "./img/cloud3.png";

const backgroundWell = new Image();
backgroundWell.src = "./img/background-well.png";

const wellFloor = new Image();
wellFloor.src = "./img/well-floor.png";

console.log(groundPlatform);

const stop = false;
let frameCount = 0;
var fps, fpsInterval, startTime, now, then, elapsed;

const canvas = document.querySelector("canvas");

const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

const gravity = 2;

class Player {
  constructor() {
    this.position = {
      x: 100,
      y: 200,
    };
    this.velocity = {
      x: 0,
      y: 0,
    };

    this.width = 32;
    this.height = 64;
  }

  draw() {
    c.fillStyle = "red";
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }

  update() {
    this.draw();
    this.position.y += this.velocity.y;
    this.position.x += this.velocity.x;

    if (this.position.y + this.height + this.velocity.y < canvas.height - 60) {
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

    this.velocity = {
      y: 0,
    };
    this.width = image.width;
    this.height = image.height;

    this.image = image;
  }

  draw() {
    c.drawImage(this.image, this.position.x, this.position.y);
  }

  fall() {
    this.draw();
    this.position.y -= this.velocity.y;

    this.velocity.y += gravity;
  }
}

class GenericObject {
  constructor({ x, y, image, parallax, speed }) {
    this.position = {
      x,
      y,
    };

    this.velocity = {
      y: 0,
    };
    this.width = image.width;
    this.height = image.height;

    this.image = image;

    this.parallax = parallax;
    this.speed = speed;
  }

  draw() {
    c.drawImage(this.image, this.position.x, this.position.y);
  }

  fall() {
    this.draw();
    this.position.y -= this.velocity.y;

    this.velocity.y += gravity;
  }
}

const player = new Player();
const platforms = [
  new Platform({ x: 0, y: 512, image: groundPlatform }),
  new Platform({ x: 576, y: 512, image: groundPlatform }),
  new Platform({ x: 1216, y: 512, image: groundPlatform }),
  new Platform({ x: 1144, y: 480, image: wellWall }),
  new Platform({ x: 1216, y: 480, image: wellWall }),
  new Platform({ x: 1100, y: 1200, image: wellFloor }),
];

const genericObjects = [
  new GenericObject({
    x: -600,
    y: 0,
    image: backgroundSky,
    parallax: true,
    speed: -1,
  }),

  new GenericObject({
    x: 400,
    y: 384,
    image: mountain2,
    parallax: true,
    speed: 1.9,
  }),
  new GenericObject({
    x: 300,
    y: 384,
    image: mountain1,
    parallax: true,
    speed: 2,
  }),
  new GenericObject({ x: 644, y: 512, image: backgroundWell, parallax: false }),
  new GenericObject({
    x: 1152,
    y: 480,
    image: backgroundWellWall,
    parallax: false,
  }),
  new GenericObject({ x: 1144, y: 416, image: wellTop, parallax: false }),
  new GenericObject({
    x: 300,
    y: 200,
    image: cloud1,
    parallax: true,
    speed: 1,
  }),
  new GenericObject({
    x: 400,
    y: 220,
    image: cloud2,
    parallax: true,
    speed: 1.1,
  }),
  new GenericObject({
    x: 700,
    y: 350,
    image: cloud3,
    parallax: true,
    speed: 1,
  }),
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

    genericObjects.forEach((object) => {
      object.draw();
    });

    platforms.forEach((platform) => {
      platform.draw();
    });
    player.update();

    if (keys.right.pressed && player.position.x < 400) {
      player.velocity.x = 6;
    } else if (keys.left.pressed && player.position.x > 100) {
      player.velocity.x = -6;
    } else {
      player.velocity.x = 0;

      if (keys.right.pressed) {
        platforms.forEach((platform) => {
          platform.position.x -= 6;
        });

        genericObjects.forEach((object) => {
          if (object.parallax) {
            object.position.x -= object.speed;
          } else {
            object.position.x -= 6;
          }
        });
      } else if (keys.left.pressed) {
        platforms.forEach((platform) => {
          platform.position.x += 6;
        });

        genericObjects.forEach((object) => {
          if (object.parallax) {
            object.position.x += object.speed;
          } else {
            object.position.x += 6;
          }
        });
      }
    }

    platforms.forEach((platform) => {
      if (
        player.position.y + player.height <= platform.position.y + 2 &&
        player.position.y + player.height + player.velocity.y >=
          platform.position.y + 2 &&
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
