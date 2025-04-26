// A* Search Maze Solver
module.exports = function solveMazeAStar(maze, start, end) {
    // ...existing code...
    const openSet = [start];
    const cameFrom = new Map();
    const gScore = new Map();
    const fScore = new Map();
    const solutionSteps = [];

    const directions = [
        [0, -1], // left
        [0, 1],  // right
        [-1, 0], // up
        [1, 0]   // down
    ];

    const heuristic = (x, y) => Math.abs(x - end[0]) + Math.abs(y - end[1]);

    const key = ([x, y]) => `${x},${y}`;
    gScore.set(key(start), 0);
    fScore.set(key(start), heuristic(start[0], start[1]));

    while (openSet.length > 0) {
        openSet.sort((a, b) => fScore.get(key(a)) - fScore.get(key(b)));
        const current = openSet.shift();
        const [x, y] = current;
        solutionSteps.push([x, y]);

        if (x === end[0] && y === end[1]) {
            return solutionSteps; // Maze solved
        }

        for (const [dx, dy] of directions) {
            const nx = x + dx;
            const ny = y + dy;
            const neighborKey = key([nx, ny]);

            if (nx >= 0 && ny >= 0 && nx < maze.length && ny < maze[0].length && maze[nx][ny] === 0) {
                const tentativeGScore = gScore.get(key(current)) + 1;

                if (tentativeGScore < (gScore.get(neighborKey) || Infinity)) {
                    cameFrom.set(neighborKey, current);
                    gScore.set(neighborKey, tentativeGScore);
                    fScore.set(neighborKey, tentativeGScore + heuristic(nx, ny));

                    if (!openSet.some(([ox, oy]) => ox === nx && oy === ny)) {
                        openSet.push([nx, ny]);
                    }
                }
            }
        }
    }

    return []; // No solution found
    // ...existing code...
};
