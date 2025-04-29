// Prim's Algorithm Maze Generation
// Modernized: ensures full grid usage, clear logic, and maintainability
module.exports = function generateMazePrim(size) {
    // Create a size x size grid filled with walls (1)
    const maze = Array.from({ length: size }, () => Array(size).fill(1));
    const walls = [];
    const directions = [
        [0, -2], // left
        [0, 2],  // right
        [-2, 0], // up
        [2, 0]   // down
    ];
    const steps = [];

    // Only allow carving if the cell is inside the grid and is a wall
    const isValid = (x, y) => x > 0 && y > 0 && x < size - 1 && y < size - 1 && maze[x][y] === 1;

    // Add all valid walls around a cell
    const addWalls = (x, y) => {
        directions.forEach(([dx, dy]) => {
            const nx = x + dx;
            const ny = y + dy;
            if (isValid(nx, ny)) walls.push([x, y, nx, ny]);
        });
    };

    // Start at (1,1)
    maze[1][1] = 0;
    steps.push([1, 1]);
    addWalls(1, 1);

    while (walls.length > 0) {
        const randomIndex = Math.floor(Math.random() * walls.length);
        const [x, y, nx, ny] = walls.splice(randomIndex, 1)[0];

        if (isValid(nx, ny)) {
            // Carve the wall between current and neighbor
            const mx = x + (nx - x) / 2;
            const my = y + (ny - y) / 2;
            maze[mx][my] = 0;
            steps.push([mx, my]);
            maze[nx][ny] = 0;
            steps.push([nx, ny]);
            addWalls(nx, ny);
        }
    }

    // Set start and end points
    const start = [1, 1];
    let end = [size - 2, size - 2];
    if (size > 2 && maze[size - 3][size - 2] === 0) {
        end = [size - 3, size - 2];
    } else if (size > 2 && maze[size - 2][size - 3] === 0) {
        end = [size - 2, size - 3];
    } else if (size > 2 && maze[size - 3][size - 3] === 0) {
        end = [size - 3, size - 3];
    }
    maze[start[0]][start[1]] = 0;
    maze[end[0]][end[1]] = 0;
    steps.push(start, end);
    return { maze, steps, start, end };
}
