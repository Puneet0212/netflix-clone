import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Modal from 'react-modal';
import styles from '../../styles/Video.module.css';
import clsx from "classnames";

import {getYoutubeVideoById} from '../../lib/videos';

import Navbar from "../../components/nav/navbar";
import Like from '../../components/icons/like-icon';
import DisLike from '../../components/icons/dislike-icon';

// Refer this for modal --> https://www.npmjs.com/package/react-modal#api-documentation
Modal.setAppElement('#__next');         //  --next is the root div of our project. We have to define setAppElement on root div


//ISR of the banner/Modal page

export async function getStaticProps(context) {
    // Parameters of the video on the modal page - Data To fetch from API
    // const video = {
    //     title: "Hi cute dog",
    //     publishTime: "1990-01-01",
    //     description: "A big red dog that is super cute, can he get any bigger? A big red dog that is super cute, can he get any bigger? A big red dog that is super cute, can he get any bigger? A big red dog that is super cute, can he get any bigger? A big red dog that is super cute, can he get any bigger? A big red dog that is super cute, can he get any bigger? A big red dog that is super cute, can he get any bigger? A big red dog that is super cute, can he get any bigger? A big red dog that is super cute, can he get any bigger? A big red dog that is super cute, can he get any bigger? A big red dog that is super cute, can he get any bigger? A big red dog that is super cute, can he get any bigger? A big red dog that is super cute, can he get any bigger? A big red dog that is super cute, can he get any bigger? A big red dog that is super cute, can he get any bigger?",
    //     channelTitle: "Paramount Pictures",
    //     viewCount: 10000,
    //   };
    

    const videoId = context.params.videoId; 
    let videoArray = await getYoutubeVideoById(videoId);
    videoArray = JSON.parse(JSON.stringify(videoArray));
    
    return {
        
      props: {
        video: videoArray.length>0 ? videoArray[0] : {},
        
      },
      // Next.js will attempt to re-generate the page:
      // - When a request comes in
      // - At most once every 10 seconds
      revalidate: 10, // In seconds
    }
  }

  
  export async function getStaticPaths() {
    const listOfVideos = ["mYfJxlgR2jw", "4zH5iYM4wJo", "KCPEHsAViiQ"];
  
    // Get the paths we want to pre-render based on posts
    const paths = listOfVideos.map((videoId) => ({
      params: { videoId },
    }))
  
    // We'll pre-render only these paths at build time.
    // { fallback: blocking } will server-render pages
    // on-demand if the path doesn't exist.
    return { paths, fallback: 'blocking' }
  }
  
  

const Video = ({ video }) => {
    const router = useRouter();
    const videoId = router.query.videoId; 

    const [toggleLike, setToggleLike] = useState(false);
    const [toggleDisLike, setToggleDisLike] = useState(false);

    const { title, publishTime, description, channelTitle, statistics : {viewCount} } = video;

    // YOU CAN'T USE ASYNC IN USEEFFECT() -> SO WRITE UR CODE IN THE FOLLOWINF FORMAT
    
    //   useEffect(() => {
    //     checkUserVerification();
    //  }, []);
    //  const checkUserVerification = async () => {
    //      await yourCode
    //  };
    
    
    useEffect(() => {                   // You can't use async in useEffect
      invokeStatsApiOnFrontEnd();
    }, []);


    const invokeStatsApiOnFrontEnd = async() => {
      const response = await fetch(`/api/stats?videoId=${videoId}`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();
      // console.log({ data });

      if (data.length > 0) {
        const favourited = data[0].favourited;
        if (favourited === 1) {
          setToggleLike(true);
        } else if(favourited === 0) {
          setToggleDisLike(true);
        }
      }
    }




    const runRatingService = async (favourited) => {
      return await fetch('/api/stats', {
        method: "POST",
        body: JSON.stringify({
          videoId,
          favourited,
        }),
        headers: {
          'Content-Type': 'application/json',
        }
      });
    } 

    const handleToggleDislike = async () => {

      const val = !toggleDisLike;
      setToggleDisLike(val);
      setToggleLike(toggleDisLike);

      const favourited = val? 0:1;
      const response = await runRatingService(favourited);
      // console.log("data", await response.json());


      
    }
    
    const handleToggleLike = async () => {

      const val = !toggleLike;
      setToggleLike(val);
      setToggleDisLike(toggleLike); 
      
      const favourited = val? 1:0;
      const response = await runRatingService(favourited);
      // console.log("data", await response.json());
    };


    return <div className={styles.conatiner}>  

                <Navbar />
                              
                <Modal
                    // The below attributes are very well explained in api docs--> reference book on the above website
                    isOpen={true}
                    contentLabel="Watch the Video"      //String indicating how the content container should be announced to screenreaders
                    onRequestClose={() => { router.back() }}  //To close the modal when esc is pressed
                    className={styles.modal} 
                    overlayClassName={styles.overlay}       // To apply styling to the overlay
                >
                    
                    <iframe id="ytplayer" type="text/html" width="100%" height="360"
                            className={styles.videoPlayer}
                            src={`https://www.youtube.com/embed/${videoId}?autoplay=0&origin=http://example.com&controls=0&rel=1`}
                            frameborder="0">
                    </iframe>



                    <div className={styles.likeDislikeBtnWrapper}>
                      
                      <div className={styles.likeBtnWrapper}>
                        <button onClick={handleToggleLike}>
                          <div className={styles.btnWrapper}>
                            <Like selected={toggleLike} />
                          </div>
                        </button>
                      </div>
                      

                      <button onClick={handleToggleDislike}>
                        <div className={styles.btnWrapper}>
                          <DisLike selected={toggleDisLike} />
                        </div>
                      </button>

                    </div>



                    <div className={styles.modalBody}>
                        <div className={styles.modalBodyContent}>
                            <div className={styles.col1}>
                                <p className={styles.publishTime}>{publishTime}</p>
                                <p className={styles.title}>{title}</p>
                                <p className={styles.description}>{description}</p>
                            </div>

                            <div className={styles.col2}>
                                <p className={clsx(styles.subText, styles.subTextWrapper)}>
                                    <span className={styles.textColor}>Cast: </span>
                                    <span className={styles.channelTitle}>{channelTitle}</span>
                                </p>
                                <p className={clsx(styles.subText, styles.subTextWrapper)}>
                                    <span className={styles.textColor}>View Count: </span>
                                    <span className={styles.channelTitle}>{viewCount}</span>
                                </p>
                            </div>
                        </div>
                    </div>
                
                </Modal>

            </div>;


};

export default Video;