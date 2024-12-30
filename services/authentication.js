require("dotenv").config();
const jwt = require("jsonwebtoken");
const secret = process.env.SECRET;

function createTokenForUser(user) {
  const payload = {
    _id: user.id,
    name: user.fullName,
    email: user.email,
    profileImageUrl: user.profileImageUrl,
    role: user.role,
  };

  const token = jwt.sign(payload, secret);

  return token;
}

function validateToken(token) {
  const payload = jwt.verify(token, secret);
  return payload;
}

module.exports = { createTokenForUser, validateToken };
