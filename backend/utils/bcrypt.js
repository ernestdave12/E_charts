const bcrypt = require('bcrypt');

function hashPassword(plainPassword){
  return bcrypt.hashSync(plainPassword, Number(process.env.SALT_ROUNDS));
}

function checkPassword(plainPassword, hashPassword){
  return bcrypt.compareSync(plainPassword, hashPassword);
}

module.exports = { hashPassword, checkPassword };

