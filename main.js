// ================= SCENE =================
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);

// ================= LIGHTING =================
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const sunLight = new THREE.DirectionalLight(0xffffff, 0.8);
sunLight.position.set(10, 20, 10);
scene.add(sunLight);

// ================= CAMERA =================
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

camera.position.set(10, 10, 20);
camera.lookAt(8, 0, 8);

// ================= RENDERER =================
const canvas = document.getElementById("game");

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// ================= WORLD =================
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshLambertMaterial({ color: 0x4caf50 });

const size = 16;
const blocks = [];

for (let x = 0; x < size; x++) {
  for (let z = 0; z < size; z++) {
    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(x, 0, z);
    scene.add(cube);
    blocks.push(cube);
  }
}

// ================= INPUT =================
const keys = {};

window.addEventListener("keydown", (e) => {
  keys[e.key.toLowerCase()] = true;
});

window.addEventListener("keyup", (e) => {
  keys[e.key.toLowerCase()] = false;
});

// ================= FPS CAMERA =================
let rotationX = 0;
let rotationY = 0;
const sensitivity = 0.0015;

document.addEventListener("mousemove", (event) => {
  if (document.pointerLockElement !== canvas) return;

  rotationY -= event.movementX * sensitivity;
  rotationX -= event.movementY * sensitivity;

  rotationX = Math.max(-1.2, Math.min(1.2, rotationX));
});

canvas.addEventListener("click", () => {
  canvas.requestPointerLock();
});

// ================= RAYCASTING =================
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener("contextmenu", (e) => e.preventDefault());

window.addEventListener("mousedown", (event) => {

  mouse.x = 0;
  mouse.y = 0;

  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(blocks);

  if (intersects.length === 0) return;

  const hit = intersects[0];
  const target = hit.object;

  // LEFT CLICK → break
  if (event.button === 0) {
    scene.remove(target);

    const index = blocks.indexOf(target);
    if (index > -1) blocks.splice(index, 1);
  }

  // RIGHT CLICK → place (face-based)
  if (event.button === 2) {
    const newBlock = target.clone();
    newBlock.position.copy(target.position);
    newBlock.position.add(hit.face.normal);

    scene.add(newBlock);
    blocks.push(newBlock);
  }
});

// ================= LOOP =================
function animate() {
  requestAnimationFrame(animate);

  camera.rotation.order = "YXZ";
  camera.rotation.y = rotationY;
  camera.rotation.x = rotationX;

  const forward = new THREE.Vector3(
    -Math.sin(rotationY),
    0,
    -Math.cos(rotationY)
  );

  const right = new THREE.Vector3(
    -forward.z,
    0,
    forward.x
  );

  const moveSpeed = 0.05;

  let nextPos = camera.position.clone();

  if (keys["w"]) nextPos.add(forward.clone().multiplyScalar(moveSpeed));
  if (keys["s"]) nextPos.add(forward.clone().multiplyScalar(-moveSpeed));
  if (keys["a"]) nextPos.add(right.clone().multiplyScalar(-moveSpeed));
  if (keys["d"]) nextPos.add(right.clone().multiplyScalar(moveSpeed));

// UP (Space)
 if (keys[" "]) {
  nextPos.y += moveSpeed;
 }

// DOWN (Shift)
if (keys["shift"]) {
  nextPos.y -= moveSpeed;
 }

  camera.position.copy(nextPos);

  renderer.render(scene, camera);
}

animate();

// ================= RESIZE =================
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});