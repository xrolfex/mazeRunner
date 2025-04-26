const generateMazeDFS = require('./algorithms/generate/dfs');
const generateMazePrim = require('./algorithms/generate/prim');
const generateMazeKruskal = require('./algorithms/generate/kruskal');
const solveMazeDFS = require('./algorithms/solve/dfs');
const solveMazeBFS = require('./algorithms/solve/bfs');
const solveMazeAStar = require('./algorithms/solve/astar');

class MazeGenerator {
    static generateMaze(algorithm, size) {
        switch (algorithm) {
            case 'dfs':
                return generateMazeDFS(size);
            case 'prim':
                return generateMazePrim(size);
            case 'kruskal':
                return generateMazeKruskal(size);
            default:
                throw new Error('Unknown algorithm');
        }
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

    static solveMazeDFS(maze, start, end) {
        return solveMazeDFS(maze, start, end);
    }

    static solveMazeBFS(maze, start, end) {
        return solveMazeBFS(maze, start, end);
    }

    static solveMazeAStar(maze, start, end) {
        return solveMazeAStar(maze, start, end);
    }
}

module.exports = MazeGenerator;
