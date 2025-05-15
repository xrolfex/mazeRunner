// maze3d/topdown.js
// Handles top-down overlay creation, drawing, and toggling

let topDownOverlay = null;
let topDownVisible = false;

export function createTopDownOverlay(container) {
    if (topDownOverlay) return topDownOverlay;
    topDownOverlay = document.createElement('canvas');
    topDownOverlay.id = 'maze3d-topdown-overlay';
    topDownOverlay.style.position = 'absolute';
    topDownOverlay.style.top = '0';
    topDownOverlay.style.left = '0';
    topDownOverlay.style.width = '100%';
    topDownOverlay.style.height = '100%';
    topDownOverlay.style.pointerEvents = 'none';
    topDownOverlay.style.zIndex = 10010;
    topDownOverlay.style.display = 'none';
    topDownOverlay.width = container.offsetWidth;
    topDownOverlay.height = container.offsetHeight;
    container.appendChild(topDownOverlay);
    return topDownOverlay;
}

export function drawTopDownOverlay({
    topDownOverlay,
    mazeData,
    start,
    end,
    player,
    yaw
}) {
    if (!topDownVisible || !topDownOverlay || !mazeData) return;
    // Resize if needed
    const container = topDownOverlay.parentNode;
    if (topDownOverlay.width !== container.offsetWidth || topDownOverlay.height !== container.offsetHeight) {
        topDownOverlay.width = container.offsetWidth;
        topDownOverlay.height = container.offsetHeight;
    }
    const ctx = topDownOverlay.getContext('2d');
    ctx.clearRect(0, 0, topDownOverlay.width, topDownOverlay.height);
    ctx.fillStyle = 'rgba(30,30,30,0.85)';
    ctx.fillRect(0, 0, topDownOverlay.width, topDownOverlay.height);
    const margin = 32;
    const mazeRows = mazeData.length;
    const mazeCols = mazeData[0].length;
    const availW = topDownOverlay.width - margin * 2;
    const availH = topDownOverlay.height - margin * 2;
    let mapW, mapH, offsetX, offsetY;
    if (mazeCols / mazeRows > availW / availH) {
        mapW = availW;
        mapH = mapW * (mazeRows / mazeCols);
    } else {
        mapH = availH;
        mapW = mapH * (mazeCols / mazeRows);
    }
    offsetX = (topDownOverlay.width - mapW) / 2;
    offsetY = (topDownOverlay.height - mapH) / 2;
    const cellW = mapW / mazeCols;
    const cellH = mapH / mazeRows;
    for (let y = 0; y < mazeRows; y++) {
        for (let x = 0; x < mazeCols; x++) {
            if (mazeData[y][x] === 1) {
                ctx.fillStyle = '#4444aa';
                ctx.fillRect(offsetX + x * cellW, offsetY + y * cellH, cellW, cellH);
            }
        }
    }
    if (start) {
        ctx.fillStyle = '#00ff00';
        ctx.beginPath();
        ctx.arc(offsetX + (start[1] + 0.5) * cellW, offsetY + (start[0] + 0.5) * cellH, Math.min(cellW, cellH) * 0.25, 0, 2 * Math.PI);
        ctx.fill();
    }
    if (end) {
        ctx.fillStyle = '#ff0000';
        ctx.beginPath();
        ctx.arc(offsetX + (end[1] + 0.5) * cellW, offsetY + (end[0] + 0.5) * cellH, Math.min(cellW, cellH) * 0.25, 0, 2 * Math.PI);
        ctx.fill();
    }
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
}

export function showTopDownOverlay() {
    if (topDownOverlay) topDownOverlay.style.display = 'block';
    topDownVisible = true;
}

export function hideTopDownOverlay() {
    if (topDownOverlay) topDownOverlay.style.display = 'none';
    topDownVisible = false;
}

export function toggleTopDownOverlay() {
    if (topDownVisible) {
        hideTopDownOverlay();
    } else {
        showTopDownOverlay();
    }
}

export function getTopDownOverlay() {
    return topDownOverlay;
}

export function isTopDownVisible() {
    return topDownVisible;
}
