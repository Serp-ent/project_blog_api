const request = require('supertest');
const prisma = require('../db/prismaClient');
const express = require('express');
const app = express();
const passport = require('passport');
const { registerUser, loginUser } = require('../controllers/usersController');
const { errorHandler } = require('../utilities/errorHandler');

// Initialize routes and middleware
app.use(express.json());
app.use(passport.initialize());

app.post('/register', registerUser);
app.post('/login', loginUser);

app.get('/protected',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    res.json({ status: 'success', message: 'Authenticated' });
  }
);


app.use(errorHandler);


describe('Authentication Tests', () => {
  let authToken = '';

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
      })
      .expect('Content-Type', /json/)
      .expect(200);

    authToken = response.body.token;
  });

  it('Should authenticate with valid credentials', async () => {
    console.log('authtoken', authToken)
    const response = await request(app)
      .get('/protected')
      .set('Authorization', `Bearer ${authToken}`)
    // .expect('Content-Type', /json/)
    // .expect(200);

    console.log('body', response.status)
    console.log('body', response.body)
    console.log('header', response.headers)
    expect(response.body).toHaveProperty('status', 'success');
    expect(response.body).toHaveProperty('message', 'Authenticated');
  });

  it('should return 401 for unauthenticated requests', async () => {
    const response = await request(app)
      .get('/protected')
      .expect(401)
  });

  it('should return 401 for incorrect token requests', async () => {
    const response = await request(app)
      .get('/protected')
      .set('Authorization', 'Bearer InvalidToken')
      .expect(401)
  });
});

describe('Register user', () => {
  beforeEach(async () => {
    const user = {
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane.doe@example.com',
      username: 'janedoe',
      password: 'password123',
    };

    await prisma.user.create({
      data: user
    });

  })
  afterEach(async () => {
    await prisma.user.deleteMany();
  })

  it('should register a new user with valid data', async () => {
    const newUser = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'newUser1@example.com',
      username: 'newUser',
      password: 'Password@123',
      passwordConfirm: 'Password@123',
    };

    const response = await request(app)
      .post('/register')
      .send(newUser)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toHaveProperty('result', 'success');
    expect(response.body).toHaveProperty('token');
  });

  it('should fail if first name is missing', async () => {
    const newUser = {
      lastName: 'Doe',
      email: 'john.doe@example.com',
      username: 'johndoe',
      password: 'Password@123',
      passwordConfirm: 'Password@123',
    };

    const response = await request(app)
      .post('/register')
      .send(newUser)
      .expect('Content-Type', /json/)
      .expect(400);

    expect(response.body).toHaveProperty('status', 'error');
    expect(response.body.message).toBe('First name is required');
  });

  it('should fail if email is invalid', async () => {
    const newUser = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe',
      username: 'johndoe',
      password: 'Password@123',
      passwordConfirm: 'Password@123',
    };

    const response = await request(app)
      .post('/register')
      .send(newUser)
      .expect('Content-Type', /json/)
      .expect(400);

    expect(response.body).toHaveProperty('status', 'error');
    expect(response.body.message).toBe('Invalid email address');
  });

  it('should fail if password and confirmation do not match', async () => {
    const newUser = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      username: 'johndoe',
      password: 'Password@123',
      passwordConfirm: 'Password@456',
    };

    const response = await request(app)
      .post('/register')
      .send(newUser)
      .expect('Content-Type', /json/)
      .expect(400);

    expect(response.body).toHaveProperty('status', 'error');
    expect(response.body.message).toBe('Passwords must match');
  });

  it('should fail if the user email is in use', async () => {
    const usedEmail = {
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane.doe@example.com',
      username: 'freejanedoe',
      password: 'password123',
    };

    // to fulfill password requirements
    usedEmail.password += '!';
    usedEmail.passwordConfirm = usedEmail.password;

    const response = await request(app)
      .post('/register')
      .send(usedEmail)
      .expect('Content-Type', /json/)
      .expect(409);

    expect(response.body).toHaveProperty('status', 'error');
    expect(response.body.message).toBe('Email already exists');
  });

  it('should fail if the user username is in use', async () => {
    const usedUserName = {
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'freeEmail@free.com',
      username: 'janedoe',
      password: 'password123',
    };

    // to fulfill password requirements
    usedUserName.password += '!';
    usedUserName.passwordConfirm = usedUserName.password;

    const response = await request(app)
      .post('/register')
      .send(usedUserName)
      .expect('Content-Type', /json/)
      .expect(409);

    expect(response.body).toHaveProperty('status', 'error');
    expect(response.body.message).toBe('Username already exists');
  });

  it('should fail if the username is too short', async () => {
    const newUser = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      username: 'jd',
      password: 'Password@123',
      passwordConfirm: 'Password@123',
    };

    const response = await request(app)
      .post('/register')
      .send(newUser)
      .expect('Content-Type', /json/)
      .expect(400);

    expect(response.body).toHaveProperty('status', 'error');
    expect(response.body.message).toBe('Username must be at least 3 characters long');
  });

});


// describe('Login', () => {
//   beforeAll(() => {

//   })
// })
