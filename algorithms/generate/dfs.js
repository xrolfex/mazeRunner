// Depth-First Search Maze Generation
module.exports = function generateMazeDFS(size) {
    const maze = Array.from({ length: size }, () => Array(size).fill(1));
    const stack = [];
    const directions = [
        [0, -1], // left
        [0, 1],  // right
        [-1, 0], // up
        [1, 0]   // down
    ];
    const steps = [];

    const isValid = (x, y) => x >= 0 && y >= 0 && x < size && y < size && maze[x][y] === 1;

    const carvePath = (x, y) => {
        maze[x][y] = 0;
        steps.push([x, y]);
        stack.push([x, y]);

        while (stack.length > 0) {
            const [cx, cy] = stack[stack.length - 1];
            const neighbors = directions
                .map(([dx, dy]) => [cx + dx * 2, cy + dy * 2])
                .filter(([nx, ny]) => isValid(nx, ny));

            if (neighbors.length > 0) {
                const [nx, ny] = neighbors[Math.floor(Math.random() * neighbors.length)];
                maze[cx + (nx - cx) / 2][cy + (ny - cy) / 2] = 0; // Carve passage
                steps.push([cx + (nx - cx) / 2, cy + (ny - cy) / 2]);
                maze[nx][ny] = 0;
                steps.push([nx, ny]);
                stack.push([nx, ny]);
            } else {
                stack.pop();
            }
        }
    };

    carvePath(0, 0);

    const start = [0, 0];
    let end = [size - 1, size - 1];
    if (size > 1 && maze[size - 2][size - 1] === 0) {
        end = [size - 2, size - 1];
    } else if (size > 1 && maze[size - 1][size - 2] === 0) {
        end = [size - 1, size - 2];
    } else if (size > 1 && maze[size - 2][size - 2] === 0) {
        end = [size - 2, size - 2];
    }
    maze[start[0]][start[1]] = 0;
    maze[end[0]][end[1]] = 0;
    steps.push(start, end);
    return { maze, steps, start, end };
}
