const {sign} = require("jsonwebtoken");

function generateToken(id, scope) {
  return sign({ time: Date(), userId: id, scope: scope}, process.env.JWT_SECRET_KEY);
}

module.exports = {generateToken}