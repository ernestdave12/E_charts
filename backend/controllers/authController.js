const {checkPassword} = require("../utils/bcrypt");
const User = require("../models/userModel");
const {sleep} = require("../utils/sleep");
const {verify, sign} = require("jsonwebtoken");
const {generateToken} = require("../utils/jwt");


exports.login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email }).select("+password");
    if (user) {
      if (checkPassword(req.body.password, user.password)) {
        let accessToken = generateToken(user.id, "access");
        let refreshToken = generateToken(user.id, "refresh");
      
        res.status(200).json({
          user: {
            id: user._id,
            email: user.email,
            name: user.name
          },
          accessToken: accessToken,
          refreshToken: refreshToken
        });
      } else {
        await sleep(1000);
        res.status(400).json({ message: "incorrect password" });
      }
    } else {
      res.status(400).json({ message: "email not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};


exports.refreshToken =async (req, res) => {
  try {
    let refreshToken = req.body.refreshToken
    console.log(refreshToken, "refresh")
    const decoded = verify(refreshToken, process.env.JWT_SECRET_KEY);
    console.log(decoded, " decoded")
    if (!decoded || decoded.scope !== "refresh" ){
      return res.status(400).json({message: "This token is not refreshToken"})
    }
    const expirationTime = parseInt(new Date(decoded.time).getTime()) + parseInt(process.env.JWT_REFRESH_EXPIRATION);
    if (expirationTime > parseInt(new Date().getTime())){
      let accessToken = generateToken(decoded.userId, "access")
      return res.status(200).json({"accessToken": accessToken})
    }
    return res.status(400).json({message: "refreshToken expirated"})
  } catch (error) {
    return res.status(401).send(error);
  }
}

exports.validateToken = async (req, res) => {

  try {
    if (!req.headers['authorization']){
      res.status(401).send({message: "Access Denied, not token"});
    }
    const token = req.headers['authorization'].split(" ")[1];
    const decoded = verify(token, process.env.JWT_SECRET_KEY);
    if (!decoded || decoded.scope !== "access" ){
      res.status(400).json({message: "this token is not accessToken"})
    }
    const expirationTime = parseInt(new Date(decoded.time).getTime()) + parseInt(process.env.JWT_EXPIRATION);
    if (expirationTime < new Date().getTime()) {
      return res.json("Successfully Verified");
    } else {

      return res.status(401).json({message: "Access denied"});
    }
  } catch (error) {
    
    console.log(error)
    return res.status(401).json(error);
  }
};

exports.logout = async (req, res) => {
  try {
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
