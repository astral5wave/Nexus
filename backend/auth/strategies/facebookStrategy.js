const { Strategy: FacebookStrategy } = require('passport-facebook');
const User = require('../../models/userSchema');

function facebookStrategy(passport) {
  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: process.env.FACEBOOK_CLIENT_CALLBACK_URL,
    profileFields: ['id', 'emails', 'name', 'displayName']
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ facebookId: profile.id });
      if (!user) {
        const email = profile.emails?.[0]?.value;
        if (email) {
          user = await User.findOne({ email });
          if (user) {
            user.facebookId = profile.id;
            await user.save();
          } else {
            user = await User.create({
              facebookId: profile.id,
              email,
              name: profile.displayName || `${profile.name.givenName} ${profile.name.familyName}`
            });
          }
        }
      }
      done(null, { userId: user._id });
    } catch (err) {
      done(err, null);
    }
  }));
}

module.exports = facebookStrategy;
