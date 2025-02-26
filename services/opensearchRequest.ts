import { opensearchAuth, opensearchSearchEndpoint } from "./config";

export async function opensearchRequest(query: any)  { 
    return fetch(
    opensearchSearchEndpoint,
    {
      method: "POST",
      headers: {
        Authorization: opensearchAuth,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(query),
      cache: "force-cache" 
    }
  ).then(resp => {
    return resp.json()
  });
}
