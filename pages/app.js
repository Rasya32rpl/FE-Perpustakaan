// pages/_app.js
import '../styles/globals.css';

// Import Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;
