const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const redisClient = require('../redis_connect');

const {
  JWT_ACCESS_TOKEN_SECRET,
  JWT_REFRESH_TOKEN_SECRET,
} = require('../configs');

const generateAccessToken = userID => {
  return new Promise((resolve, reject) => {
    const payload = {};
    const secretKey = JWT_ACCESS_TOKEN_SECRET;
    const options = {
      expiresIn: '30m',
      issuer: 'underdog94',
      audience: userID,
    };
    jwt.sign(payload, secretKey, options, (err, token) => {
      if (err) {
        console.log(err.message);
        reject(createError.InternalServerError());
      }
      resolve(token);
    });
  });
};

const generateRefreshToken = userID => {
  return new Promise((resolve, reject) => {
    const payload = {};
    const secretKey = JWT_REFRESH_TOKEN_SECRET;
    const options = {
      expiresIn: '1y',
      issuer: 'underdog94',
      audience: userID,
    };
    jwt.sign(payload, secretKey, options, (err, token) => {
      if (err) {
        console.log(err.message);
        reject(createError.InternalServerError());
      }
      redisClient.SET(userID, token, 'EX', 365 * 24 * 60 * 60, (err, reply) => {
        if (err) {
          console.log(err.message);
          reject(createError.InternalServerError());
          return;
        }
        resolve(token);
      });
    });
  });
};

const verifyRefreshToken = refreshToken => {
  return new Promise((resolve, reject) => {
    jwt.verify(refreshToken, JWT_REFRESH_TOKEN_SECRET, (err, payload) => {
      if (err) throw reject(createError.Unauthorized());
      const userID = payload.aud;
      redisClient.GET(userID, (err, result) => {
        if (err) {
          console.log(err.message);
          reject(createError.InternalServerError());
          return;
        }
        if (refreshToken === result) return resolve(userID);
        reject(createError.Unauthorized());
      });
      resolve(userID);
    });
  });
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
};
