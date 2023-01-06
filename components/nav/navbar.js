import styles from './navbar.module.css';

import { useRouter } from "next/router";


import { useEffect, useState } from "react";

import Image from "next/image";


import { magic } from '../../lib/magic-client';

const Navbar = () => {

    const [showDropdown, setShowDropdown] = useState(false);
    const [username, setUsername] = useState("");
    const [didToken, setDidToken] = useState("");
    const router = useRouter();

    // This code is to display the appropriate username/email id on the navbar
    useEffect(() => {
        async function getUsername() {
          try {
            const { email } = await magic.user.getMetadata();

            const didToken = await magic.user.getIdToken();
            console.log({ didToken });
            if (email) {
              console.log(email);
              setUsername(email);
            }
          } catch (error) {
            console.log("Error retrieving email:", error);
          }
        }
        getUsername();
      }, []);

    const handleOnClickHome = (e) => {
        e.preventDefault();
        router.push("/");

    }

    const handleOnClickMyList = (e) => {
        e.preventDefault();
        router.push("/browse/my-list");
    }

    const handleShowDropdown = (e) => {
        e.preventDefault();
        setShowDropdown(!showDropdown);
    }

    const handleSignout = async (e) => {
        e.preventDefault();

        try {
          const response = await fetch("/api/logout", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${didToken}`,
              "Content-Type": "application/json",
            },
          });
    
          const res = await response.json();
        } catch (error) {
          console.error("Error logging out", error);
          router.push("/login");
        }
    }


    
    return (
        <div className={styles.container}>
            <div className={styles.wrapper}>
                <a className={styles.logoLink}>
                    <div className={styles.logoWrapper}>
                        <Image
                        src="/static/netflix.svg"
                        alt="Netflix logo"
                        width={128}
                        height={34}
                        />
                    </div>
                </a>
            




            <ul className={styles.navItems}>
                <li className={styles.navItem} onClick={handleOnClickHome}> Home </li>
                <li className={styles.navItem2} onClick={handleOnClickMyList}> My List </li>
            </ul>

            <nav className={styles.navContainer}>
                <div>
                    <button className={styles.usernameBtn} onClick={handleShowDropdown}>
                        <p className={styles.username}>{username}</p>
                        {/*Expand more Icon*/}
                        <Image 
                            src="/static/expand_more.svg" 
                            alt="Expand dropdown" 
                            width={24} 
                            height={24}
                            color= "white"
                        />
                    </button>

                    {showDropdown && (
                        <div className={styles.navDropdown}>
                            <div>
                                <a className={styles.linkName} onClick={handleSignout}>
                                    Sign Out
                                </a>
                                <div className={styles.lineWrapper}></div>
                            </div>
                        </div>
                    )}
                </div>
            </nav>
            </div>


            
        </div>
    )
}

export default Navbar;