# MazeRunner

MazeRunner is a Node.js project for generating and solving mazes using various algorithms (DFS, Prim, Kruskal, BFS, A*). It includes a web interface, CLI, and comprehensive test suite.

## Features
- Maze generation: DFS, Prim, Kruskal
- Maze solving: BFS, DFS, A*
- Web UI (EJS, Bootstrap)
- API endpoints (Express)
- 100% test coverage with Jest
- Linting (ESLint) and formatting (Prettier)
- Property-based testing (fast-check)

## Usage

### Install dependencies
```
npm install
```

### Run tests with coverage
```
npm test
```

### Lint and format code
```
npm run lint
npm run format
```

### Start development server
```
npm run dev
```

## Project Structure
```
/algorithms         # Maze algorithms (generation/solving)
/public             # Static files for web UI
/tests              # Jest test files
/views              # EJS templates
index.js            # Main server entry point
mazeGenerator.js    # Maze orchestration logic
```

## Contributing
- Fork and clone the repo
- Run tests before submitting PRs
- Follow code style (ESLint/Prettier)

## License
MIT
