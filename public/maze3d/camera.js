// maze3d/camera.js
// Handles camera setup, update, and look controls

/* global THREE */

export function createCamera(container, cellSize) {
    return new THREE.PerspectiveCamera(
        75,
        container.offsetWidth / container.offsetHeight,
        0.1,
        1000
    );
}

export function updateCamera(camera, player, yaw, pitch, cellSize, moveLerp, force = false) {
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

export function clampPitch(pitch) {
    const maxPitch = Math.PI / 2 - 0.1;
    if (pitch > maxPitch) return maxPitch;
    if (pitch < -maxPitch) return -maxPitch;
    return pitch;
}
