'use strict';

var router = require('express').Router();
var passport = require('passport');
var TwitterStrategy = require('passport-twitter');

var User = require('../api/users/user.model');
var AS = require('./authsecrets')

router.get('/', passport.authenticate('twitter'));

router.get('/callback', passport.authenticate('twitter', {
  successRedirect: '/stories',
  failureRedirect: '/signup'
}));

passport.use(new TwitterStrategy({
  consumerKey: AS.twitter.consumerKey,
  consumerSecret: AS.twitter.consumerSecret,
  callbackURL: AS.twitter.callbackURL
}, function (token, refreshToken, profile, done) {
  var info = {
    name: profile.displayName,
    // twitter may not provide an email, if so we'll just fake it
    email: profile.emails ? profile.emails[0].value : [profile.username , 'fake-auther-email.com'].join('@'),
    photo: profile.photos ? profile.photos[0].value : undefined
  };
  User.findOrCreate({
    where: {twitterId: profile.id},
    defaults: info
  })
  .spread(function (user) {
    done(null, user);
  })
  .catch(done);
}));

module.exports = router;
