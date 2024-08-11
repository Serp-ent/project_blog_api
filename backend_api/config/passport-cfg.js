const passport = require('passport');
const prisma = require('../db/prismaClient');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken');

require('dotenv').config();

const opts = {
  secretOrKey: process.env.JWT_SECRET,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
  // EXAMPLE OF JWT_PAYLOAD
  //   jwt_payload:  {
  //   id: 6,
  //   email: 'john.doe@example.com',
  //   username: '1',
  //   iat: 1723225344,
  //   exp: 1723228944
  // }

  try {
    const user = await prisma.user.findUnique({
      where: { id: jwt_payload.id, },
    });

    if (!user) {
      return done(null, false)
    }

    return done(null, user);
  } catch (err) {
    return done(err, false);
  }
}));

module.exports = passport;
