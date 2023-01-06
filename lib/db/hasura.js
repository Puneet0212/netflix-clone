
export async function insertStats(
  token,
  { favourited, userId, watched, videoId } 
) {   
  const operationsDoc = `
  mutation insertStats($favourited: Int!, $userId: String!, $watched: Boolean!, $videoId: String!) {
    insert_stats_one(object: {
      favourited: $favourited, 
      userId: $userId, 
      videoId: $videoId, 
      watched: $watched
    }) {
          favourited,
          userId,
          videoId,
          watched,
        }
  }
`;
return await queryHasuraGQL(
  operationsDoc,
  "insertStats",
  { favourited, userId, watched, videoId },
  token  
);

}

export async function updateStats(
    token,
    { favourited, userId, watched, videoId } 
) {   
  const operationsDoc = `
  mutation updateStats($favourited: Int!, $userId: String!, $watched: Boolean!, $videoId: String!) {
    
    update_stats( 
      _set: {
        watched: $watched,
        favourited: $favourited
      },
      where: {
        videoId: {_eq: $videoId}, 
        userId: {_eq: $userId}
      }) {
        returning {
          favourited,
          userId,
          videoId,
          watched,
        }
    }
  }
  `;
return await queryHasuraGQL(
    operationsDoc,
    "updateStats",
    { favourited, userId, watched, videoId },
    token  
  );

}


export async function findVideoIdByUser(token, userId, videoId) {
  const operationsDoc = `
  query findVideoIdByUserId($userId: String!, $videoId: String!) {
    stats(where: {videoId: {_eq: $videoId}, userId: {_eq: $userId }}) {
      favourited
      id
      userId
      videoId
      watched
    }
  }
`;

  const response = await queryHasuraGQL(
    operationsDoc,
      "findVideoIdByUserId",
      {
        userId,
        videoId
      },
       token 
  );

  // console.log({ response })
  return response?.data?.stats;
}


export async function createNewUser(token, metadata) {    // JWT token
  const operationsDoc = `
  mutation createNewUser($issuer: String!, $email: String!, $publicAddress: String!) {
    insert_users(objects: {email: $email, issuer: $issuer, publicAddress: $publicAddress}) {
      returning {
        email
        id
        issuer
        publicAddress
      }
    }
  }
`;

const {issuer, email, publicAddress} = metadata;
  const response = await queryHasuraGQL(
    operationsDoc,
      "createNewUser",
      {issuer, email, publicAddress},
      token  
  );

  console.log({ response, issuer })
  return response;
}

export async function isNewUser(token, issuer) {    // JWT token
  const operationsDoc = `
  query isNewUser($issuer: String!) {
    users(where: {issuer: {_eq: $issuer}}) {
      email
      id
      issuer
      publicAddress
    }
  }
`;

  const response = await queryHasuraGQL(
    operationsDoc,
      "isNewUser",
      {issuer},
      token  
  );

  console.log({ response, issuer })
  return response?.data?.users?.length === 0;
}

export async function queryHasuraGQL(operationsDoc, operationName, variables, token) {
    const result = await fetch(
        process.env.NEXT_PUBLIC_HASURA_ADMIN_URL,       // This url came from POST section on the top in hasura website
      {
        method: "POST",
        headers: {
            //"x-hasura-admin-secret" : process.env.NEXT_PUBLIC_HASURA_ADMIN_SECRET,
            Authorization: `Bearer ${token}`,
            "Content-type": "application/json",
        },
        body: JSON.stringify({
          query: operationsDoc,
          variables: variables,         // To add something which is defined by the user such as watched=true
          operationName: operationName  // MyQuery
        })
      }
    );
  
    return await result.json();
  }

 

export async function getWatchedVideos(userId, token) {
  const operationsDoc = `
  query watchedVideos($userId: String!) {
    stats(where: {
      userId: {_eq: $userId}, 
      watched: {_eq: true}
    }) 
      {
      videoId
    }
  }
`;

const response = await queryHasuraGQL(
  operationsDoc,
    "watchedVideos",
    {
      userId
    },
      token 
);
  
return response?.data?.stats;
  
}
  
export async function getMyListVideos(userId, token) {
  const operationsDoc = `
  query favouritedVideos($userId: String!) {
    stats(where: {
      userId: {_eq: $userId}, 
      favourited: {_eq: 1}
    }) {
      videoId
    }
  }
`;

const response = await queryHasuraGQL(
  operationsDoc,
    "favouritedVideos",
    {
      userId
    },
      token 
);

return response?.data?.stats;

}






  
  //We don't need this bcoz it's just an example
//   const operationsDoc = `
//     query MyQuery {
//       users {
//         id
//         email
//         issuer
//         publicAddress
//       }
//     }
//   `;
  
  // function fetchMyQuery() {
  //   return queryHasuraGQL(
  //     operationsDoc,
  //     "MyQuery",
  //     {},
  //     "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3N1ZXIiOiJkaWQ6ZXRocjoweERmREQ2MDM3YWFjNjRiMERCNmI1NDM2ODQxZmRBMEZEZTVhMjZGMUQiLCJwdWJsaWNBZGRyZXNzIjoiMHhEZkRENjAzN2FhYzY0YjBEQjZiNTQzNjg0MWZkQTBGRGU1YTI2RjFEIiwiZW1haWwiOiJwc3A2MjIwNzNAZ21haWwuY29tIiwib2F1dGhQcm92aWRlciI6bnVsbCwicGhvbmVOdW1iZXIiOm51bGwsIndhbGxldHMiOltdLCJpYXQiOjE2NzIzODAxMjYsImVhdCI6MTY3Mjk4NDkyNiwiaHR0cHM6Ly9oYXN1cmEuaW8vand0L2NsYWltcyI6eyJ4LWhhc3VyYS1hbGxvd2VkLXJvbGVzIjpbInVzZXIiLCJhZG1pbiJdLCJ4LWhhc3VyYS1kZWZhdWx0LXJvbGUiOiJ1c2VyIiwieC1oYXN1cmEtdXNlci1pZCI6ImRpZDpldGhyOjB4RGZERDYwMzdhYWM2NGIwREI2YjU0MzY4NDFmZEEwRkRlNWEyNkYxRCJ9fQ.NOaf-NxoN1yCZA3LlmRVGY1-s_SguL2nmm8PvPx_aeQ"
  //   );
  // }
  
  // export async function startFetchMyQuery() {
  //   const { errors, data } = await fetchMyQuery();
  
  //   if (errors) {
  //     // handle those errors like a pro
  //     console.error(errors);
  //   }
  
  //   // do something great with this precious data
  //   console.log(data);
  // }
  
