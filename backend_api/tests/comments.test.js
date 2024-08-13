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

describe('mute error', () => {
  it('Should be true == true', () => {
    expect(true).toBeTruthy();
  })
})
