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
    async (accessToken, refreshToken, profile, done) => {
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
        done(err, null);
      });

      if (user && user[0]) {
        return done(null, user && user[0]);
      }
    }
  )
);

// Implement serialization and deserialization functions
// to control how user information is stored in and retrieved from the session.
passport.serializeUser((user, done) => {
  console.log("Serializing user:", user);
  done(null, user.id);
});

passport.deserializeUser(async (id, caldonelback) => {
  const user = await User.findOne({ where: { id } }).catch((err) => {
    console.log("Error deserializing", err);
    done(err, null);
  });

  if (user) {
    done(null, user);
  }
});
