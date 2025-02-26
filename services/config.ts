export const opensearchAuth = "Basic " + btoa(process.env.OPENSEARCH_USER + ":" + process.env.OPENSEARCH_PASSWORD);
export const opensearchSearchEndpoint = process.env.OPENSEARCH_SEARCH_ENDPOINT!