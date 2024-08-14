const postRouter = require('../routes/postsRoute');
const { loginUser, registerUser } = require('../controllers/usersController');

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
const passport = require('../config/passport-cfg');
const { createPost } = require('../controllers/postsController');

app.use(passport.initialize());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.post('/createPost',
  (req, res, next) => {
    // mock user 
    req.user = {
      id: 1,
    };

    next();
  },
  createPost
);

app.use('/posts', postRouter);
app.use('/register', registerUser);

app.use(errorHandler);

beforeEach(async () => {
  // Insert users, posts, and comments into the database
  await prisma.comment.deleteMany({});
  await prisma.post.deleteMany({});
  await prisma.user.deleteMany({});

  await prisma.user.createMany({ data: testUsers });
  await prisma.post.createMany({ data: testPosts });
  await prisma.comment.createMany({ data: testComments });
});

afterEach(async () => {
  // Clean up database
  await prisma.comment.deleteMany({});
  await prisma.post.deleteMany({});
  await prisma.user.deleteMany({});
  // start counting from 0
});

describe('posts GET /', () => {
  it('Should return all posts with status 200', async () => {
    const response = await request(app)
      .get('/posts')
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
      .get('/posts')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toHaveProperty('status', 'success');
    expect(response.body).toHaveProperty('posts');
    expect(response.body.posts).toEqual([]);
  });

  it('Should return the correct number of posts per page', async () => {
    const response = await request(app)
      .get('/posts')
      .query({ page: 1, limit: 2 }) // Request the first page with a limit of 2 posts per page
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toHaveProperty('status', 'success');
    expect(response.body).toHaveProperty('posts');
    expect(Array.isArray(response.body.posts)).toBeTruthy();
    expect(response.body.posts.length).toBe(2); // Expect 2 posts to be returned

    // Sort posts by createdAt date and id before comparison
    const expectedPosts = testPosts
      .sort((a, b) => {
        const dateComparison = new Date(a.createdAt) - new Date(b.createdAt);
        return dateComparison !== 0 ? dateComparison : a.id - b.id;
      })
      .slice(0, 2); // The first 2 posts

    const simplifiedExpectedPosts = expectedPosts.map(({ createdAt, updatedAt, ...post }) => post);

    const simplifiedReceivedPosts = response.body.posts
      .sort((a, b) => {
        const dateComparison = new Date(a.createdAt) - new Date(b.createdAt);
        return dateComparison !== 0 ? dateComparison : a.id - b.id;
      })
      .map(({ createdAt, updatedAt, ...post }) => post);

    expect(simplifiedReceivedPosts).toEqual(simplifiedExpectedPosts);
  });

  it('Should return the correct page of posts', async () => {
    const response = await request(app)
      .get('/posts')
      .query({ page: 2, limit: 2 }) // Request the second page with a limit of 2 posts per page
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toHaveProperty('status', 'success');
    expect(response.body).toHaveProperty('posts');
    expect(Array.isArray(response.body.posts)).toBeTruthy();
    expect(response.body.posts.length).toBe(2); // Expect 2 posts to be returned

    // Further verification if needed
    const expectedPosts = testPosts.slice(2, 4); // The second set of 2 posts
    const simplifiedExpectedPosts = expectedPosts.map(({ createdAt, updatedAt, ...post }) => post);
    const simplifiedReceivedPosts = response.body.posts.map(({ createdAt, updatedAt, ...post }) => post);

    expect(simplifiedReceivedPosts).toEqual(simplifiedExpectedPosts);
  });

  it('Should return an empty array if the page exceeds the number of available posts', async () => {
    const response = await request(app)
      .get('/posts')
      .query({ page: 10, limit: 2 }) // Request a page that doesn't exist
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toHaveProperty('status', 'success');
    expect(response.body).toHaveProperty('posts');
    expect(response.body.posts).toEqual([]);
  });

  it('Should return all posts if no pagination parameters are provided', async () => {
    const response = await request(app)
      .get('/posts')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toHaveProperty('status', 'success');
    expect(response.body).toHaveProperty('posts');
    expect(Array.isArray(response.body.posts)).toBeTruthy();
    expect(response.body.posts.length).toBe(testPosts.length); // All posts should be returned

    const simplifiedExpectedPosts = testPosts.map(({ createdAt, updatedAt, ...post }) => post);
    const simplifiedReceivedPosts = response.body.posts.map(({ createdAt, updatedAt, ...post }) => post);

    expect(simplifiedReceivedPosts).toEqual(simplifiedExpectedPosts);
  });
})

describe('posts GET /:id', () => {
  it('Should return a post with the specified ID', async () => {
    const response = await request(app)
      .get('/posts/1')
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
      .get('/posts/999')
      .expect('Content-Type', /json/)
      .expect(404); // Assuming the server responds with 404 for not found

    expect(response.body).toHaveProperty('status', 'error');
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toContain('Post not found'); // Adjust according to your error message
  });

  it('Should return a 400 error for an invalid ID', async () => {
    const response = await request(app)
      .get('/posts/abc')
      .expect('Content-Type', /json/)
      .expect(400); // Assuming the server responds with 400 for bad requests

    expect(response.body).toHaveProperty('status', 'error');
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toContain('Invalid ID'); // Adjust according to your error message
  });

  it('Should return a 404 error for a negative ID', async () => {
    const response = await request(app)
      .get('/posts/-1')
      .expect('Content-Type', /json/)
      .expect(404); // Assuming the server responds with 404 for not found

    expect(response.body).toHaveProperty('status', 'error');
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toContain('Post not found'); // Adjust according to your error message
  });

  it('Should return a 404 error for ID 0', async () => {
    const response = await request(app)
      .get('/posts/0')
      .expect('Content-Type', /json/)
      .expect(404); // Assuming the server responds with 404 for not found

    expect(response.body).toHaveProperty('status', 'error');
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toContain('Post not found'); // Adjust according to your error message
  });

})

describe('GET /:id/comments', () => {
  it('Should return comments for a valid post ID', async () => {
    const response = await request(app)
      .get('/posts/1/comments')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toHaveProperty('status', 'success');
    expect(response.body).toHaveProperty('comments');
    expect(Array.isArray(response.body.comments)).toBe(true);

    const expectedComments = [
      {
        id: 1,
        authorId: 1,
        postId: 1,
        content: 'Great post!',
        createdAt: '2024-08-13T14:00:00.000Z',
        author: { username: 'johndoe' },
      },
      {
        id: 2,
        authorId: 3,
        postId: 1,
        content: 'Very informative.',
        createdAt: '2024-08-13T15:00:00.000Z',
        author: { username: 'alicesmith' },
      },
    ];

    const receivedComments = response.body.comments;

    expect(receivedComments).toEqual(expectedComments);
  });

  it('Should return an empty array if no comments exist for the post', async () => {
    const response = await request(app)
      .get('/posts/5/comments')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toHaveProperty('status', 'success');
    expect(response.body).toHaveProperty('comments');
    expect(response.body.comments).toEqual([]);
  });

  it('Should return a 404 error for a non-existent post ID', async () => {
    const response = await request(app)
      .get('/posts/999/comments')
      .expect('Content-Type', /json/)
      .expect(404);

    expect(response.body).toHaveProperty('status', 'error');
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toContain('Post not found');
  });

  it('Should return a 400 error for an invalid post ID', async () => {
    const response = await request(app)
      .get('/posts/abc/comments')
      .expect('Content-Type', /json/)
      .expect(400);

    expect(response.body).toHaveProperty('status', 'error');
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toContain('Invalid ID');
  });

  it('Should return a 404 error for a negative post ID', async () => {
    const response = await request(app)
      .get('/posts/-1/comments')
      .expect('Content-Type', /json/)
      .expect(404);

    expect(response.body).toHaveProperty('status', 'error');
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toContain('Post not found');
  });

  it('Should return a 404 error for ID 0', async () => {
    const response = await request(app)
      .get('/posts/0/comments')
      .expect('Content-Type', /json/)
      .expect(404);

    expect(response.body).toHaveProperty('status', 'error');
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toContain('Post not found');
  });
});

// TODO: turn off all authentication and validation for controllers testgin
// and turn on in distinct test for auth testing
describe('POST / (CREATE POST)', () => {
  it('should create a post successfully with valid auth and role', async () => {
    const response = await request(app)
      .post('/createPost')
      .send({
        title: 'New Post',
        content: 'This is the content of the new post that is definitely more than 20 characters long.'
      })
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toHaveProperty('status', 'success');
    expect(response.body).toHaveProperty('post');
    expect(response.body.post).toHaveProperty('title', 'New Post');
    expect(response.body.post).toHaveProperty('content', 'This is the content of the new post that is definitely more than 20 characters long.');
  });

  it('should return 400 for missing title', async () => {
    const response = await request(app)
      .post('/createPost')
      .send({
        content: 'This is the content of the new post.',
      })
      .expect('Content-Type', /json/)
      .expect(400);

    expect(response.body).toHaveProperty('status', 'error');
    expect(response.body).toHaveProperty('message', 'Title is required');
  });

  it('should return 400 for missing content', async () => {
    const response = await request(app)
      .post('/createPost')
      .send({
        title: 'New Post',
      })
      .expect('Content-Type', /json/)
      .expect(400);

    expect(response.body).toHaveProperty('status', 'error');
    expect(response.body).toHaveProperty('message', 'Content is required');
  });
})