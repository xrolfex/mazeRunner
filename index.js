/* global __dirname */

/**
 * index.js
 *
 * Express server for the MazeRunner web application.
 *
 * Responsibilities:
 * - Serves static files and EJS views
 * - Handles maze generation and solving API endpoints
 * - Increases JSON payload limit for large mazes
 *
 * Endpoints:
 *   GET  /            - Render main UI
 *   POST /generate-maze - Generate a maze with selected algorithm and size
 *   POST /solve-maze    - Solve a maze with selected algorithm
 *
 * Author: [Your Name or Team]
 * Date: 2025-04-28
 */

/**
 * Main entry point for the MazeRunner Express server.
 *
 * @module index
 */

const express = require('express');
const path = require('path');
const MazeGenerator = require('./mazeGenerator');

/**
 * Express app instance.
 * @type {import('express').Express}
 */
const app = express();
const PORT = 3000;

// Set EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Increase JSON payload limit for large mazes
app.use(express.json({ limit: '20mb' }));

// Routes
app.get('/', (req, res) => {
  res.render('index');
});

/**
 * Maze generation endpoint.
 * @route POST /generate-maze
 * @param {string} algorithm - Algorithm name
 * @param {number} size - Maze size
 * @returns {object} Maze data
 */
app.post('/generate-maze', (req, res) => {
    const { algorithm, size } = req.body;
    try {
        const { maze, steps, start, end } = MazeGenerator.generateMaze(algorithm, parseInt(size, 10));
        res.json({ maze, steps, start, end });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

/**
 * Maze solving endpoint.
 * @route POST /solve-maze
 * @param {number[][]} maze - Maze array
 * @param {number[]} start - Start cell
 * @param {number[]} end - End cell
 * @param {string} algorithm - Algorithm name
 * @returns {object} Solution steps
 */
app.post('/solve-maze', (req, res) => {
    const { maze, start, end, algorithm } = req.body;
    let solutionSteps = [], optimalPath = [];
    console.log('--- /solve-maze called ---');
    console.log('Request body:', JSON.stringify(req.body));
    try {
        let result;
        switch (algorithm) {
            case 'dfs': {
                result = MazeGenerator.solveMazeDFS(maze, start, end);
                console.log('DFS result:', JSON.stringify(result));
                if (result && typeof result === 'object' && Array.isArray(result.solutionSteps) && Array.isArray(result.optimalPath)) {
                    solutionSteps = result.solutionSteps;
                    optimalPath = result.optimalPath;
                } else if (Array.isArray(result)) {
                    solutionSteps = result;
                    optimalPath = result;
                }
                break;
            }
            case 'bfs': {
                result = MazeGenerator.solveMazeBFS(maze, start, end);
                console.log('BFS result:', JSON.stringify(result));
                if (result && typeof result === 'object') {
                    solutionSteps = Array.isArray(result.solutionSteps) ? result.solutionSteps : [];
                    optimalPath = Array.isArray(result.optimalPath) ? result.optimalPath : [];
                }
                break;
            }
            case 'astar': {
                result = MazeGenerator.solveMazeAStar(maze, start, end);
                console.log('A* result:', JSON.stringify(result));
                if (result && typeof result === 'object' && Array.isArray(result.solutionSteps) && Array.isArray(result.optimalPath)) {
                    solutionSteps = result.solutionSteps;
                    optimalPath = result.optimalPath;
                } else if (Array.isArray(result)) {
                    solutionSteps = result;
                    optimalPath = result;
                }
                break;
            }
            default:
                throw new Error('Unknown solving algorithm');
        }
        console.log('Final solutionSteps:', JSON.stringify(solutionSteps));
        console.log('Final optimalPath:', JSON.stringify(optimalPath));
        res.json({ solutionSteps, optimalPath });
    } catch (error) {
        console.error('Error in /solve-maze:', error);
        res.status(400).json({ error: error.message });
    }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Export app for testing
module.exports = app;
