// Kruskal's Algorithm Maze Generation
module.exports = function generateMazeKruskal(size) {
    const maze = Array.from({ length: size }, () => Array(size).fill(1));
    const edges = [];
    const directions = [
        [0, -2], // left
        [0, 2],  // right
        [-2, 0], // up
        [2, 0]   // down
    ];
    const steps = [];

    const find = (parent, x) => (parent[x] === x ? x : (parent[x] = find(parent, parent[x])));
    const union = (parent, rank, x, y) => {
        const rootX = find(parent, x);
        const rootY = find(parent, y);
        if (rootX !== rootY) {
            if (rank[rootX] > rank[rootY]) {
                parent[rootY] = rootX;
            } else if (rank[rootX] < rank[rootY]) {
                parent[rootX] = rootY;
            } else {
                parent[rootY] = rootX;
                rank[rootX]++;
            }
            return true;
        }
        return false;
    };

    const cellIndex = (x, y) => x * size + y;
    const parent = Array.from({ length: size * size }, (_, i) => i);
    const rank = Array(size * size).fill(0);

    for (let x = 1; x < size; x += 2) {
        for (let y = 1; y < size; y += 2) {
            directions.forEach(([dx, dy]) => {
                const nx = x + dx;
                const ny = y + dy;
                if (nx > 0 && ny > 0 && nx < size - 1 && ny < size - 1) {
                    edges.push([x, y, nx, ny]);
                }
            });
        }
    }

    maze[1][1] = 0;
    steps.push([1, 1]);
    while (edges.length > 0) {
        const randomIndex = Math.floor(Math.random() * edges.length);
        const [x, y, nx, ny] = edges.splice(randomIndex, 1)[0];

        if (union(parent, rank, cellIndex(x, y), cellIndex(nx, ny))) {
            maze[x][y] = 0;
            steps.push([x, y]);
            maze[nx][ny] = 0;
            steps.push([nx, ny]);
            maze[x + (nx - x) / 2][y + (ny - y) / 2] = 0; // Carve passage
            steps.push([x + (nx - x) / 2, y + (ny - y) / 2]);
        }
    }

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
