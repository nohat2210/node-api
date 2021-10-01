module.exports = {
  JWT_ACCESS_TOKEN_SECRET: process.env.JWT_ACCESS_TOKEN_SECRET,
  JWT_REFRESH_TOKEN_SECRET: process.env.JWT_REFRESH_TOKEN_SECRET,
  oauth: {
    google: {
      CLIENT_ID: process.env.GOOGLE_ClIENT_ID,
      CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    },
    facebook: {
      APP_ID: process.env.FACEBOOK_APP_ID,
      APP_SECRET: process.env.FACEBOOK_APP_SECRET,
    },
  },
};
