const express = require('express');
const path = require('path');
const MazeGenerator = require('./mazeGenerator');

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

app.post('/generate-maze', (req, res) => {
    const { algorithm, size } = req.body;
    try {
        const { maze, steps, start, end } = MazeGenerator.generateMaze(algorithm, parseInt(size, 10));
        res.json({ maze, steps, start, end });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.post('/solve-maze', (req, res) => {
    const { maze, start, end, algorithm } = req.body;
    let solutionSteps;

    switch (algorithm) {
        case 'dfs':
            solutionSteps = MazeGenerator.solveMazeDFS(maze, start, end);
            break;
        case 'bfs':
            solutionSteps = MazeGenerator.solveMazeBFS(maze, start, end);
            break;
        case 'astar':
            solutionSteps = MazeGenerator.solveMazeAStar(maze, start, end);
            break;
        default:
            throw new Error('Unknown solving algorithm');
    }

    res.json({ solutionSteps }); // Return only the solution steps
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
