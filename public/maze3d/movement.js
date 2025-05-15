// maze3d/movement.js
// Handles player movement, look controls, and collision detection

export function handleMovementAndLook({
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
