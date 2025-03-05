import { opensearchAuth, opensearchSearchEndpoint } from "./config";
import { createClient } from 'redis';

async function opensearchRequestHelper(query: any)  { 
    const requestBodyString = JSON.stringify(query)

    const redisConnection = await createClient({url: process.env.REDIS_URL!}).connect()
    
    const cachedResponse = await redisConnection.get(requestBodyString)
    
    if(cachedResponse!){
      return JSON.parse(cachedResponse)
    }else{
      const response = await fetch(
        opensearchSearchEndpoint,
        {
          method: "POST",
          headers: {
            Authorization: opensearchAuth,
            "Content-Type": "application/json",
          },
          body: requestBodyString
        }
      ).then(resp => {
        return resp.json()
      });

      await redisConnection.set(requestBodyString, JSON.stringify(response))
      return response
    }


}

export async function opensearchRequest(query: any)  {
  try{
    return await opensearchRequestHelper(query)
  } catch (error) {
    console.log("error when contacting redis or opensearch")
    console.log(error)
  }
}
