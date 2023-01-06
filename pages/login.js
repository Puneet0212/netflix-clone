import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Login.module.css';

import { useState, useEffect } from 'react';

import { useRouter } from 'next/router';        //To route our login page to home page when we put valid email id

import { magic } from "../lib/magic-client";

const Login = () => {

    const [ userMsg, setUserMsg ] = useState('');   // To set the user msg when email is not input
    const [ email, setEmail ] = useState("");   //We use this to pass on the email between the below two functions
    const router = useRouter();

    const [ isLoading, setIsLoading ] = useState(false);   // To show a loading state when the user clicks on the sign in button


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
    },[router]);

    const handleOnChangeEmail = (e) => {
        setUserMsg("");                 //clearing the previous user Msg if any
        const email = e.target.value;   //Taking the actual user input email from the Input box
        setEmail(email);
       //  console.log(email);
    }

    const handleLoginWithEmail = async (e) => {
        // console.log("hi button");
        e.preventDefault();

        // after clicking on sign in button, checking if the email exists or not
        if(email){

                // log in a user by their email
                try {
                    setIsLoading(true);

                    const didToken = await magic.auth.
                    loginWithMagicLink({ 
                        email: email
                    });
                    console.log(didToken);
                    

                    if(didToken) {

                        const response = await fetch("/api/login", {
                            method: "POST",
                            headers: {
                                Authorization: `Bearer ${didToken}`,
                                "Content-Type": "aaplication/json",
                            },
                        });

                        const loggedInResponse = await response.json();
                        if(loggedInResponse) {
                            // console.log({ loggedInResponse });
                            //route to dashboard
                            router.push("/");
                        }
                        else {
                            setIsLoading(false);
                            setUserMsg("Something went wrong logging in");
                        }   
                    }
                } 
                
                catch(error) {
                    setIsLoading(false);
                    // Handle errors if required!
                    console.error("Something went wrong logging in", error);
                }

            // // If it is a string other than "puneet@gmail.com"
            // else {
            //     setIsLoading(false);
            //     setUserMsg("Something went wrong logging in");
            // }
            
        }
        else{
            setIsLoading(false);
            // show user Message
            setUserMsg("Enter a valid email address");
        }
    };


    return (
        <div className={styles.container}>
            <Head>
                <title>Netflix Sign In</title>
            </Head>

            <header className={styles.header}>
                <div className={styles.headerWrapper}>
                    <a className={styles.logoLink} href="/">
                        <div className={styles.logoWrapper}>
                            <Image 
                                src="/static/netflix.svg" 
                                alt="Netflix Logo" 
                                width={128} 
                                height={34}
                            />
                        </div>
                    </a>
                </div>
            </header>

                <main className={styles.main}>

                    <div className={styles.mainWrapper}>
                        <h1 className={styles.signinHeader}>Sign In</h1>

                        <input 
                            type="text" 
                            placeholder="Email address"
                            className={styles.emailInput}
                            onChange={handleOnChangeEmail}
                        />

                        <p className={styles.userMsg}> {userMsg} </p>

                        <button onClick={handleLoginWithEmail} className={styles.loginBtn}>
                            { isLoading? 'Loading...' : 'Sign In' }
                        </button>
                    </div> 
                </main> 
        </div>


        
    );
};

export default Login;