import styles from './card.module.css';
import Image from "next/image";

import { useState } from 'react';

import { motion } from "framer-motion";  //To add animation to the cards

import cls from "classnames";

const Card = (props) => {

    const {imgUrl="/static/cliffor.png", size="medium", id, shouldScale=true} = props;

    const [imgSrc, setImgSrc] = useState(imgUrl);
    
    const classMap = {
        large: styles.lgItem,
        medium: styles.mdItem,
        small: styles.smItem,
    }

    const handleOnError = () => {
        setImgSrc(
            "https://images.unsplash.com/photo-1485846234645-a62644f84728?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1340&q=80"
          );
    };

    const scale = id === 0 ? {scaleY: 1.1} : {scale:1.1}; //Scaling for first card is only on Y-axis and for the other cards it's on both the axes

    const shouldHover = shouldScale && {
        whileHover: { ...scale },
    }

    return (
        <div className={styles.container}>
            <motion.div 
                className={cls(styles.imgMotionWrapper, classMap[size])}
                {...shouldHover}
                >
                <Image 
                    src={imgSrc} 
                    alt="clifford" 
                    layout="fill"
                    onError={handleOnError}
                    className={styles.cardImg} 
                />
            </motion.div>
        </div>
    )
} 

export default Card;
