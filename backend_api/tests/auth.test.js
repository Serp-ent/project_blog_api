const request = require('supertest');
const prisma = require('../db/prismaClient');
const express = require('express');
const app = express();
const passport = require('passport');
const { registerUser, loginUser } = require('../controllers/usersController');

// Initialize routes and middleware
app.use(express.json());
app.use(passport.initialize());
app.use('/register', registerUser);
app.use('/login', loginUser);
app.use('/protected',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    res.json({ status: 'success', message: 'Authenticated' });
  }
);

let authToken = '';

describe('Authentication Tests', () => {
  beforeAll(async () => {
    // Register a user
    await prisma.user.deleteMany();
    const registerResponse = await request(app)
      .post('/register')
      .send({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        username: 'johndoe',
        password: 'password123@',
        passwordConfirm: 'password123@'
      })
      .expect(200);

    // Login to get a token
    const response = await request(app)
      .post('/login')
      .send({
        name: 'johndoe',
        password: 'password123@'
      });

    authToken = response.body.token;
  });

  it('Should authenticate with valid credentials', async () => {
    const response = await request(app)
      .post('/protected')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: 'New Post',
        content: 'This is the content of the new post that is definitely more than 20 characters long.'
      })
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toHaveProperty('status', 'success');
    expect(response.body).toHaveProperty('message', 'Authenticated');
  });

  it('should return 401 for unauthenticated requests', async () => {
    const response = await request(app)
      .post('/protected')
      .send({
        title: 'New Post',
        content: 'This is the content of the new post.'
      })
      .expect(401)
  });
});
