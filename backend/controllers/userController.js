const User = require('../models/userModel');
const {hashPassword} =  require("../utils/bcrypt");
const {generateToken} = require("../utils/jwt");

exports.addUser = async (req, res) => {
  try {
    req.body.password = hashPassword(req.body.password);
    const user = new User(req.body);
    await user.save();
    
    let accessToken = generateToken(user.id, "access");
    let refreshToken = generateToken(user.id, "refresh");

    res.status(201).json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
