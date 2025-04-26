class MazeGenerator {
    static generateMaze(algorithm, size) {
        switch (algorithm) {
            case 'dfs':
                return this.depthFirstSearch(size);
            case 'prim':
                return this.primAlgorithm(size);
            case 'kruskal':
                return this.kruskalAlgorithm(size);
            default:
                throw new Error('Unknown algorithm');
        }
    }

    static depthFirstSearch(size) {
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
    }

    static primAlgorithm(size) {
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
    }

    static kruskalAlgorithm(size) {
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
    }

    static solveMazeDFS(maze, start, end) {
        console.log('Maze:', maze);
        console.log('Start:', start);
        console.log('End:', end);

        const stack = [start];
        const visited = new Set();
        const solutionSteps = [];

        const directions = [
            [0, -1], // left
            [0, 1],  // right
            [-1, 0], // up
            [1, 0]   // down
        ];

        const isValid = (x, y) => x >= 0 && y >= 0 && x < maze.length && y < maze[0].length && maze[x][y] === 0;

        while (stack.length > 0) {
            const [x, y] = stack.pop();
            const key = `${x},${y}`;

            if (visited.has(key)) continue;
            visited.add(key);
            solutionSteps.push([x, y]);

            if (x === end[0] && y === end[1]) {
                console.log('Start Point:', start);
                console.log('End Point:', end);
                console.log('Solution Steps:', solutionSteps);

                // Ensure the solution steps include the start and end points
                if (!solutionSteps.some(([x, y]) => x === start[0] && y === start[1])) {
                    throw new Error('Solution steps do not include the start point');
                }
                if (!solutionSteps.some(([x, y]) => x === end[0] && y === end[1])) {
                    throw new Error('Solution steps do not include the end point');
                }

                console.log('Verifying continuity of solutionSteps...');
                for (let i = 1; i < solutionSteps.length; i++) {
                    const [prevX, prevY] = solutionSteps[i - 1];
                    const [currX, currY] = solutionSteps[i];
                    if (Math.abs(prevX - currX) + Math.abs(prevY - currY) !== 1) {
                        console.error(`Discontinuity found between steps: [${prevX}, ${prevY}] and [${currX}, ${currY}]`);
                    }
                }

                return solutionSteps; // Maze solved
            }

            for (const [dx, dy] of directions) {
                const nx = x + dx;
                const ny = y + dy;
                if (isValid(nx, ny) && !visited.has(`${nx},${ny}`)) {
                    stack.push([nx, ny]);
                }
            }
        }

        return []; // No solution found
    }

    static solveMazeBFS(maze, start, end) {
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
                console.log('Start Point:', start);
                console.log('End Point:', end);
                console.log('Solution Steps:', solutionSteps);

                // Ensure the solution steps include the start and end points
                if (!solutionSteps.some(([x, y]) => x === start[0] && y === start[1])) {
                    throw new Error('Solution steps do not include the start point');
                }
                if (!solutionSteps.some(([x, y]) => x === end[0] && y === end[1])) {
                    throw new Error('Solution steps do not include the end point');
                }

                console.log('Verifying continuity of solutionSteps...');
                for (let i = 1; i < solutionSteps.length; i++) {
                    const [prevX, prevY] = solutionSteps[i - 1];
                    const [currX, currY] = solutionSteps[i];
                    if (Math.abs(prevX - currX) + Math.abs(prevY - currY) !== 1) {
                        console.error(`Discontinuity found between steps: [${prevX}, ${prevY}] and [${currX}, ${currY}]`);
                    }
                }

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
    }

    static solveMazeAStar(maze, start, end) {
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
                console.log('Start Point:', start);
                console.log('End Point:', end);
                console.log('Solution Steps:', solutionSteps);

                // Ensure the solution steps include the start and end points
                if (!solutionSteps.some(([x, y]) => x === start[0] && y === start[1])) {
                    throw new Error('Solution steps do not include the start point');
                }
                if (!solutionSteps.some(([x, y]) => x === end[0] && y === end[1])) {
                    throw new Error('Solution steps do not include the end point');
                }

                console.log('Verifying continuity of solutionSteps...');
                for (let i = 1; i < solutionSteps.length; i++) {
                    const [prevX, prevY] = solutionSteps[i - 1];
                    const [currX, currY] = solutionSteps[i];
                    if (Math.abs(prevX - currX) + Math.abs(prevY - currY) !== 1) {
                        console.error(`Discontinuity found between steps: [${prevX}, ${prevY}] and [${currX}, ${currY}]`);
                    }
                }

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
    }

    static extractOptimalPath(solutionSteps, start, end) {
        const optimalPath = [];
        const parentMap = new Map();

        // Build the parent map to track the path
        for (let i = 1; i < solutionSteps.length; i++) {
            const [px, py] = solutionSteps[i - 1];
            const [cx, cy] = solutionSteps[i];
            if (Math.abs(px - cx) + Math.abs(py - cy) === 1) {
                parentMap.set(`${cx},${cy}`, [px, py]);
            }
        }

        // Backtrack from the end to the start
        let current = end;
        while (current) {
            optimalPath.push(current);
            if (current[0] === start[0] && current[1] === start[1]) {
                break; // Stop when we reach the start point
            }
            current = parentMap.get(`${current[0]},${current[1]}`);

            // If no parent is found, terminate to avoid infinite loop
            if (!current) {
                throw new Error(`Backtracking failed: No path to start from ${end} to ${start}`);
            }
        }

        return optimalPath.reverse(); // Reverse to get the path from start to end
    }
}

module.exports = MazeGenerator;
