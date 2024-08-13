const bcrypt = require('bcryptjs');

const testUsers = [
  {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    username: 'johndoe',
    password: 'password123', // Ensure this is hashed in your real setup
    role: 'READER',
    registeredAt: new Date().toISOString(),
  },
  {
    id: 2,
    firstName: 'Jane',
    lastName: 'Doe',
    email: 'jane.doe@example.com',
    username: 'janedoe',
    password: 'password123',
    role: 'AUTHOR',
    registeredAt: new Date().toISOString(),
  },
  {
    id: 3,
    firstName: 'Alice',
    lastName: 'Smith',
    email: 'alice.smith@example.com',
    username: 'alicesmith',
    password: 'password123',
    role: 'READER',
    registeredAt: new Date().toISOString(),
  },
  {
    id: 4,
    firstName: 'Bob',
    lastName: 'Johnson',
    email: 'bob.johnson@example.com',
    username: 'bobjohnson',
    password: 'password123',
    role: 'AUTHOR',
    registeredAt: new Date().toISOString(),
  },
  {
    id: 5,
    firstName: 'Charlie',
    lastName: 'Brown',
    email: 'charlie.brown@example.com',
    username: 'charliebrown',
    password: 'password123',
    role: 'READER',
    registeredAt: new Date().toISOString(),
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


const testPosts = [
  {
    id: 1,
    authorId: 2, // Author 1
    title: 'First Post',
    content: 'Content for the first post',
    published: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 2,
    authorId: 2, // Author 1
    title: 'Second Post',
    content: 'Content for the second post',
    published: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 3,
    authorId: 4, // Author 2
    title: 'Third Post',
    content: 'Content for the third post',
    published: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 4,
    authorId: 4, // Author 2
    title: 'Fourth Post',
    content: 'Content for the fourth post',
    published: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 5,
    authorId: 3, // Reader 1
    title: 'Fifth Post',
    content: 'This is POST without comments',
    published: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const testComments = [
  { id: 1, authorId: 1, postId: 1, content: 'Great post!', createdAt: '2024-08-13T14:00:00.000Z' },
  { id: 2, authorId: 3, postId: 1, content: 'Very informative.', createdAt: '2024-08-13T15:00:00.000Z' },
  { id: 3, authorId: 4, postId: 2, content: 'Interesting read.', createdAt: '2024-08-14T14:00:00.000Z' },
  { id: 4, authorId: 2, postId: 2, content: 'Thanks for sharing.', createdAt: '2024-08-14T15:00:00.000Z' },
  { id: 5, authorId: 5, postId: 3, content: 'I disagree with some points.', createdAt: '2024-08-15T14:00:00.000Z' },
  { id: 6, authorId: 1, postId: 3, content: 'Could you elaborate?', createdAt: '2024-08-15T15:00:00.000Z' },
  { id: 7, authorId: 3, postId: 4, content: 'This is a great topic.', createdAt: '2024-08-16T14:00:00.000Z' },
  { id: 8, authorId: 4, postId: 4, content: 'Well-written post.', createdAt: '2024-08-16T15:00:00.000Z' },
  { id: 9, authorId: 2, postId: 4, content: 'Looking forward to more posts.', createdAt: '2024-08-17T14:00:00.000Z' },
];

module.exports = {
  testUsers,
  testPosts,
  testComments,
  getUsersWithHashedPasswords
};