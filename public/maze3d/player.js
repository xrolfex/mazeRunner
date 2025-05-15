// Player state and movement logic
export let player = { x: 0, y: 0, tx: 0, ty: 0, moving: false };
export let playerVelocityY = 0;
export let isOnGround = true;
export const jumpVelocity = 0.32;
export const gravity = 0.018;

export function resetPlayer(start) {
    player.x = player.tx = start[1];
    player.y = player.ty = start[0];
    player.moving = false;
    playerVelocityY = 0;
    isOnGround = true;
}

export function handleJump(keysDown) {
    if (keysDown[' ']) {
        if (isOnGround) {
            playerVelocityY = jumpVelocity;
            isOnGround = false;
        }
    }
}
