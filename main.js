// ================= SCENE =================
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);

// ================= LIGHTING =================
scene.add(new THREE.AmbientLight(0xffffff, 0.6));

const sun = new THREE.DirectionalLight(0xffffff, 1);
sun.position.set(20, 30, 20);
scene.add(sun);

// ================= CAMERA =================
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

camera.position.set(16, 8, 40);

// ================= RENDERER =================
const canvas = document.getElementById("game");

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight);

// ================= MATERIALS =================
const geometry = new THREE.BoxGeometry(1, 1, 1);

const grassMaterial = new THREE.MeshLambertMaterial({
  color: 0x4caf50
});

const dirtMaterial = new THREE.MeshLambertMaterial({
  color: 0x8b5a2b
});

const stoneMaterial = new THREE.MeshLambertMaterial({
  color: 0x808080
});

// ================= HOTBAR =================
const blockTypes = [
  "grass",
  "dirt",
  "stone"
];

let selectedIndex = 0;
let selectedBlock = "grass";

function updateHotbar() {

  document
    .querySelectorAll(".slot")
    .forEach(slot =>
      slot.classList.remove("selected")
    );

  document
    .getElementById(`slot${selectedIndex + 1}`)
    .classList.add("selected");
}

// ================= WORLD =================
const blocks = [];
const size = 32;

for (let x = 0; x < size; x++) {
  for (let z = 0; z < size; z++) {

    const height = Math.floor(
      Math.sin(x * 0.3) * 2 +
      Math.cos(z * 0.3) * 2 +
      5
    );

    for (let y = 0; y < height; y++) {

      let material;

      if (y === height - 1) {
        material = grassMaterial;
      }
      else if (y >= height - 3) {
        material = dirtMaterial;
      }
      else {
        material = stoneMaterial;
      }

      const block = new THREE.Mesh(
        geometry,
        material
      );

      block.position.set(x, y, z);

      scene.add(block);
      blocks.push(block);
    }
  }
}

// ================= INPUT =================
const keys = {};

window.addEventListener("keydown", (e) => {

  keys[e.key.toLowerCase()] = true;

  if (e.key === "1") {
    selectedIndex = 0;
  }

  if (e.key === "2") {
    selectedIndex = 1;
  }

  if (e.key === "3") {
    selectedIndex = 2;
  }

  selectedBlock =
    blockTypes[selectedIndex];

  updateHotbar();

  if (e.code === "Space" && onGround) {
    velocityY = jumpPower;
  }

});

window.addEventListener("keyup", (e) => {
  keys[e.key.toLowerCase()] = false;
});

window.addEventListener("wheel", (e) => {

  if (e.deltaY > 0)
    selectedIndex++;
  else
    selectedIndex--;

  if (selectedIndex < 0)
    selectedIndex = blockTypes.length - 1;

  if (selectedIndex >= blockTypes.length)
    selectedIndex = 0;

  selectedBlock =
    blockTypes[selectedIndex];

  updateHotbar();
});

// ================= FPS LOOK =================
let rotationX = 0;
let rotationY = 0;

canvas.addEventListener("click", () => {
  canvas.requestPointerLock();
});

document.addEventListener("mousemove", (e) => {

  if (
    document.pointerLockElement !== canvas
  ) return;

  rotationY -= e.movementX * 0.002;
  rotationX -= e.movementY * 0.002;

  rotationX = Math.max(
    -1.5,
    Math.min(1.5, rotationX)
  );

});

// ================= GRAVITY =================
let velocityY = 0;
const gravity = 0.01;
const jumpPower = 0.22;
let onGround = false;

// ================= BLOCK INTERACTION =================
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener(
  "contextmenu",
  e => e.preventDefault()
);

window.addEventListener(
  "mousedown",
  (event) => {

    mouse.x = 0;
    mouse.y = 0;

    raycaster.setFromCamera(
      mouse,
      camera
    );

    const hits =
      raycaster.intersectObjects(blocks);

    if (!hits.length) return;

    const hit = hits[0];
    const target = hit.object;

    if (event.button === 0) {

      scene.remove(target);

      const i =
        blocks.indexOf(target);

      if (i > -1)
        blocks.splice(i, 1);

    }

    if (event.button === 2) {

      let mat = grassMaterial;

      if (selectedBlock === "dirt")
        mat = dirtMaterial;

      if (selectedBlock === "stone")
        mat = stoneMaterial;

      const block =
        new THREE.Mesh(
          geometry,
          mat
        );

      block.position.copy(
        target.position
      );

      block.position.add(
        hit.face.normal
      );

      scene.add(block);
      blocks.push(block);

    }

  }
);

// ================= GAME LOOP =================
function animate() {

  requestAnimationFrame(animate);

  camera.rotation.order = "YXZ";
  camera.rotation.y = rotationY;
  camera.rotation.x = rotationX;

  const speed = 0.08;

  const forward =
    new THREE.Vector3(
      -Math.sin(rotationY),
      0,
      -Math.cos(rotationY)
    );

  const right =
    new THREE.Vector3(
      -forward.z,
      0,
      forward.x
    );

  const nextPos = camera.position.clone();

if (keys["w"])
  nextPos.add(
    forward.clone().multiplyScalar(speed)
  );

if (keys["s"])
  nextPos.add(
    forward.clone().multiplyScalar(-speed)
  );

if (keys["a"])
  nextPos.add(
    right.clone().multiplyScalar(-speed)
  );

if (keys["d"])
  nextPos.add(
    right.clone().multiplyScalar(speed)
  );

if (
  !isColliding(
    nextPos.x,
    camera.position.y,
    nextPos.z
  )
) {
  camera.position.x = nextPos.x;
  camera.position.z = nextPos.z;
}

  velocityY -= gravity;
  camera.position.y += velocityY;

  // TEMP GROUND
  if (camera.position.y < 3) {

    camera.position.y = 3;

    velocityY = 0;
    onGround = true;

  } else {

    onGround = false;

  }

  renderer.render(scene, camera);

}
function isColliding(x, y, z) {

  for (const block of blocks) {

    if (
      Math.abs(block.position.x - x) < 0.6 &&
      Math.abs(block.position.y - y) < 1.5 &&
      Math.abs(block.position.z - z) < 0.6
    ) {
      return true;
    }

  }

  return false;
}
updateHotbar();
animate();

// ================= RESIZE =================
window.addEventListener(
  "resize",
  () => {

    camera.aspect =
      window.innerWidth /
      window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(
      window.innerWidth,
      window.innerHeight
    );

  }
);