// Minimal Next.js App wrapper — add global styles here
import '../styles/globals.css'

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />
}
