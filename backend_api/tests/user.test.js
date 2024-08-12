const userRouter = require('../routes/usersRoute');

const request = require('supertest');
const express = require('express');
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use('/', userRouter);

test('user route works', done => {
  request(app)
    .get("/")
    .expect('Content-Type', /json/)
    .expect(200, done);
})

test("testing route works", done => {
  request(app)
    .post('/test')
    .send({ item: 'hey' })
    .then(() => {
      request(app)
        .get('/test')
        .expect({ array: "undefined" })
    });
})