import { magicAdmin } from "../../lib/magic-server";
import jwt from 'jsonwebtoken';         // We used this library for generating new jwt everytime link-> https://www.npmjs.com/package/jsonwebtoken
import { isNewUser, createNewUser } from "../../lib/db/hasura";
import { setTokenCookie } from "../../lib/cookies";

export default async function login(req, res) {
    if(req.method === "POST") {
        try{
            const auth = req.headers.authorization;     // Passing the Bearer Token from client to the server so that the server knows which user has logged in
            const didToken = auth? auth.substr(7) : " ";
            // console.log({ didToken });

            // Invoking Magic
            const metadata = await magicAdmin.users.getMetadataByToken(didToken);
            // console.log({ metadata });

            // Create JWT token
            const token = jwt.sign({
                ...metadata,
                iat: Math.floor(Date.now()/1000),
                eat: Math.floor(Date.now()/1000 + 7*24*60*60 ),
                "https://hasura.io/jwt/claims": {
                  "x-hasura-allowed-roles": ["user", "admin"],
                  "x-hasura-default-role": "user",
                  "x-hasura-user-id": `${metadata.issuer}`,
                }
              }, process.env.JWT_SECRET
              );

              // console.log({ token });

              // Check if user exists
              const isNewUserQuery = await isNewUser(token, metadata.issuer);

              isNewUserQuery && (await createNewUser(token, metadata));
              // Set the cookie
            setTokenCookie(token, res);
            res.send({ done: true});






            //   if(isNewUserQuery){
            //     // Create a new user
            //     const createNewUserMutation = await createNewUser(token, metadata);

            //     // Set the cookie
            //     const cookie = setTokenCookie(token, res);
            //     console.log({cookie});

            //     res.send({ done: true, msg: "is a New User"});
            // }
            //   else{
            //     // Return the token of the existing user
            //     // Set the cookie
            //     const cookie = setTokenCookie(token, res);
            //     console.log({cookie});
            //     res.send({ done: true, msg: "not a New User"});
            //   }
        
        
        }
    
        catch(error){
            console.error("Something went wrong logging in", error);
            res.status(500).send({ done: false});
        }    
    } else {
        res.send({ done: false});
    }
   
}


