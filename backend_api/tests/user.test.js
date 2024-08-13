const userRouter = require('../routes/usersRoute');

const request = require('supertest');
const express = require('express');
const bcrypt = require('bcryptjs');
const app = express();
const prisma = require('../db/prismaClient');
const { errorHandler } = require('../utilities/errorHandler');

app.use(express.urlencoded({ extended: false }));
app.use('/', userRouter);

app.use(errorHandler);

const testUsers = [
  {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    username: 'johndoe',
    password: 'password123',
    role: 'READER',
  },
  {
    firstName: 'Jane',
    lastName: 'Doe',
    email: 'jane.doe@example.com',
    username: 'janedoe',
    password: 'password123',
    role: 'AUTHOR',
  },
  {
    firstName: 'Alice',
    lastName: 'Smith',
    email: 'alice.smith@example.com',
    username: 'alicesmith',
    password: 'password123',
    role: 'READER',
  },
  {
    firstName: 'Bob',
    lastName: 'Johnson',
    email: 'bob.johnson@example.com',
    username: 'bobjohnson',
    password: 'password123',
    role: 'AUTHOR',
  },
  {
    firstName: 'Charlie',
    lastName: 'Brown',
    email: 'charlie.brown@example.com',
    username: 'charliebrown',
    password: 'password123',
    role: 'READER',
  },
];

const prepareUsers = async () => {
  return Promise.all(
    testUsers.map(async user => ({
      ...user,
      password: await bcrypt.hash(user.password, 10), // Hash passwords if necessary
    }))
  );
}

beforeEach(async () => {
  const users = await prepareUsers();
  await prisma.user.createMany({
    data: users,
  });
});

afterEach(async () => {
  // cleanup
  await prisma.$executeRaw`TRUNCATE TABLE "User" RESTART IDENTITY CASCADE`;
  // In test id should be ignored, but prevents large ids 
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
      .map(({ password, id, registeredAt, ...user }) => user)
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
      .map(({ password, id, registeredAt, ...user }) => user)
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
      .map(({ password, id, registeredAt, ...user }) => user)
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

    // setup
    const user = testUsers.at(0);  // Postgresql starts counting from 1
    const { password, ...rest } = user;
    const want = rest;
    want.id = 1;

    const { registeredAt, ...got } = response.body.user;
    console.log(got);
    console.log(want);

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
    const user = testUsers.at(1);  // Postgresql starts counting from 1
    const { password, ...rest } = user;
    const want = rest;
    want.id = 2;

    const { registeredAt, ...got } = response.body.user;
    console.log(got);
    console.log(want);

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