// maze3d/solutionLine.js
// Handles solution path line rendering and toggle logic

/* global THREE */

let solutionPathCache = null;
let solutionLineVisible = false;

export function renderSolutionPath(scene, solutionPath, cellSize) {
    if (!scene || !solutionPath || solutionPath.length === 0) {
        console.warn('No scene or empty solutionPath');
        return;
    }
    // Remove any previous solution line
    const prevLine = scene.getObjectByName('solutionLine');
    if (prevLine) scene.remove(prevLine);
    // Remove previous arrows (legacy, just in case)
    scene.traverse(obj => {
        if (obj.name && obj.name.startsWith('solutionArrow')) scene.remove(obj);
    });
    // Convert [row, col] to 3D positions
    const points = solutionPath.map(([row, col]) =>
        new THREE.Vector3(
            col * cellSize,
            0.11,
            row * cellSize
        )
    );
    // Draw the yellow line, but make it hidden by default
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color: 0xffff00 });
    const line = new THREE.Line(geometry, material);
    line.name = 'solutionLine';
    line.visible = solutionLineVisible;
    scene.add(line);
}

export function showSolutionLine(scene) {
    if (solutionPathCache) {
        solutionLineVisible = true;
        renderSolutionPath(scene, solutionPathCache.path, solutionPathCache.cellSize);
        // After rendering, set the line visible if it exists
        const line = scene.getObjectByName('solutionLine');
        if (line) line.visible = true;
    }
}

export function hideSolutionLine(scene) {
    const prevLine = scene.getObjectByName('solutionLine');
    if (prevLine) prevLine.visible = false;
    solutionLineVisible = false;
}

export function toggleSolutionLine(scene) {
    if (solutionLineVisible) {
        hideSolutionLine(scene);
    } else {
        showSolutionLine(scene);
    }
}

export function cacheSolutionPath(solutionPath, cellSize) {
    solutionPathCache = { path: solutionPath, cellSize };
    solutionLineVisible = true;
}

export function isSolutionLineVisible() {
    return solutionLineVisible;
}
