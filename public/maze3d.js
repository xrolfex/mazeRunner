/* global THREE, close3DModal */
/**
 * maze3d.js
 *
 * Handles 3D rendering and first-person navigation of the maze using Three.js.
 *
 * Exposes renderMaze3D(maze, start, end) and disposeMaze3D() to the window.
 *
 * Features:
 * - Renders maze walls, floor, start/end markers in 3D
 * - First-person camera controls (arrow keys, WASD look, pointer lock)
 * - Responsive resizing and pointer lock overlay
 * - Finish popup when player reaches the end
 *
 * Author: [Your Name or Team]
 * Date: 2025-04-28
 */

// public/maze3d.js
// This script renders the maze in 3D using Three.js and allows first-person navigation with arrow keys.

let camera, scene, renderer, mazeGroup;
let player = { x: 0, y: 0, tx: 0, ty: 0, moving: false };
let mazeData, start, end;
let cellSize = 5;
// Remove unused variables for lint compliance
// let moveSpeed = 0.15; // smaller = slower
let moveLerp = 0.12; // interpolation factor
// let moveQueue = [];
let yaw = 0, pitch = 0;
let isPointerLocked = false;
let animationId = null;
let pointerLockOverlay = null;
let keysDown = {};

/**
 * Handles 3D rendering and navigation for the maze using Three.js.
 *
 * @function renderMaze3D
 * @param {number[][]} maze - 2D maze array
 * @param {number[]} start - Start cell [row, col]
 * @param {number[]} end - End cell [row, col]
 * @global
 */
function renderMaze3D(maze, startPoint, endPoint) {
    mazeData = maze;
    start = startPoint;
    end = endPoint;
    player.x = player.tx = start[1];
    player.y = player.ty = start[0];
    player.moving = false;
    // moveQueue = [];
    yaw = 0;
    pitch = 0;
    isPointerLocked = false;

    // Remove previous renderer if exists
    if (renderer) {
        renderer.dispose();
        document.getElementById('maze-3d-container').innerHTML = '';
    }

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x222222);
    const container = document.getElementById('maze-3d-container');
    camera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    container.appendChild(renderer.domElement);

    // Lighting
    const ambient = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambient);
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
    dirLight.position.set(10, 20, 10);
    scene.add(dirLight);

    // Maze walls
    mazeGroup = new THREE.Group();
    for (let y = 0; y < maze.length; y++) {
        for (let x = 0; x < maze[y].length; x++) {
            if (maze[y][x] === 1) { // wall
                const wallGeo = new THREE.BoxGeometry(cellSize, cellSize, cellSize);
                const wallMat = new THREE.MeshStandardMaterial({ color: 0x4444aa });
                const wall = new THREE.Mesh(wallGeo, wallMat);
                wall.position.set(x * cellSize, cellSize / 2, y * cellSize);
                mazeGroup.add(wall);
            }
        }
    }
    scene.add(mazeGroup);

    // Floor
    const floorGeo = new THREE.PlaneGeometry(maze[0].length * cellSize, maze.length * cellSize);
    const floorMat = new THREE.MeshStandardMaterial({ color: 0x888888 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.set((maze[0].length * cellSize) / 2 - cellSize / 2, 0, (maze.length * cellSize) / 2 - cellSize / 2);
    scene.add(floor);

    // Start and end markers
    const startGeo = new THREE.CylinderGeometry(cellSize/3, cellSize/3, cellSize/2, 16);
    const startMat = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    const startMesh = new THREE.Mesh(startGeo, startMat);
    startMesh.position.set(start[1] * cellSize, cellSize / 4, start[0] * cellSize);
    scene.add(startMesh);
    const endGeo = new THREE.CylinderGeometry(cellSize/3, cellSize/3, cellSize/2, 16);
    const endMat = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    const endMesh = new THREE.Mesh(endGeo, endMat);
    endMesh.position.set(end[1] * cellSize, cellSize / 4, end[0] * cellSize);
    scene.add(endMesh);

    // Camera setup
    updateCamera(true);

    // Pointer lock overlay setup
    pointerLockOverlay = document.createElement('div');
    pointerLockOverlay.style.position = 'absolute';
    pointerLockOverlay.style.top = 0;
    pointerLockOverlay.style.left = 0;
    pointerLockOverlay.style.width = '100%';
    pointerLockOverlay.style.height = '100%';
    pointerLockOverlay.style.background = 'rgba(0,0,0,0.5)';
    pointerLockOverlay.style.color = '#fff';
    pointerLockOverlay.style.display = 'none';
    pointerLockOverlay.style.alignItems = 'center';
    pointerLockOverlay.style.justifyContent = 'center';
    pointerLockOverlay.style.zIndex = 10001;
    pointerLockOverlay.style.fontSize = '2rem';
    pointerLockOverlay.innerText = 'Click to resume mouse look';
    pointerLockOverlay.style.cursor = 'pointer';
    pointerLockOverlay.addEventListener('click', () => {
        container.requestPointerLock();
    });
    const modal = document.getElementById('maze3d-modal');
    if (modal) modal.appendChild(pointerLockOverlay);

    // Add finish popup (hidden by default)
    let finishPopup = document.getElementById('maze3d-finish-popup');
    if (!finishPopup) {
        finishPopup = document.createElement('div');
        finishPopup.id = 'maze3d-finish-popup';
        finishPopup.style.position = 'absolute';
        finishPopup.style.top = '0';
        finishPopup.style.left = '0';
        finishPopup.style.width = '100%';
        finishPopup.style.height = '100%';
        finishPopup.style.background = 'rgba(0,0,0,0.7)';
        finishPopup.style.display = 'none';
        finishPopup.style.alignItems = 'center';
        finishPopup.style.justifyContent = 'center';
        finishPopup.style.zIndex = 10002;
        finishPopup.innerHTML = '<div style="background:#222;padding:40px 60px;border-radius:16px;color:#fff;font-size:2rem;text-align:center;box-shadow:0 0 30px #000;">You finished!<br><button id="maze3d-finish-ok" style="margin-top:30px;font-size:1.5rem;padding:8px 32px;border-radius:8px;border:none;background:#4caf50;color:#fff;cursor:pointer;">OK</button></div>';
        if (modal) modal.appendChild(finishPopup);
    }
    document.getElementById('maze3d-finish-ok')?.addEventListener('click', () => {
        if (window.parent && window.parent.close3DModal) window.parent.close3DModal();
        if (typeof close3DModal === 'function') close3DModal();
    });

    // Pointer lock for mouse look
    container.addEventListener('click', () => {
        if (!isPointerLocked) container.requestPointerLock();
    });
    document.addEventListener('pointerlockchange', onPointerLockChange);
    document.addEventListener('mousemove', onMouseMove);
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', (event) => {
        keysDown[event.key.toLowerCase()] = false;
    });
    window.addEventListener('resize', onWindowResize);

    animate();
}

function updateCamera(force = false) {
    // Interpolated camera position
    player.x += (player.tx - player.x) * moveLerp;
    player.y += (player.ty - player.y) * moveLerp;
    // Calculate look direction from yaw/pitch
    const px = player.x * cellSize;
    const py = cellSize * 0.7;
    const pz = player.y * cellSize;
    const lx = px + Math.cos(yaw) * Math.cos(pitch);
    const ly = py + Math.sin(pitch);
    const lz = pz + Math.sin(yaw) * Math.cos(pitch);
    camera.position.set(px, py, pz);
    camera.lookAt(lx, ly, lz);
    if (force) {
        camera.position.set(px, py, pz);
        camera.lookAt(px + 1, py, pz);
    }
}

function animate() {
    animationId = requestAnimationFrame(animate);
    // Always update camera for mouse look, even if not moving
    updateCamera();
    renderer.render(scene, camera);
}

function onMouseMove(e) {
    if (!isPointerLocked) return;
    const sensitivity = 0.0025;
    yaw += e.movementX * sensitivity; // REVERSED: add instead of subtract
    pitch -= e.movementY * sensitivity;
    // Clamp pitch
    const maxPitch = Math.PI / 2 - 0.1;
    if (pitch > maxPitch) pitch = maxPitch;
    if (pitch < -maxPitch) pitch = -maxPitch;
}

function onKeyDown(event) {
    keysDown[event.key.toLowerCase()] = true;
    handleMovementAndLook();
}

function handleMovementAndLook() {
    if (!mazeData) return;
    // Look controls (WASD)
    const lookStep = 0.08;
    if (keysDown['w']) {
        pitch -= lookStep;
    }
    if (keysDown['s']) {
        pitch += lookStep;
    }
    if (keysDown['a']) {
        yaw -= lookStep;
    }
    if (keysDown['d']) {
        yaw += lookStep;
    }
    // Clamp pitch
    const maxPitch = Math.PI / 2 - 0.1;
    if (pitch > maxPitch) pitch = maxPitch;
    if (pitch < -maxPitch) pitch = -maxPitch;
    // Movement controls (arrows)
    let dx = 0, dy = 0;
    const moveStep = 0.2;
    if (keysDown['arrowup']) {
        dx += Math.cos(yaw) * moveStep;
        dy += Math.sin(yaw) * moveStep;
    }
    if (keysDown['arrowdown']) {
        dx -= Math.cos(yaw) * moveStep;
        dy -= Math.sin(yaw) * moveStep;
    }
    if (keysDown['arrowleft']) {
        dx += Math.cos(yaw - Math.PI / 2) * moveStep;
        dy += Math.sin(yaw - Math.PI / 2) * moveStep;
    }
    if (keysDown['arrowright']) {
        dx += Math.cos(yaw + Math.PI / 2) * moveStep;
        dy += Math.sin(yaw + Math.PI / 2) * moveStep;
    }
    // Wall collision with sliding
    let nx = player.tx + dx;
    let ny = player.ty + dy;
    const canMove = (x, y) => (
        y >= 0 && y < mazeData.length &&
        x >= 0 && x < mazeData[0].length &&
        mazeData[Math.round(y)][Math.round(x)] === 0
    );
    if (dx !== 0 || dy !== 0) {
        if (canMove(nx, ny)) {
            player.tx = nx;
            player.ty = ny;
        } else if (canMove(player.tx + dx, player.ty)) {
            player.tx += dx; // Slide along X
        } else if (canMove(player.tx, player.ty + dy)) {
            player.ty += dy; // Slide along Y
        }
        // moveQueue = [[player.tx, player.ty]];
        // Check for finish
        if (Math.round(player.tx) === end[1] && Math.round(player.ty) === end[0]) {
            showFinishPopup();
        }
    }
}

function showFinishPopup() {
    const finishPopup = document.getElementById('maze3d-finish-popup');
    if (finishPopup) finishPopup.style.display = 'flex';
    document.exitPointerLock();
}

function onWindowResize() {
    if (!renderer || !camera) return;
    const container = document.getElementById('maze-3d-container');
    camera.aspect = container.offsetWidth / container.offsetHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.offsetWidth, container.offsetHeight);
}

function onPointerLockChange() {
    const container = document.getElementById('maze-3d-container');
    isPointerLocked = document.pointerLockElement === container;
    if (!isPointerLocked && document.getElementById('maze3d-modal').style.display === 'flex') {
        // Show overlay to prompt user to click to resume
        if (pointerLockOverlay) pointerLockOverlay.style.display = 'flex';
    } else {
        if (pointerLockOverlay) pointerLockOverlay.style.display = 'none';
    }
}

/**
 * Disposes the 3D maze renderer and event listeners.
 * @function disposeMaze3D
 * @global
 */
function disposeMaze3D() {
    if (animationId) cancelAnimationFrame(animationId);
    window.removeEventListener('keydown', onKeyDown);
    document.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('resize', onWindowResize);
    document.removeEventListener('pointerlockchange', onPointerLockChange);
    if (pointerLockOverlay && pointerLockOverlay.parentNode) pointerLockOverlay.parentNode.removeChild(pointerLockOverlay);
    pointerLockOverlay = null;
    if (renderer) {
        renderer.dispose();
        renderer.forceContextLoss && renderer.forceContextLoss();
        renderer = null;
    }
    camera = null;
    scene = null;
    mazeGroup = null;
}

// Expose to window
window.renderMaze3D = renderMaze3D;
window.disposeMaze3D = disposeMaze3D;
