/**
 * mazeGenerator.js
 *
 * Orchestrates maze generation and solving using various algorithms.
 *
 * Exports the MazeGenerator class with static methods:
 *   - generateMaze(algorithm, size): Generate a maze using the specified algorithm
 *   - extractOptimalPath(solutionSteps, start, end): Backtrack to find the optimal path
 *   - solveMazeDFS/BFS/AStar: Solve a maze using the respective algorithm
 *
 * Author: [Your Name or Team]
 * Date: 2025-04-28
 */

const generateMazeDFS = require('./algorithms/generate/dfs');
const generateMazePrim = require('./algorithms/generate/prim');
const generateMazeKruskal = require('./algorithms/generate/kruskal');
const solveMazeDFS = require('./algorithms/solve/dfs');
const solveMazeBFS = require('./algorithms/solve/bfs');
const solveMazeAStar = require('./algorithms/solve/astar');

/**
 * MazeGenerator orchestrates maze generation and solving.
 *
 * @class
 */
class MazeGenerator {
    /**
     * Generate a maze using the specified algorithm.
     * @param {string} algorithm - 'dfs', 'prim', or 'kruskal'
     * @param {number} size - Maze size (number of cells per side)
     * @returns {{maze: number[][], steps: number[][], start: number[], end: number[]}}
     */
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

    /**
     * Extract the optimal path from solution steps.
     * @param {number[][]} solutionSteps - Steps from solver
     * @param {number[]} start - Start cell
     * @param {number[]} end - End cell
     * @returns {number[][]} optimalPath - Array of [x, y] from start to end
     */
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

    /**
     * Solve a maze using DFS.
     * @param {number[][]} maze
     * @param {number[]} start
     * @param {number[]} end
     * @returns {number[][]}
     */
    static solveMazeDFS(maze, start, end) {
        return solveMazeDFS(maze, start, end);
    }

    /**
     * Solve a maze using BFS.
     * @param {number[][]} maze
     * @param {number[]} start
     * @param {number[]} end
     * @returns {number[][]}
     */
    static solveMazeBFS(maze, start, end) {
        return solveMazeBFS(maze, start, end);
    }

    /**
     * Solve a maze using A* Search.
     * @param {number[][]} maze
     * @param {number[]} start
     * @param {number[]} end
     * @returns {number[][]}
     */
    static solveMazeAStar(maze, start, end) {
        return solveMazeAStar(maze, start, end);
    }
}

module.exports = MazeGenerator;
