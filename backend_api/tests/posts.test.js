const postRouter = require('../routes/postsRoute');

const request = require('supertest');
const express = require('express');
const app = express();
const prisma = require('../db/prismaClient');
const { errorHandler } = require('../utilities/errorHandler');
const {
  testUsers,
  testPosts,
  testComments,
  getUsersWithHashedPasswords
} = require('./testData');

app.use(express.urlencoded({ extended: false }));
app.use('/', postRouter);

app.use(errorHandler);

beforeEach(async () => {
  // Insert users, posts, and comments into the database
  await prisma.user.createMany({ data: testUsers });
  await prisma.post.createMany({ data: testPosts });
  await prisma.comment.createMany({ data: testComments });
});

afterEach(async () => {
  // Clean up database
  await prisma.comment.deleteMany({});
  await prisma.post.deleteMany({});
  await prisma.user.deleteMany({});
});

describe('posts GET /', () => {
  it('Should return all posts with status 200', async () => {
    const response = await request(app)
      .get('/')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toHaveProperty('status', 'success');
    expect(response.body).toHaveProperty('posts');
    expect(Array.isArray(response.body.posts)).toBeTruthy();

    // Sort posts by ID or title if necessary for comparison
    const expectedPosts = testPosts.sort((a, b) => a.id - b.id);
    const receivedPosts = response.body.posts.sort((a, b) => a.id - b.id);

    // Remove unnecessary fields from both expected and received posts for comparison
    const simplifiedExpectedPosts = expectedPosts.map(({ createdAt, updatedAt, ...post }) => post);
    const simplifiedReceivedPosts = receivedPosts.map(({ createdAt, updatedAt, ...post }) => post);

    expect(simplifiedReceivedPosts).toEqual(simplifiedExpectedPosts);
  });

  it('Should return an empty array if no posts exist', async () => {
    // Clear posts
    await prisma.post.deleteMany({});

    const response = await request(app)
      .get('/')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toHaveProperty('status', 'success');
    expect(response.body).toHaveProperty('posts');
    expect(response.body.posts).toEqual([]);
  });
})

describe('posts GET /:id', () => {
  it('Should return a post with the specified ID', async () => {
    const response = await request(app)
      .get('/1')
      .expect('Content-Type', /json/)
      .expect(200)

    expect(response.body).toHaveProperty("status", 'success');
    expect(response.body).toHaveProperty('post');

    const expectedPost = testPosts.find(post => post.id === 1);
    const { createdAt, updatedAt, ...want } = expectedPost;
    const { createdAt: _, updatedAt: __, ...got } = response.body.post;

    expect(got).toEqual(want);
  })

  it('Should return a 404 error for a non-existent post', async () => {
    const response = await request(app)
      .get('/999')
      .expect('Content-Type', /json/)
      .expect(404); // Assuming the server responds with 404 for not found

    expect(response.body).toHaveProperty('status', 'error');
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toContain('Post not found'); // Adjust according to your error message
  });

  it('Should return a 400 error for an invalid ID', async () => {
    const response = await request(app)
      .get('/abc')
      .expect('Content-Type', /json/)
      .expect(400); // Assuming the server responds with 400 for bad requests

    expect(response.body).toHaveProperty('status', 'error');
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toContain('Invalid ID'); // Adjust according to your error message
  });

  it('Should return a 404 error for a negative ID', async () => {
    const response = await request(app)
      .get('/-1')
      .expect('Content-Type', /json/)
      .expect(404); // Assuming the server responds with 404 for not found

    expect(response.body).toHaveProperty('status', 'error');
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toContain('Post not found'); // Adjust according to your error message
  });

  it('Should return a 404 error for ID 0', async () => {
    const response = await request(app)
      .get('/0')
      .expect('Content-Type', /json/)
      .expect(404); // Assuming the server responds with 404 for not found

    expect(response.body).toHaveProperty('status', 'error');
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toContain('Post not found'); // Adjust according to your error message
  });
})