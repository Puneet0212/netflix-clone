import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { magic } from "../lib/magic-client";
import "../styles/globals.css";

import Loading from "../components/loading/loading";

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleLoggedIn = async () => {
      const isLoggedIn = await magic.user.isLoggedIn();
      if (isLoggedIn) {
        // route to /
        router.push("/");
      } else {
        // route to /login
        router.push("/login");
      }
    };
    handleLoggedIn();
  }, []);

  useEffect(() => {
    const handleComplete = () => {
      setIsLoading(false);
    };
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  }, [router]);
  return isLoading ? <Loading /> : <Component {...pageProps} />;
}

export default MyApp;

































// import '../styles/globals.css'
// import Head from 'next/head';
// import { Inter } from '@next/font/google';

// import { useEffect, useState } from 'react';

// import { useRouter } from 'next/router';        

// import { magic } from "../lib/magic-client";

// import Loading from "../components/loading/loading";


// // If loading a variable font, you don't need to specify the font weight
// const inter = Inter()

// export default function MyApp({ Component, pageProps }) {
//   const router = useRouter();
//   const [isLoading, setIsLoading] = useState(true);
//   // if the user is already logged in --> Route to '/'

//   // Else if the user is not logged in --> Route to '/login'

//   useEffect(() => {

//     async function setInitialRoute() {
//       const isLoggedIn = await magic.user.isLoggedIn();
//       if (isLoggedIn)  {
//         //route to /
//         router.push('/');
      
//       } else {
//         // route to /login
//         router.push('/login');
//       }
//     }

//     setInitialRoute();
//   }, []);

//   // Check router nextJS docs
//   useEffect(() => {
//     const handleComplete = () => {
//         setIsLoading(false);
//     };

//     router.events.on("routeChangeComplete", handleComplete);
//     router.events.on("routeChangeError", handleComplete);

//     return () => {
//         router.events.off("routeChangeComplete", handleComplete);
//         router.events.off("routeChangeError", handleComplete);
//     };        
// },[router]);

//   // isLoading is added to display "Loading..." on the window when { the user is not logged in and we have to display/route the login pg directly when the user wants to go to the home pg }
//   return  (
//     <>
//         <Head>
//           <link rel="preconnect" href="https://fonts.googleapis.com" /> 
//           <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin /> 
//           <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@700&display=swap" rel="stylesheet" />
//         </Head>
        
//         <main className={inter.className}>
//           <Component {...pageProps} />
//         </main>
//     </>
    
//   )
// }
// // function MyApp({ Component, pageProps }) {
// //   return
// //   <>
// //     <Head>

// //     </Head>
// //      <Component {...pageProps} />
// //   </>
  
// // }

// // export default MyApp




