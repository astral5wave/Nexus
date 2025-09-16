const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
const User = require('../../models/userSchema');

function googleStrategy(passport) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CLIENT_CALLBACK_URL
  },
    async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ googleId: profile.id });

    if (!user) {
      const email = profile.emails?.[0]?.value;
      if (email) {
        user = await User.findOne({ email });
        if (user) {
          user.googleId = profile.id;
          await user.save();
        } else {
          user = await User.create({
            googleId: profile.id,
            email,
            name: profile.displayName
          });
        }
      }
    }

    done(null, { userId: user._id });
  } catch (err) {
    done(err, null);
  }
}))
}

module.exports = googleStrategy;
