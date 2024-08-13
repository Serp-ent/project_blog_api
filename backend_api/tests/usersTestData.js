const bcrypt = require('bcryptjs');

const testUsers = [
  {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    username: 'johndoe',
    password: 'password123',
    role: 'READER',
    registeredAt: '2024-08-13T13:00:00.000Z', // Include milliseconds
  },
  {
    id: 2,
    firstName: 'Jane',
    lastName: 'Doe',
    email: 'jane.doe@example.com',
    username: 'janedoe',
    password: 'password123',
    role: 'AUTHOR',
    registeredAt: '2024-08-13T14:00:00.000Z', // Include milliseconds
  },
  {
    id: 3,
    firstName: 'Alice',
    lastName: 'Smith',
    email: 'alice.smith@example.com',
    username: 'alicesmith',
    password: 'password123',
    role: 'READER',
    registeredAt: '2024-08-13T15:00:00.000Z', // Include milliseconds
  },
  {
    id: 4,
    firstName: 'Bob',
    lastName: 'Johnson',
    email: 'bob.johnson@example.com',
    username: 'bobjohnson',
    password: 'password123',
    role: 'AUTHOR',
    registeredAt: '2024-08-13T16:00:00.000Z', // Include milliseconds
  },
  {
    id: 5,
    firstName: 'Charlie',
    lastName: 'Brown',
    email: 'charlie.brown@example.com',
    username: 'charliebrown',
    password: 'password123',
    role: 'READER',
    registeredAt: '2024-08-13T17:00:00.000Z', // Include milliseconds
  },
];

const getUsersWithHashedPasswords = async () => {
  return Promise.all(
    testUsers.map(async user => ({
      ...user,
      password: await bcrypt.hash(user.password, 10), // Hash passwords if necessary
    }))
  );
}

module.exports = {
  testUsers,
  getUsersWithHashedPasswords
}