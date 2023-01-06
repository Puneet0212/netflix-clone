//This file has been created to get only the required data from the vast amount of data that we get from youtube API

import videoTestData from '../data/videos.json';
import { getWatchedVideos, getMyListVideos } from './db/hasura';

// To use dummy data when we are testing the site to save the youtube quota
const fetchVideos = async(url) => {
    const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
    const BASE_URL = "youtube.googleapis.com/youtube/v3";
    
    // https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=25&q=disney%20trailer&type=videos&key=[YOUR_API_KEY]
    const response = await fetch(`https://${BASE_URL}/${url}&key=${YOUTUBE_API_KEY}`);
    return await response.json();

}

export const getCommonVideos = async (url) => {

    // const isDev = process.env.DEVELOPMENT;
    // const data = isDev ? videoTestData : await fetchVideos(url);

    const data = await fetchVideos(url);



    return data && data.items? data.items.map((item) => {

        const id = item.id?.videoId || item.id;
        const snippet = item.snippet;
        return {
            title: snippet.title ,
            imgUrl: `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`,
            id,
            description: snippet.description,
            publishTime: snippet.publishAt,
            channelTitle: snippet.channelTitle,
            statistics: item.statistics? item.statistics : {viewCount:0},
        };
    })  :   [];
};


export const getVideos = (searchQuery) => {
    const URL = `search?part=snippet&maxResults=25&q=${searchQuery}&type=videos`;
    return getCommonVideos(URL);
}

export const getPopularVideos = () => {
    // videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&maxResults=25&regionCode=US

    const URL = "videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&maxResults=25&regionCode=US";
    return getCommonVideos(URL);
}

//To display all the videos on the modal page
export const getYoutubeVideoById = (videoId) => {
    // videos?part=snippet%2CcontentDetails%2Cstatistics&id=Ks-_Mh1QhMc

    const URL = `videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoId}`;
    return getCommonVideos(URL);
};


export const getWatchItAgainVideos = async (userId, token) => {
    const videos = await getWatchedVideos(userId, token);
    return videos?.map((video) => {
        return {
            id: video.videoId,
            imgUrl: `https://i.ytimg.com/vi/${video.videoId}/maxresdefault.jpg`

        }
    });
}


export const getMyList = async (userId, token) => {
    const videos = await getMyListVideos(userId, token);
    return videos?.map((video) => {
        return {
            id: video.videoId,
            imgUrl: `https://i.ytimg.com/vi/${video.videoId}/maxresdefault.jpg`

        }
    });
}