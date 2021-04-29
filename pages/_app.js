import '../styles/globals.css'
import { useEffect } from "react"

function MyApp({ Component, pageProps }) {
  function handler() {
    let vh = window.innerHeight * 0.01;
    // Then we set the value in the --vh custom property to the root of the document
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }

  useEffect(() => {
    window.addEventListener("resize", handler)
    return () => { window.removeEventListener("resize", handler) }
  })
  
  return <Component {...pageProps} />
}

export default MyApp
