// This file re-exports all algorithms for easier imports after moving to src/
module.exports = {
  generate: {
    dfs: require('./algorithms/generate/dfs'),
    prim: require('./algorithms/generate/prim'),
    kruskal: require('./algorithms/generate/kruskal'),
  },
  solve: {
    dfs: require('./algorithms/solve/dfs'),
    bfs: require('./algorithms/solve/bfs'),
    astar: require('./algorithms/solve/astar'),
  },
  utils: require('./algorithms/utils/maze'),
};
