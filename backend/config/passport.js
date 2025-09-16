const passport = require('passport');
const googleStrategy = require('../auth/strategies/googleStrategy');
const facebookStrategy = require('../auth/strategies/facebookStrategy');

googleStrategy(passport);
facebookStrategy(passport);

module.exports = passport;