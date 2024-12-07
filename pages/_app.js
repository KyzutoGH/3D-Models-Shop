import { GoogleOAuthProvider } from '@react-oauth/google';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <GoogleOAuthProvider clientId = {process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
      <Component {...pageProps} />
    </GoogleOAuthProvider>
  );
}

export default MyApp;
