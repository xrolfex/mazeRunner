// Depth-First Search Maze Generation
module.exports = function generateMazeDFS(size) {
    // ...existing code...
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

    // Ensure the bottom-right corner is reachable
    if (maze[size - 2][size - 1] === 0) {
        end = [size - 2, size - 1];
    } else if (maze[size - 1][size - 2] === 0) {
        end = [size - 1, size - 2];
    } else if (maze[size - 2][size - 2] === 0) {
        end = [size - 2, size - 2];
    }

    // Ensure the start and end points are open
    maze[start[0]][start[1]] = 0;
    maze[end[0]][end[1]] = 0;
    steps.push(start, end);

    // Ensure the right and bottom edges are open
    for (let i = 0; i < size; i++) {
        if (maze[size - 1][i] === 0) {
            maze[size - 1][i] = 0;
            break;
        }
    }
    for (let i = 0; i < size; i++) {
        if (maze[i][size - 1] === 0) {
            maze[i][size - 1] = 0;
            break;
        }
    }

    return { maze, steps, start, end };
    // ...existing code...
};
