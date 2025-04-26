// Prim's Algorithm Maze Generation
module.exports = function generateMazePrim(size) {
    // ...existing code...
    const maze = Array.from({ length: size }, () => Array(size).fill(1));
    const walls = [];
    const directions = [
        [0, -2], // left
        [0, 2],  // right
        [-2, 0], // up
        [2, 0]   // down
    ];
    const steps = [];

    const isValid = (x, y) => x > 0 && y > 0 && x < size - 1 && y < size - 1 && maze[x][y] === 1;

    const addWalls = (x, y) => {
        directions.forEach(([dx, dy]) => {
            const nx = x + dx;
            const ny = y + dy;
            if (isValid(nx, ny)) walls.push([x, y, nx, ny]);
        });
    };

    maze[1][1] = 0;
    steps.push([1, 1]);
    addWalls(1, 1);

    while (walls.length > 0) {
        const randomIndex = Math.floor(Math.random() * walls.length);
        const [x, y, nx, ny] = walls.splice(randomIndex, 1)[0];

        if (isValid(nx, ny)) {
            maze[nx][ny] = 0;
            steps.push([nx, ny]);
            maze[x + (nx - x) / 2][y + (ny - y) / 2] = 0; // Carve passage
            steps.push([x + (nx - x) / 2, y + (ny - y) / 2]);
            addWalls(nx, ny);
        }
    }

    const start = [1, 1];
    let end = [size - 2, size - 2];

    // Ensure the bottom-right corner is reachable
    if (maze[size - 3][size - 2] === 0) {
        end = [size - 3, size - 2];
    } else if (maze[size - 2][size - 3] === 0) {
        end = [size - 2, size - 3];
    } else if (maze[size - 3][size - 3] === 0) {
        end = [size - 3, size - 3];
    }

    // Ensure the start and end points are open
    maze[start[0]][start[1]] = 0;
    maze[end[0]][end[1]] = 0;
    steps.push(start, end);

    // Ensure the right and bottom edges are open
    for (let i = 1; i < size - 1; i++) {
        if (maze[size - 2][i] === 0) {
            maze[size - 1][i] = 0;
            break;
        }
    }
    for (let i = 1; i < size - 1; i++) {
        if (maze[i][size - 2] === 0) {
            maze[i][size - 1] = 0;
            break;
        }
    }

    return { maze, steps, start, end };
    // ...existing code...
};
