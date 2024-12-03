import passport from "passport";
import db from '../../../lib/db';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:3000/api/auth/callback",
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const userEmail = profile.emails[0].value;

    // Cek jika user sudah ada di database
    db.query('SELECT * FROM users WHERE email = ?', [userEmail], (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return done(err);
      }

      // Jika user sudah ada, return data user
      if (result.length > 0) {
        return done(null, result[0]);
      } else {
        // Jika user belum ada, buat user baru
        const formattedDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
        const sql = 'INSERT INTO users (email, name, role, tgl_register) VALUES (?, ?, ?, ?)';
        db.query(sql, [userEmail, profile.displayName, 'member', formattedDate], (err, result) => {
          if (err) {
            return done(err);
          }

          // Return data user setelah insert
          return done(null, {
            id: result.insertId,
            email: userEmail,
            name: profile.displayName,
            role: 'member'
          });
        });
      }
    });
  } catch (err) {
    return done(err);
  }
}));

// Serialisasi dan deserialisasi user
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  db.query('SELECT * FROM users WHERE id = ?', [id], (err, result) => {
    if (err) {
      return done(err);
    }
    done(null, result[0]);
  });
});

export const handleLogout = async () => {
  try {
    await signOut({ callbackUrl: '/login' }); // Redirect ke halaman login setelah logout
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};