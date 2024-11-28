import passport from 'passport';
import db from '../../../lib/db';
import jwt from 'jsonwebtoken';

export default function handler(req, res) {
  passport.authenticate('google', { failureRedirect: '/login' }, (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Authentication failed' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Redirect to profile with token
    res.redirect(`/profile?token=${token}`);
  })(req, res);
}
