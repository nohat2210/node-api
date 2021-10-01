const passport = require('passport');
const jwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const { JWT_ACCESS_TOKEN_SECRET, oauth } = require('../configs');
const GooglePlusStrategy = require('passport-google-plus-token');
const FacebookStrategy = require('passport-facebook-token');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');
const createError = require('http-errors');

//Passport JWT
passport.use(
  new jwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken('Authorization'),
      secretOrKey: JWT_ACCESS_TOKEN_SECRET,
    },
    async (payload, done) => {
      try {
        const user = await User.findById(payload.aud);
        if (!user) return done(null, false);
        done(null, user);
      } catch (error) {
        done(error, false);
      }
    }
  )
);

//Passport GOOGLE
passport.use(
  new GooglePlusStrategy(
    {
      clientID: oauth.google.CLIENT_ID,
      clientSecret: oauth.google.CLIENT_SECRET,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        //check whether this current user exists in our db
        const user = await User.findOne({
          authGoogleID: profile.id,
          authType: 'google',
        });

        if (user) return done(null, user);

        // if new account, create a new user
        const newUser = new User({
          authType: 'google',
          authGoogleID: profile.id,
          email: profile.emails[0].value,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
        });
        await newUser.save();
        done(null, newUser);
      } catch (error) {
        done(error, false);
      }
    }
  )
);

//Passport FACEBOOK
passport.use(
  new FacebookStrategy(
    {
      clientID: oauth.facebook.APP_ID,
      clientSecret: oauth.facebook.APP_SECRET,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = await User.findOne({
          authFacebookID: profile.id,
          authType: 'facebook',
        });
        if (user) return done(null, user);

        // if new account, create a new user
        const newUser = new User({
          authType: 'facebook',
          authFacebookID: profile.id,
          email: profile.emails[0].value,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
        });
        await newUser.save();
        done(null, newUser);
      } catch (error) {
        done(error, false);
      }
    }
  )
);

//Passport LOCAL
passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      try {
        const user = await User.findOne({ email });
        if (!user) return done(null, false);
        //check pass
        const isCorrectPassword = await user.isValidPassword(password);
        if (!isCorrectPassword) return done(null, false);
        done(null, user);
      } catch (error) {
        done(error, false);
      }
    }
  )
);
