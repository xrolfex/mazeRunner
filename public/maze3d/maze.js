// maze3d/maze.js
// Handles maze rendering: walls, floor, start/end markers

/* global THREE */

export function createMazeGroup(maze, cellSize) {
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

export function createFloor(maze, cellSize) {
    const floorGeo = new THREE.PlaneGeometry(maze[0].length * cellSize, maze.length * cellSize);
    const floorMat = new THREE.MeshStandardMaterial({ color: 0x888888 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.set((maze[0].length * cellSize) / 2 - cellSize / 2, 0, (maze.length * cellSize) / 2 - cellSize / 2);
    return floor;
}

export function createStartEndMarkers(start, end, cellSize) {
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
