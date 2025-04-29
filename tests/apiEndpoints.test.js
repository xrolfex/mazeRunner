/* global describe, it, expect, beforeAll */
// tests/apiEndpoints.test.js
// Jest + supertest tests for Express API endpoints in index.js

const request = require('supertest');

// Mock app setup (reuse the real app if possible)
let app;
beforeAll(() => {
  app = require('../index');
});

describe('MazeRunner API Endpoints', () => {
  describe('POST /generate-maze', () => {
    it('returns maze data for valid request', async () => {
      const res = await request(app)
        .post('/generate-maze')
        .send({ algorithm: 'dfs', size: 7 })
        .set('Accept', 'application/json');
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('maze');
      expect(res.body).toHaveProperty('steps');
      expect(res.body).toHaveProperty('start');
      expect(res.body).toHaveProperty('end');
    });
    it('returns 400 for unknown algorithm', async () => {
      const res = await request(app)
        .post('/generate-maze')
        .send({ algorithm: 'foo', size: 7 })
        .set('Accept', 'application/json');
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('POST /solve-maze', () => {
    const maze = [
      [0,0,1],
      [1,0,1],
      [1,0,0]
    ];
    const start = [0,0];
    const end = [2,2];
    it('solves maze with DFS', async () => {
      const res = await request(app)
        .post('/solve-maze')
        .send({ maze, start, end, algorithm: 'dfs' })
        .set('Accept', 'application/json');
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('solutionSteps');
    });
    it('solves maze with BFS', async () => {
      const res = await request(app)
        .post('/solve-maze')
        .send({ maze, start, end, algorithm: 'bfs' })
        .set('Accept', 'application/json');
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('solutionSteps');
    });
    it('solves maze with A*', async () => {
      const res = await request(app)
        .post('/solve-maze')
        .send({ maze, start, end, algorithm: 'astar' })
        .set('Accept', 'application/json');
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('solutionSteps');
    });
    it('returns 400 for unknown algorithm', async () => {
      const res = await request(app)
        .post('/solve-maze')
        .send({ maze, start, end, algorithm: 'foo' })
        .set('Accept', 'application/json');
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('GET /', () => {
    it('renders the main UI (EJS view)', async () => {
      const res = await request(app)
        .get('/')
        .set('Accept', 'text/html');
      expect(res.statusCode).toBe(200);
      expect(res.headers['content-type']).toMatch(/html/);
      expect(res.text).toMatch(/<!DOCTYPE html>|<html|MazeRunner/i);
    });
  });
});
