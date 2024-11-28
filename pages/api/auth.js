import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import jwt from 'jsonwebtoken';
import db from '../../lib/db';

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:3000/api/auth/callback"
}, (token, tokenSecret, profile, done) => {
  db.query('SELECT * FROM users WHERE email = ?', [profile.emails[0].value], (err, result) => {
    if (err) return done(err);
    if (result.length > 0) {
      return done(null, result[0]);
    } else {
      db.query('INSERT INTO users (email, name, role) VALUES (?, ?, ?)', [profile.emails[0].value, profile.displayName, 'user'], (err, result) => {
        if (err) return done(err);
        return done(null, { id: result.insertId, email: profile.emails[0].value, name: profile.displayName });
      });
    }
  });
}));

export default function handler(req, res) {
  if (req.method === 'GET') {
    passport.authenticate('google', {
      scope: ['email', 'profile']
    })(req, res);
  } else if (req.method === 'POST') {
    passport.authenticate('google', (err, user) => {
      if (err) return res.status(500).json({ error: 'Authentication failed' });

      // Generate JWT token
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      return res.status(200).json({ token });
    })(req, res);
  }
}
  