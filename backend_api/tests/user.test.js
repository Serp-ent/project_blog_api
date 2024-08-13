const userRouter = require('../routes/usersRoute');

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

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/', userRouter);

app.use(errorHandler);

beforeEach(async () => {
  await prisma.user.createMany({ data: testUsers });
});

afterEach(async () => {
  // cleanup
  await prisma.user.deleteMany();
})

describe('users GET /', () => {
  it("Should return all users with status 200", async () => {
    const response = await request(app)
      .get('/')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toHaveProperty('status', 'success');
    expect(response.body).toHaveProperty('users');
    expect(Array.isArray(response.body.users)).toBeTruthy();

    // Remove unnecessary fields from the expected users
    const expectedUsers = testUsers.map(({ password, ...user }) => user)
      .sort((a, b) => a.email.localeCompare(b.email));
    // Sort both the expected and received users by a common field (e.g., email)
    const receivedUsers = response.body.users
      .map(({ password, ...user }) => user)
      .sort((a, b) => a.email.localeCompare(b.email));

    // Check that the response contains the correct users
    expect(receivedUsers).toEqual(expectedUsers);
  })


  it("Should return only Authors with status 200", async () => {
    const response = await request(app)
      .get('/?role=AUTHOR')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toHaveProperty('status', 'success');
    expect(response.body).toHaveProperty('users');
    expect(Array.isArray(response.body.users)).toBeTruthy();

    // Remove unnecessary fields from the expected users
    const expectedUsers = testUsers
      .filter(user => user.role === 'AUTHOR')
      .map(({ password, ...user }) => user)
      .sort((a, b) => a.email.localeCompare(b.email));

    // Sort both the expected and received users by a common field (e.g., email)
    const receivedUsers = response.body.users
      .map(({ password, ...user }) => user)
      .sort((a, b) => a.email.localeCompare(b.email));

    // Check that the response contains the correct users
    expect(receivedUsers).toEqual(expectedUsers);
  })

  it("Should return only Readers with status 200", async () => {
    const response = await request(app)
      .get('/?role=reader')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toHaveProperty('status', 'success');
    expect(response.body).toHaveProperty('users');
    expect(Array.isArray(response.body.users)).toBeTruthy();

    // Remove unnecessary fields from the expected users
    const expectedUsers = testUsers
      .filter(user => user.role === 'READER')
      .map(({ password, ...user }) => user)
      .sort((a, b) => a.email.localeCompare(b.email));

    // Sort both the expected and received users by a common field (e.g., email)
    const receivedUsers = response.body.users
      .map(({ password, ...user }) => user)
      .sort((a, b) => a.email.localeCompare(b.email));

    // Check that the response contains the correct users
    expect(receivedUsers).toEqual(expectedUsers);
  })

  it("Should handle empty database with status 200", async () => {
    await prisma.user.deleteMany();

    const response = await request(app)
      .get('/')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toHaveProperty('status', 'success');
    expect(response.body).toHaveProperty('users');
    expect(response.body.users).toEqual([]);
  })

  it("Should handle invalid role query parameter", async () => {
    const response = await request(app)
      .get('/?role=INVALID_ROLE')
      .expect('Content-Type', /json/)
      .expect(400);

    expect(response.body).toHaveProperty('status', 'error')
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toContain('Invalid role')
  })
})

describe('User GET /id', () => {
  it("Should return user 1", async () => {
    const response = await request(app)
      .get('/1')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toHaveProperty('status', 'success');
    expect(response.body).toHaveProperty('user');

    const user = testUsers.find(user => user.id === 1);
    const { password, ...want } = user;

    const got = response.body.user;

    expect(got).toEqual(want);
  })

  it("Should return user 2", async () => {
    const response = await request(app)
      .get('/2')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toHaveProperty('status', 'success');
    expect(response.body).toHaveProperty('user');

    // setup
    const user = testUsers.find(user => user.id === 2);
    const { password, ...want } = user;

    const got = response.body.user;
    expect(got).toEqual(want);
  })

  it("Should return error for non-numeric ID", async () => {
    const response = await request(app)
      .get('/abc')
      .expect('Content-Type', /json/)
      .expect(400); // Assuming the server responds with 400 for bad requests

    expect(response.body).toHaveProperty('status', 'error');
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toContain('Invalid ID'); // Adjust according to your error message
  });

  it("Should return error for negative ID", async () => {
    const response = await request(app)
      .get('/-1')
      .expect('Content-Type', /json/)
      .expect(404); // Assuming the server responds with 404 for not found

    expect(response.body).toHaveProperty('status', 'error');
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toContain('User not found'); // Adjust according to your error message
  });

  it("Should return error for ID 0", async () => {
    const response = await request(app)
      .get('/0')
      .expect('Content-Type', /json/)
      .expect(404); // Assuming the server responds with 404 for not found

    expect(response.body).toHaveProperty('status', 'error');
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toContain('User not found'); // Adjust according to your error message
  });

  it("Should return error for non-existent ID 10", async () => {
    const response = await request(app)
      .get('/10')
      .expect('Content-Type', /json/)
      .expect(404); // Assuming the server responds with 404 for not found

    expect(response.body).toHaveProperty('status', 'error');
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toContain('User not found'); // Adjust according to your error message
  });
})

describe('User DELETE /:id', () => {
  it("Should delete user 1 and return success", async () => {
    const response = await request(app)
      .delete('/1')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toHaveProperty('status', 'success');
    expect(response.body).toHaveProperty('message', 'User deleted successfully'); // Adjust according to your success message

    // Verify user is deleted
    const checkResponse = await request(app)
      .get('/1')
      .expect('Content-Type', /json/)
      .expect(404);

    expect(checkResponse.body).toHaveProperty('status', 'error');
    expect(checkResponse.body).toHaveProperty('message');
    expect(checkResponse.body.message).toContain('User not found'); // Adjust according to your error message
  });

  it("Should delete user 2 and return success", async () => {
    const response = await request(app)
      .delete('/2')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toHaveProperty('status', 'success');
    expect(response.body).toHaveProperty('message', 'User deleted successfully'); // Adjust according to your success message

    // Verify user is deleted
    const checkResponse = await request(app)
      .get('/2')
      .expect('Content-Type', /json/)
      .expect(404);

    expect(checkResponse.body).toHaveProperty('status', 'error');
    expect(checkResponse.body).toHaveProperty('message');
    expect(checkResponse.body.message).toContain('User not found'); // Adjust according to your error message
  });

  it("Should return error for non-numeric ID", async () => {
    const response = await request(app)
      .delete('/abc')
      .expect('Content-Type', /json/)
      .expect(400); // Assuming the server responds with 400 for bad requests

    expect(response.body).toHaveProperty('status', 'error');
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toContain('Invalid ID'); // Adjust according to your error message
  });

  it("Should return error for negative ID", async () => {
    const response = await request(app)
      .delete('/-1')
      .expect('Content-Type', /json/)
      .expect(404); // Assuming the server responds with 404 for not found

    expect(response.body).toHaveProperty('status', 'error');
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toContain('User not found'); // Adjust according to your error message
  });

  it("Should return error for non-existent ID 0", async () => {
    const response = await request(app)
      .delete('/0')
      .expect('Content-Type', /json/)
      .expect(404); // Assuming the server responds with 404 for not found

    expect(response.body).toHaveProperty('status', 'error');
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toContain('User not found'); // Adjust according to your error message
  });

  it("Should return error for non-existent ID 10", async () => {
    const response = await request(app)
      .delete('/10')
      .expect('Content-Type', /json/)
      .expect(404); // Assuming the server responds with 404 for not found

    expect(response.body).toHaveProperty('status', 'error');
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toContain('User not found'); // Adjust according to your error message
  });
});

describe('POST / (REGISTER USER)', () => {
  it('should register a new user with valid data', async () => {
    const newUser = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe1@example.com',
      username: 'johndoe1',
      password: 'Password@123',
      passwordConfirm: 'Password@123',
    };

    const response = await request(app)
      .post('/')
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
      .post('/')
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
      .post('/')
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
      .post('/')
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
      .post('/')
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
      .post('/')
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
      .post('/')
      .send(newUser)
      .expect('Content-Type', /json/)
      .expect(400);

    expect(response.body).toHaveProperty('status', 'error');
    expect(response.body.message).toBe('Username must be at least 3 characters long');
  });

});

// test('user route works', done => {
//   request(app)
//     .get("/")
//     .expect('Content-Type', /json/)
//     .expect(200, done);
// })

// test("testing route works", done => {
//   request(app)
//     .post('/test')
//     .send({ item: 'hey' })
//     .then(() => {
//       request(app)
//         .get('/test')
//         .expect({ array: "undefined" })
//     });
// })