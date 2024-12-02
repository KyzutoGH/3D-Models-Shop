import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import jwt from 'jsonwebtoken';
import db from '../../lib/db';
import {runMiddleware} from '../../lib/middleware';


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

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // Start Google Authentication
    await runMiddleware(req, res, passport.authenticate('google', { scope: ['email', 'profile'] }));
  } else if (req.method === 'POST') {
    // Handle Google Callback
    await runMiddleware(req, res, passport.authenticate('google', { session: false }));

    // Generate JWT token
    const user = req.user; // User is set by Passport
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token });
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}