// A SEPARATE file is created (to verify the token) because we want to do it in 2 files:
// 1. stats.js
// 2. index.js to verify and then pass the **userId**

import jwt from 'jsonwebtoken';

export async function verifyToken(token) {
    if(token) {
        // verify a token symmetric - synchronous
        // Got the below code from docs https://www.npmjs.com/package/jsonwebtoken
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decodedToken?.issuer;
        return userId;
    }
    return null;
}
