import GoogleLoginButton from '../components/GoogleLoginButton';

function MyApp({ Component, pageProps }) {
  return (
    <div>
      <GoogleLoginButton />
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
