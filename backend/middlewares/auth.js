const {verify} = require("jsonwebtoken");
const User = require("../models/userModel");

const isConnected = (req, res, next) => {
  try {
    if (!req.headers['authorization']){
      res.status(401).send({message: "Access Denied, not token"});
    }
    const token = req.headers['authorization'].split(" ")[1];
    if (!token) return res.status(403).send("No token provided!\"");
    const decoded = verify(token, process.env.JWT_SECRET_KEY);
    if (!decoded || decoded.scope !== "access" ){
      res.status(400).json({message: "This token is not accessToken"})
    }
    const expirationTime = parseInt(new Date(decoded.time).getTime()) + parseInt(process.env.JWT_EXPIRATION);
    if (expirationTime < new Date().getTime()) {
      req.userId = decoded.userId;
      next();
    } else {
      res.status(401).send({message: "Access denied"});
    }
  } catch (error) {
    console.error('Error verifying token:', error.message);
    res.status(400).send(error);
  }
};

module.exports = isConnected