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

// --- Inlined from maze3d/maze.js ---
function createMazeGroup(maze, cellSize) {
    const mazeGroup = new THREE.Group();
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
    return mazeGroup;
}
function createFloor(maze, cellSize) {
    const floorGeo = new THREE.PlaneGeometry(maze[0].length * cellSize, maze.length * cellSize);
    const floorMat = new THREE.MeshStandardMaterial({ color: 0x888888 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.set((maze[0].length * cellSize) / 2 - cellSize / 2, 0, (maze.length * cellSize) / 2 - cellSize / 2);
    return floor;
}
function createStartEndMarkers(start, end, cellSize) {
    const startGeo = new THREE.CylinderGeometry(cellSize/3, cellSize/3, cellSize/2, 16);
    const startMat = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    const startMesh = new THREE.Mesh(startGeo, startMat);
    startMesh.position.set(start[1] * cellSize, cellSize / 4, start[0] * cellSize);
    const endGeo = new THREE.CylinderGeometry(cellSize/3, cellSize/3, cellSize/2, 16);
    const endMat = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    const endMesh = new THREE.Mesh(endGeo, endMat);
    endMesh.position.set(end[1] * cellSize, cellSize / 4, end[0] * cellSize);
    return { startMesh, endMesh };
}
// --- Inlined from maze3d/camera.js ---
function createCamera(container, cellSize) {
    return new THREE.PerspectiveCamera(
        75,
        container.offsetWidth / container.offsetHeight,
        0.1,
        1000
    );
}
function updateCamera(cam, plyr, yw, ptch, cSize, mLerp, force = false) {
    // Always use the global player object
    player.x += (player.tx - player.x) * moveLerp;
    player.y += (player.ty - player.y) * moveLerp;
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
function clampPitch(pitch) {
    const maxPitch = Math.PI / 2 - 0.1;
    if (pitch > maxPitch) return maxPitch;
    if (pitch < -maxPitch) return -maxPitch;
    return pitch;
}
// --- Inlined from maze3d/solutionLine.js ---
let solutionPathCache = null;
let solutionLineVisible = false;
function renderSolutionPathModule(scene, solutionPath, cellSize) {
    if (!scene || !solutionPath || solutionPath.length === 0) {
        console.warn('No scene or empty solutionPath');
        return;
    }
    const prevLine = scene.getObjectByName('solutionLine');
    if (prevLine) scene.remove(prevLine);
    scene.traverse(obj => {
        if (obj.name && obj.name.startsWith('solutionArrow')) scene.remove(obj);
    });
    const points = solutionPath.map(([row, col]) =>
        new THREE.Vector3(
            col * cellSize,
            0.11,
            row * cellSize
        )
    );
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color: 0xffff00 });
    const line = new THREE.Line(geometry, material);
    line.name = 'solutionLine';
    line.visible = solutionLineVisible;
    scene.add(line);
}
function showSolutionLine(scene) {
    if (solutionPathCache) {
        solutionLineVisible = true;
        renderSolutionPathModule(scene, solutionPathCache.path, solutionPathCache.cellSize);
        const line = scene.getObjectByName('solutionLine');
        if (line) line.visible = true;
    }
}
function hideSolutionLine(scene) {
    const prevLine = scene.getObjectByName('solutionLine');
    if (prevLine) prevLine.visible = false;
    solutionLineVisible = false;
}
function toggleSolutionLine(scene) {
    if (solutionLineVisible) {
        hideSolutionLine(scene);
    } else {
        showSolutionLine(scene);
    }
}
function cacheSolutionPath(solutionPath, cellSize) {
    solutionPathCache = { path: solutionPath, cellSize };
    solutionLineVisible = true;
}
function isSolutionLineVisible() {
    return solutionLineVisible;
}
// --- Inlined from maze3d/ui.js ---
// let pointerLockOverlay = null; // Already declared above, do not redeclare
let finishPopup = null;
function setupPointerLockOverlay(container, onResume) {
    pointerLockOverlay = document.createElement('div');
    pointerLockOverlay.style.position = 'absolute';
    pointerLockOverlay.style.top = 0;
    pointerLockOverlay.style.left = 0;
    pointerLockOverlay.style.width = '100%';
    pointerLockOverlay.style.height = '100%';
    pointerLockOverlay.style.background = 'rgba(0,0,0,0.5)';
    pointerLockOverlay.style.display = 'none';
    pointerLockOverlay.style.alignItems = 'center';
    pointerLockOverlay.style.justifyContent = 'center';
    pointerLockOverlay.style.zIndex = 10001;
    pointerLockOverlay.style.pointerEvents = 'none';
    const pointerLockMessage = document.createElement('div');
    pointerLockMessage.innerText = 'Click to resume mouse look';
    pointerLockMessage.style.color = '#fff';
    pointerLockMessage.style.fontSize = '2rem';
    pointerLockMessage.style.background = 'rgba(0,0,0,0.7)';
    pointerLockMessage.style.padding = '32px 48px';
    pointerLockMessage.style.borderRadius = '16px';
    pointerLockMessage.style.cursor = 'pointer';
    pointerLockMessage.style.pointerEvents = 'auto';
    pointerLockMessage.addEventListener('click', onResume);
    pointerLockOverlay.appendChild(pointerLockMessage);
    return pointerLockOverlay;
}
function showPointerLockOverlay() {
    if (pointerLockOverlay) pointerLockOverlay.style.display = 'flex';
}
function hidePointerLockOverlay() {
    if (pointerLockOverlay) pointerLockOverlay.style.display = 'none';
}
function setupFinishPopup(modal, onClose) {
    finishPopup = document.getElementById('maze3d-finish-popup');
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
    document.getElementById('maze3d-finish-ok')?.addEventListener('click', onClose);
    return finishPopup;
}
function showFinishPopup() {
    if (finishPopup) finishPopup.style.display = 'flex';
    document.exitPointerLock();
}
function hideFinishPopup() {
    if (finishPopup) finishPopup.style.display = 'none';
}
function removePointerLockOverlay() {
    if (pointerLockOverlay && pointerLockOverlay.parentNode) pointerLockOverlay.parentNode.removeChild(pointerLockOverlay);
    pointerLockOverlay = null;
}
function removeFinishPopup() {
    if (finishPopup && finishPopup.parentNode) finishPopup.parentNode.removeChild(finishPopup);
    finishPopup = null;
}

// Render a yellow solution path line on the floor (wrapper for module)
function renderSolutionPath(solutionPath) {
    cacheSolutionPath(solutionPath, cellSize);
    renderSolutionPathModule(scene, solutionPath, cellSize);
}




// Listen for 'L' and 'T' keys
window.addEventListener('keydown', (event) => {
    if (event.key === 'l' || event.key === 'L') {
        toggleSolutionLine(scene);
    } // Removed top-down overlay toggle for standalone build
});



// public/maze3d.js
// This script renders the maze in 3D using Three.js and allows first-person navigation with arrow keys.

let camera, scene, renderer, mazeGroup;
let player = { x: 0, y: 0, tx: 0, ty: 0, moving: false };
const playerRadius = 0.18; // Prevent camera from getting too close to walls (tighter)
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

// --- Top-down overlay ---
let topdownOverlay = null;
let topdownVisible = false;

function createTopdownOverlay(container) {
    let overlay = document.createElement('canvas');
    overlay.id = 'maze3d-topdown-overlay';
    overlay.style.position = 'absolute';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.pointerEvents = 'none';
    overlay.style.zIndex = '10010';
    overlay.style.display = 'none';
    container.appendChild(overlay);
    return overlay;
}

function drawTopdownOverlay() {
    if (!topdownOverlay || !mazeData || !topdownVisible) return;
    
    // Resize if needed
    const container = topdownOverlay.parentNode;
    topdownOverlay.width = container.offsetWidth;
    topdownOverlay.height = container.offsetHeight;
    
    const ctx = topdownOverlay.getContext('2d');
    ctx.clearRect(0, 0, topdownOverlay.width, topdownOverlay.height);
    ctx.fillStyle = 'rgba(30,30,30,0.85)';
    ctx.fillRect(0, 0, topdownOverlay.width, topdownOverlay.height);
    
    // Calculate scaling and positioning
    const margin = 32;
    const mazeRows = mazeData.length;
    const mazeCols = mazeData[0].length;
    const availW = topdownOverlay.width - margin * 2;
    const availH = topdownOverlay.height - margin * 2;
    
    let mapW, mapH, offsetX, offsetY;
    if (mazeCols / mazeRows > availW / availH) {
        mapW = availW;
        mapH = mapW * (mazeRows / mazeCols);
    } else {
        mapH = availH;
        mapW = mapH * (mazeCols / mazeRows);
    }
    offsetX = (topdownOverlay.width - mapW) / 2;
    offsetY = (topdownOverlay.height - mapH) / 2;
    
    const cellW = mapW / mazeCols;
    const cellH = mapH / mazeRows;
    
    // Draw walls
    for (let y = 0; y < mazeRows; y++) {
        for (let x = 0; x < mazeCols; x++) {
            if (mazeData[y][x] === 1) {
                ctx.fillStyle = '#4444aa';
                ctx.fillRect(offsetX + x * cellW, offsetY + y * cellH, cellW, cellH);
            }
        }
    }
    
    // Draw start marker
    if (start) {
        ctx.fillStyle = '#00ff00';
        ctx.beginPath();
        ctx.arc(offsetX + (start[1] + 0.5) * cellW, offsetY + (start[0] + 0.5) * cellH, 
                Math.min(cellW, cellH) * 0.25, 0, 2 * Math.PI);
        ctx.fill();
    }
    
    // Draw end marker
    if (end) {
        ctx.fillStyle = '#ff0000';
        ctx.beginPath();
        ctx.arc(offsetX + (end[1] + 0.5) * cellW, offsetY + (end[0] + 0.5) * cellH, 
                Math.min(cellW, cellH) * 0.25, 0, 2 * Math.PI);
        ctx.fill();
    }
    
    // Draw player with direction indicator
    ctx.save();
    ctx.translate(offsetX + (player.x + 0.5) * cellW, offsetY + (player.y + 0.5) * cellH);
    ctx.rotate(yaw + Math.PI / 2);
    const r = Math.min(cellW, cellH) * 0.35;
    ctx.beginPath();
    ctx.moveTo(0, -r);
    ctx.lineTo(r * 0.5, r * 0.5);
    ctx.lineTo(-r * 0.5, r * 0.5);
    ctx.closePath();
    ctx.fillStyle = '#ffff00';
    ctx.strokeStyle = '#222';
    ctx.lineWidth = 2;
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    
    // Draw solution path if visible
    if (solutionLineVisible && solutionPathCache && solutionPathCache.path) {
        ctx.strokeStyle = '#ffff00';
        ctx.lineWidth = 3;
        ctx.beginPath();
        for (let i = 0; i < solutionPathCache.path.length; i++) {
            const [row, col] = solutionPathCache.path[i];
            const px = offsetX + (col + 0.5) * cellW;
            const py = offsetY + (row + 0.5) * cellH;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.stroke();
    }
}

function showTopdownOverlay() {
    if (!topdownOverlay) return;
    topdownOverlay.style.display = 'block';
    topdownVisible = true;
}

function hideTopdownOverlay() {
    if (!topdownOverlay) return;
    topdownOverlay.style.display = 'none';
    topdownVisible = false;
}

function toggleTopdownOverlay() {
    if (topdownVisible) {
        hideTopdownOverlay();
    } else {
        showTopdownOverlay();
    }
}

function removeTopdownOverlay() {
    if (topdownOverlay && topdownOverlay.parentNode) {
        topdownOverlay.parentNode.removeChild(topdownOverlay);
    }
    topdownOverlay = null;
    topdownVisible = false;
}

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
    camera = createCamera(container, cellSize);
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
    mazeGroup = createMazeGroup(maze, cellSize);
    scene.add(mazeGroup);

    // Floor
    const floor = createFloor(maze, cellSize);
    scene.add(floor);

    // Start and end markers
    const { startMesh, endMesh } = createStartEndMarkers(start, end, cellSize);
    scene.add(startMesh);
    scene.add(endMesh);

    // Camera setup
    updateCamera(true);


// (Removed import of ui.js for standalone build)

    // Pointer lock overlay setup
    const modal = document.getElementById('maze3d-modal');
    pointerLockOverlay = setupPointerLockOverlay(container, () => container.requestPointerLock());
    if (modal) modal.appendChild(pointerLockOverlay);

    // Add finish popup (hidden by default)
    setupFinishPopup(modal, () => {
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

    // If a solution path was set before 3D was opened, render it now
    if (window.solutionPathToShow && Array.isArray(window.solutionPathToShow) && window.solutionPathToShow.length > 0) {
        renderSolutionPath(window.solutionPathToShow);
    }
}



function animate() {
    animationId = requestAnimationFrame(animate);
    // Always update camera for mouse look, even if not moving
    updateCamera();
    renderer.render(scene, camera);
    // Top-down overlay removed for standalone build
}

function onMouseMove(e) {
    if (!isPointerLocked) return;
    const sensitivity = 0.0025;
    yaw += e.movementX * sensitivity; // REVERSED: add instead of subtract
    pitch -= e.movementY * sensitivity;
    pitch = clampPitch(pitch);
}

function onKeyDown(event) {
    const key = event.key.toLowerCase();
    keysDown[key] = true;

    // Handle Escape key: release pointer lock if active
    if (key === 'escape') {
        if (document.pointerLockElement) {
            document.exitPointerLock();
        }
        return;
    }

    handleMovementAndLook();
}

// --- Inlined from maze3d/movement.js --- 
function handleMovementAndLookModule({
    keysDown,
    player,
    yaw,
    pitch,
    mazeData,
    end,
    playerRadius,
    clampPitch,
    showFinishPopup
}) {
    if (!mazeData) return { yaw, pitch };
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
    pitch = clampPitch(pitch);
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
    // Improved wall collision with radius
    function canMoveWithRadius(x, y) {
        const checks = [
            [0, 0],
            [playerRadius, 0],
            [-playerRadius, 0],
            [0, playerRadius],
            [0, -playerRadius],
            [playerRadius * 0.707, playerRadius * 0.707],
            [-playerRadius * 0.707, playerRadius * 0.707],
            [playerRadius * 0.707, -playerRadius * 0.707],
            [-playerRadius * 0.707, -playerRadius * 0.707],
        ];
        for (const [ox, oy] of checks) {
            const cx = x + ox;
            const cy = y + oy;
            const gx = Math.round(cx);
            const gy = Math.round(cy);
            if (
                gy < 0 || gy >= mazeData.length ||
                gx < 0 || gx >= mazeData[0].length ||
                mazeData[gy][gx] === 1
            ) {
                return false;
            }
        }
        return true;
    }
    let nx = player.tx + dx;
    let ny = player.ty + dy;
    if (dx !== 0 || dy !== 0) {
        if (canMoveWithRadius(nx, ny)) {
            player.tx = nx;
            player.ty = ny;
        } else if (canMoveWithRadius(player.tx + dx, player.ty)) {
            player.tx += dx; // Slide along X
        } else if (canMoveWithRadius(player.tx, player.ty + dy)) {
            player.ty += dy; // Slide along Y
        }
        // Check for finish
        if (Math.round(player.tx) === end[1] && Math.round(player.ty) === end[0]) {
            showFinishPopup();
        }
    }
    return { yaw, pitch };
}

function handleMovementAndLook() {
    const result = handleMovementAndLookModule({
        keysDown,
        player,
        yaw,
        pitch,
        mazeData,
        end,
        playerRadius,
        clampPitch,
        showFinishPopup
    });
    yaw = result.yaw;
    pitch = result.pitch;
}

function showFinishPopup() {
    showFinishPopupUI();
}

function onWindowResize() {
    if (!renderer || !camera) return;
    const container = document.getElementById('maze-3d-container');
    camera.aspect = container.offsetWidth / container.offsetHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    // Top-down overlay removed for standalone build
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
    removePointerLockOverlay();
    removeFinishPopup();
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
window.renderSolutionPath = renderSolutionPath;
