import { findVideoIdByUser, updateStats, insertStats } from '../../lib/db/hasura';
import { verifyToken } from '../../lib/utils';

export default async function stats (req, resp) {


    try {

        const token = req.cookies.token;
        if(!token) {            // Condition for invalid users
            resp.status(403).send({});      // status(403) is forbidden status which is set for invalid/mallicious users
        } else { 

            const inputParams = req.method === "POST" ? req.body : req.query;
            const { videoId } = inputParams;          // We have hardcoded these 3 parameters in Body Tab of Postman
            
            if(videoId) {
        
                const userId = await verifyToken(token);
                const findVideo = await findVideoIdByUser(token, userId, videoId);

                const doesStatsExist = findVideo?.length>0;

                if (req.method === "POST") {

                    const { favourited, watched=true } = req.body;          // We have hardcoded these 3 parameters in Body Tab of Postman

                    if (doesStatsExist) {
                        // update it
                        const response = await updateStats(token, {
                        favourited,
                        watched,
                        userId,
                        videoId,
                        });
                        resp.send({data : response });

                    } else {
                        // add it
                        const response = await insertStats(token, {
                            favourited,
                            watched,
                            userId,
                            videoId,
                        });
                        resp.send({ data: response });
                    }



                } else {        // For GET request (to know if the video has already been liked or not)
                    
                    if (doesStatsExist) {
                        resp.send(findVideo);                        
                    } else {
                       resp.status(404);
                       resp.send({ user: null, msg: "Video not found"});
                    }
                }

            }
        }




    } catch (error) {
        console.error("Error occured /stats", error);
        resp.status(500).send({ done: false, error: error?.message});
    }

}

