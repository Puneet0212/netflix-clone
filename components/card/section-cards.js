import styles from './section-cards.module.css';
import Link from 'next/link';
import clsx from "classnames";
import Card from './card';

const SectionCards = (props) => {
    const { title, videos=[], size, shouldWrap=false, shouldScale } = props;

    // console.log({videos});
    return (
        <section className={styles.container}>
            <h2 className={styles.title}>{title}</h2>
            <div className={clsx(styles.cardWrapper, shouldWrap && styles.wrap)}>       
                {videos.map((video, idx) => {
                    // console.log('video',video.id);
                    return <Link href={`/video/${video.id}`}>
                                <Card
                                    imgUrl={video.imgUrl}
                                    size={size}
                                    id={idx}
                                    shouldScale={shouldScale}
                                />
                            </Link>
                    
                })}
                
            </div>
        </section>
    )
};

export default SectionCards;