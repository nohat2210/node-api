const User = require('../models/User');
const createError = require('http-errors');
const redisClient = require('../redis_connect');
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require('../helpers/jwtHelper');

const authGoolge = async (req, res, next) => {
  const user = req.user;
  const accessToken = await generateAccessToken(req.user.id);
  const refreshToken = await generateRefreshToken(req.user.id);
  return res.status(200).json({ accessToken, refreshToken, user });
};

const authFacebook = async (req, res, next) => {
  const user = req.user;
  const accessToken = await generateAccessToken(req.user.id);
  const refreshToken = await generateRefreshToken(req.user.id);
  return res.status(200).json({ accessToken, refreshToken, user });
};

const login = async (req, res, next) => {
  const user = req.user;
  const accessToken = await generateAccessToken(req.user.id);
  const refreshToken = await generateRefreshToken(req.user.id);
  return res.status(200).json({ accessToken, refreshToken, user });
};

const logout = async (req, res, next) => {
  const { refreshToken } = req.body;
  if (!refreshToken) throw createError.BadRequest();
  const userID = await verifyRefreshToken(refreshToken);
  redisClient.DEL(userID, (err, val) => {
    if (err) {
      console.log(err.message);
      throw createError.InternalServerError();
    }
    console.log(val);
    res.sendStatus(204);
  });
};

const register = async (req, res, next) => {
  const { firstName, lastName, email, password } = req.value.body;
  //check duplicate email
  const foundUser = await User.findOne({ email });
  if (foundUser) throw createError.Conflict('Email already exists');
  //create a new user
  const newUser = new User({ firstName, lastName, email, password });
  newUser.save();
  // encode a token
  const accessToken = await generateAccessToken(newUser.id);
  const refreshToken = await generateRefreshToken(newUser.id);
  res.setHeader('athorization', accessToken);
  return res.status(201).json({ success: true });
};

const refreshToken = async (req, res, next) => {
  const { refreshToken } = req.body;
  if (!refreshToken) throw createError.BadRequest('Invalid request');
  const userID = await verifyRefreshToken(refreshToken);
  const accessToken = await generateAccessToken(userID);
  res.json({ accessToken });
};

const secret = async (req, res, next) => {
  return res.status(200).json({
    resource: true,
  });
};

module.exports = {
  authGoolge,
  authFacebook,
  login,
  logout,
  register,
  refreshToken,
  secret,
};
