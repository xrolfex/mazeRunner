// Breadth-First Search Maze Solver
module.exports = function solveMazeBFS(maze, start, end) {
    // ...existing code...
    const queue = [start];
    const visited = new Set();
    const solutionSteps = [];
    const directions = [
        [0, -1], // left
        [0, 1],  // right
        [-1, 0], // up
        [1, 0]   // down
    ];

    const isValid = (x, y) => x >= 0 && y >= 0 && x < maze.length && y < maze[0].length && maze[x][y] === 0;

    while (queue.length > 0) {
        const [x, y] = queue.shift();
        const key = `${x},${y}`;

        if (visited.has(key)) continue;
        visited.add(key);
        solutionSteps.push([x, y]);

        if (x === end[0] && y === end[1]) {
            return solutionSteps; // Maze solved
        }

        for (const [dx, dy] of directions) {
            const nx = x + dx;
            const ny = y + dy;
            if (isValid(nx, ny) && !visited.has(`${nx},${ny}`)) {
                queue.push([nx, ny]);
            }
        }
    }

    return []; // No solution found
    // ...existing code...
};
