const userRouter = require('../routes/usersRoute');

const request = require('supertest');
const express = require('express');
const bcrypt = require('bcryptjs');
const app = express();
const prisma = require('../db/prismaClient');

app.use(express.urlencoded({ extended: false }));
app.use('/', userRouter);

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
  // In test id should be ignored, but prevents large ids 

  // make sure to fresh start
  await prisma.$executeRaw`TRUNCATE TABLE "User" RESTART IDENTITY CASCADE`;

  const users = await prepareUsers();
  await prisma.user.createMany({
    data: users,
  });
});

afterEach(async () => {
  // cleanup
  await prisma.$executeRaw`TRUNCATE TABLE "User" RESTART IDENTITY CASCADE`;
})

describe('users GET /', () => {
  it("Should return all users with status 200", async () => {
    const response = await request(app)
      .get('/')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toHaveProperty('status', 'success');
    expect(response.body).toHaveProperty('users');

    // Remove unnecessary fields from the expected users
    const expectedUsers = testUsers.map(({ password, ...user }) => user).sort((a, b) => a.email.localeCompare(b.email));
    // Sort both the expected and received users by a common field (e.g., email)
    const receivedUsers = response.body.users.map(({ password, id, registeredAt, ...user }) => user).sort((a, b) => a.email.localeCompare(b.email));

    // Check that the response contains the correct users
    expect(receivedUsers).toEqual(expectedUsers);
  })
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