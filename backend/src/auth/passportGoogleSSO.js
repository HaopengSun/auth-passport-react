const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const User = require("../models/user");

const GOOGLE_CALLBACK_URL = "http://localhost:5000/api/v1/auth/google/callback";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: GOOGLE_CALLBACK_URL,
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, callback) => {
      // get profile from Google account
      const GoogleUser = {
        fullName: `${profile.name.givenName} ${profile.name.familyName}`,
        email: profile.emails[0].value,
        picture: profile.photos[0].value,
        googleId: profile.id,
      };

      // retrieve or create a user
      const user = await User.findOrCreate({
        where: { googleId: profile.id },
        defaults: GoogleUser,
      }).catch((err) => {
        console.log("Error signing up", err);
        callback(err, null);
      });

      if (user && user[0]) {
        return callback(null, user && user[0]);
      }
    }
  )
);

passport.serializeUser((user, callback) => {
  console.log("Serializing user:", user);
  callback(null, user.id);
});

passport.deserializeUser(async (id, callback) => {
  const user = await User.findOne({ where: { id } }).catch((err) => {
    console.log("Error deserializing", err);
    callback(err, null);
  });

  if (user) {
    callback(null, user);
  }
});
